package com.me.moneymanager.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.me.moneymanager.dto.ExpenseDTO;
import com.me.moneymanager.entity.CategoryEntity;
import com.me.moneymanager.entity.ExpenseEntity;
import com.me.moneymanager.entity.ProfileEntity;
import com.me.moneymanager.repository.CategoryRepository;
import com.me.moneymanager.repository.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final ProfileService profileService;

    private final IncomeService incomeService;

    // Adds a new expense to the database
    public ExpenseDTO addExpense(ExpenseDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        ExpenseEntity newExpense = toEntity(dto, profile, category);
        newExpense = expenseRepository.save(newExpense);
        return toDTO(newExpense);
    }

    // Retrive all expenses for current month/based on start date and end date
    public List<ExpenseDTO> getCurrentMonthExpensesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return list.stream().map(this::toDTO).toList();
    }

    // delete expense by id for current user
    public void deleteExpense(Long expenseId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        ExpenseEntity entity = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!entity.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized to delete this expense");
        }
        expenseRepository.delete(entity);
    }

    // Get latest 5 expenses for current user
    public List<ExpenseDTO> getLatest5ExpensesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> list = expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDTO).toList();
    }

    // Get total expenses for current user
    public BigDecimal getTotalExpenseForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = expenseRepository.findTotalExpenseByProfileId(profile.getId());
        return total != null ? total : BigDecimal.ZERO;
    }

    public List<ExpenseDTO> getAllExpensesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile(); // use profile service
        List<ExpenseEntity> expenses = expenseRepository.findByProfileId(profile.getId()); // fetch all expenses
        return expenses.stream()
                .map(this::toDTO) // use your own DTO converter
                .toList();
    }

    // filter expenses
    public List<ExpenseDTO> filterExpenses(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> list;

        try {
            BigDecimal amount = new BigDecimal(keyword);
            list = expenseRepository.findByProfileIdAndDateBetweenAndAmount(
                    profile.getId(), startDate, endDate, amount, sort);

        } catch (NumberFormatException e) {
            list = expenseRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
                    profile.getId(), startDate, endDate, keyword, sort);

        }

        return list.stream().map(this::toDTO).toList();
    }

    // Notifications
    public List<ExpenseDTO> getExpensesForUserOnDate(Long profileId, LocalDate date) {
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDate(profileId, date);
        return list.stream().map(this::toDTO).toList();
    }

    // helper methods
    private ExpenseEntity toEntity(ExpenseDTO dto, ProfileEntity profile, CategoryEntity category) {
        return ExpenseEntity.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .profile(profile)
                .category(category)
                .build();
    }

    private ExpenseDTO toDTO(ExpenseEntity entity) {
        return ExpenseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .icon(entity.getIcon())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : "N/A")
                .amount(entity.getAmount())
                .date(entity.getDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    // inject your IncomeService to get total income

    /**
     * Get spending suggestions for current month
     */
    public Map<String, String> getSpendingSuggestions() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());

        BigDecimal totalIncome = incomeService.getTotalIncomeForCurrentUser();

        List<ExpenseEntity> expenses = expenseRepository.findByProfileIdAndDateBetween(
                profile.getId(), startDate, endDate);

        Map<String, BigDecimal> categoryTotals = new HashMap<>();
        for (ExpenseEntity e : expenses) {
            String cat = e.getCategory() != null ? e.getCategory().getName() : "Uncategorized";
            categoryTotals.put(cat, categoryTotals.getOrDefault(cat, BigDecimal.ZERO).add(e.getAmount()));
        }

        Map<String, String> suggestions = new HashMap<>();

        BigDecimal totalExpense = expenses.stream()
                .map(ExpenseEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal ratio = totalExpense.divide(totalIncome, 2, RoundingMode.HALF_UP);
        if (ratio.compareTo(new BigDecimal("1.0")) > 0) {
            suggestions.put("Overall", "You exceeded your income this month!");
        } else if (ratio.compareTo(new BigDecimal("0.8")) > 0) {
            suggestions.put("Overall", "You spent over 80% of your income. Consider saving more.");
        }

        // Category-wise
        for (Map.Entry<String, BigDecimal> entry : categoryTotals.entrySet()) {
            BigDecimal catRatio = entry.getValue().divide(totalIncome, 2, RoundingMode.HALF_UP);
            if (catRatio.compareTo(new BigDecimal("0.2")) > 0) {
                suggestions.put(entry.getKey(),
                        "High spending in this category: " + entry.getValue()
                                + ". It is "
                                + catRatio.multiply(new BigDecimal("100")).setScale(0, RoundingMode.HALF_UP)
                                + "% of your income.");
            }
        }

        return suggestions;
    }

    public ByteArrayInputStream generateExpenseExcel() throws IOException {
        // 1. Get all the expense data
        List<ExpenseDTO> expenses = getAllExpensesForCurrentUser();

        // 2. Create an in-memory Excel workbook
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Expenses");

            // 3. Create the header row
            String[] headers = { "ID", "Name", "Category", "Amount", "Date" };
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // 4. Populate the data rows
            int rowIdx = 1;
            for (ExpenseDTO expense : expenses) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(expense.getId());
                row.createCell(1).setCellValue(expense.getName());
                row.createCell(2).setCellValue(expense.getCategoryName());
                row.createCell(3).setCellValue(expense.getAmount().doubleValue());
                row.createCell(4).setCellValue(expense.getDate().toString());
            }

            // 5. Write the workbook to the output stream and return it
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

}
