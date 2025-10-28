package com.me.moneymanager.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort; // ✅ Correct import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.me.moneymanager.entity.ExpenseEntity;
import com.me.moneymanager.entity.IncomeEntity;

public interface IncomeRepository extends JpaRepository<IncomeEntity, Long> {

        // ✅ Fixed camelCase and correct field: 'Date' not 'Data'
        List<IncomeEntity> findByProfileIdOrderByDateDesc(Long profileId);

        List<IncomeEntity> findTop5ByProfileIdOrderByDateDesc(Long profileId);

        @Query("SELECT SUM(i.amount) FROM IncomeEntity i WHERE i.profile.id = :profileId")
        BigDecimal findTotalIncomeByProfileId(@Param("profileId") Long profileId);

        @Query(" SELECT e FROM IncomeEntity e WHERE e.profile.id = :profileId AND e.date BETWEEN :startDate AND :endDate AND e.amount = :amount")
        List<IncomeEntity> findByProfileIdAndDateBetweenAndAmount(
                        @Param("profileId") Long profileId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("amount") BigDecimal amount,
                        Sort sort);

        List<IncomeEntity> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
                        Long profileId,
                        LocalDate startDate,
                        LocalDate endDate,
                        String keyword,
                        Sort sort);

        List<IncomeEntity> findByProfileIdAndDateBetween(Long profileId, LocalDate startDate, LocalDate endDate);

        List<IncomeEntity> findByProfileId(Long profileId);

}
