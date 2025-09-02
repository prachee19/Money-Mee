package com.me.moneymanager.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort; // ✅ Correct import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.me.moneymanager.entity.ExpenseEntity;
import com.me.moneymanager.entity.ProfileEntity;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {

        List<ExpenseEntity> findByProfileIdOrderByDateDesc(Long profileId);

        List<ExpenseEntity> findTop5ByProfileIdOrderByDateDesc(Long profileId);

        @Query("SELECT SUM(e.amount) FROM ExpenseEntity e WHERE e.profile.id = :profileId")
        BigDecimal findTotalExpenseByProfileId(@Param("profileId") Long profileId);

        List<ExpenseEntity> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
                        Long profileId,
                        LocalDate startDate,
                        LocalDate endDate,
                        String keyword,
                        Sort sort);

        List<ExpenseEntity> findByProfileIdAndDateBetween(Long profileId, LocalDate startDate, LocalDate endDate);

        // made changes
        List<ExpenseEntity> findByProfileIdAndDate(Long profileId, LocalDate date);

        List<ExpenseEntity> findByProfileId(Long profileId);

}
