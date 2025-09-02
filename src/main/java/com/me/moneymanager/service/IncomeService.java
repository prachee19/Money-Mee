package com.me.moneymanager.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.me.moneymanager.dto.ExpenseDTO;
import com.me.moneymanager.dto.IncomeDTO;
import com.me.moneymanager.entity.CategoryEntity;
import com.me.moneymanager.entity.ExpenseEntity;
import com.me.moneymanager.entity.IncomeEntity;
import com.me.moneymanager.entity.ProfileEntity;
import com.me.moneymanager.repository.CategoryRepository;
import com.me.moneymanager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;
    private final ProfileService profileService;

    // Adds a new expense to the database
    public IncomeDTO addIncome(IncomeDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        IncomeEntity newIncome = toEntity(dto, profile, category);
        newIncome = incomeRepository.save(newIncome);
        return toDTO(newIncome);
    }

    public List<IncomeDTO> getCurrentMonthIncomesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return list.stream().map(this::toDTO).toList();
    }

    // delete income by id for current user
    public void deleteIncome(Long incomeId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity entity = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!entity.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized to delete this income");
        }

        incomeRepository.delete(entity);
    }

    // Get latest 5 incomes for current user
    public List<IncomeDTO> getLatest5IncomesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDTO).toList(); // Assumes a toDTO method exists for IncomeEntity
    }

    // Get total incomes for current user
    public BigDecimal getTotalIncomeForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = incomeRepository.findTotalIncomeByProfileId(profile.getId());
        return total != null ? total : BigDecimal.ZERO;
    }

    // filter expenses
    public List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
                profile.getId(), startDate, endDate, keyword, sort);
        return list.stream().map(this::toDTO).toList();
    }

    public List<IncomeDTO> getAllIncomesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile(); // use profile service
        List<IncomeEntity> incomes = incomeRepository.findByProfileId(profile.getId()); // get all incomes for profile
        return incomes.stream()
                .map(this::toDTO) // use your existing converter
                .toList();
    }

    // =======================
    // Generate Excel for incomes
    // =======================
    public ByteArrayInputStream generateIncomeExcel() throws IOException {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());

        // Fetch current month incomes
        List<IncomeEntity> incomes = incomeRepository.findByProfileIdAndDateBetween(
                profile.getId(), startDate, endDate);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Income");

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Name");
            headerRow.createCell(2).setCellValue("Category");
            headerRow.createCell(3).setCellValue("Amount");
            headerRow.createCell(4).setCellValue("Date");

            // Fill data rows
            int rowIdx = 1;
            for (IncomeEntity income : incomes) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(income.getId());
                row.createCell(1).setCellValue(income.getName());
                row.createCell(2).setCellValue(
                        income.getCategory() != null ? income.getCategory().getName() : "N/A");
                row.createCell(3).setCellValue(income.getAmount().doubleValue());
                row.createCell(4).setCellValue(income.getDate().toString());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    // helper methods
    private IncomeEntity toEntity(IncomeDTO dto, ProfileEntity profile, CategoryEntity category) {
        return IncomeEntity.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .profile(profile)
                .category(category)
                .build();
    }

    private IncomeDTO toDTO(IncomeEntity newIncome) {
        return IncomeDTO.builder()
                .id(newIncome.getId())
                .name(newIncome.getName())
                .icon(newIncome.getIcon())
                .categoryId(newIncome.getCategory() != null ? newIncome.getCategory().getId() : null)
                .categoryName(newIncome.getCategory() != null ? newIncome.getCategory().getName() : "N/A")
                .amount(newIncome.getAmount())
                .date(newIncome.getDate())
                .createdAt(newIncome.getCreatedAt())
                .updatedAt(newIncome.getUpdatedAt())
                .build();
    }

}
