package com.me.moneymanager.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.me.moneymanager.dto.ExpenseDTO;
import com.me.moneymanager.entity.ProfileEntity;
import com.me.moneymanager.repository.ProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;

    @Scheduled(cron = "0 0 22 * * *", zone = "IST")
    public void sendDailyIncomeExpenseReminder() {
        log.info("Job started: sendDailyIncomeExpenseReminder()");

        List<ProfileEntity> profiles = profileRepository.findAll();
        for (ProfileEntity profile : profiles) {

            String body = "Hi " + profile.getFullName() + ",\n\n" +
                    "This is a friendly reminder to add your income and expenses for today in Money Manager.\n\n" +
                    "Go to Money Manager: " + frontendUrl + "\n\n" +
                    "Best regards,\n" +
                    "Money Manager Team";

            // Assuming you have an email service
            emailService.sendEmail(profile.getEmail(), "Daily Reminder: Add Income & Expenses", body);
        }
    }

    @Scheduled(cron = "0 0 23 * * *", zone = "IST")
    public void sendDailyExpenseSummary() {
        log.info("Job started: sendDailyExpenseSummary()");

        List<ProfileEntity> profiles = profileRepository.findAll();
        for (ProfileEntity profile : profiles) {
            List<ExpenseDTO> todaysExpenses = expenseService.getExpensesForUserOnDate(profile.getId(), LocalDate.now());

            if (!todaysExpenses.isEmpty()) {
                StringBuilder table = new StringBuilder();
                table.append("<table style='border-collapse:collapse;width:100%;border:1px solid #ddd;'>");

                // ✅ Table header row
                table.append("<tr style='background-color:#f2f2f2;'>")
                        .append("<th style='border:1px solid #ddd;padding:8px;'>#</th>")
                        .append("<th style='border:1px solid #ddd;padding:8px;'>Name</th>")
                        .append("<th style='border:1px solid #ddd;padding:8px;'>Amount</th>")
                        .append("<th style='border:1px solid #ddd;padding:8px;'>Category</th>")
                        .append("</tr>");

                int i = 1;
                BigDecimal total = BigDecimal.ZERO;

                for (ExpenseDTO expense : todaysExpenses) {
                    table.append("<tr>");
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>").append(i++).append("</td>");
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>").append(expense.getName())
                            .append("</td>");
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>").append(expense.getAmount())
                            .append("</td>");
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>")
                            .append(expense.getCategoryId() != null ? expense.getCategoryName() : "Uncategorized")
                            .append("</td>");
                    table.append("</tr>");

                    total = total.add(expense.getAmount());
                }

                // ✅ Total row
                table.append("<tr style='font-weight:bold;background-color:#f9f9f9;'>")
                        .append("<td colspan='2' style='border:1px solid #ddd;padding:8px;text-align:right;'>Total</td>")
                        .append("<td style='border:1px solid #ddd;padding:8px;'>").append(total).append("</td>")
                        .append("<td style='border:1px solid #ddd;padding:8px;'></td>")
                        .append("</tr>");

                table.append("</table>");

                String body = "Hi " + profile.getFullName()
                        + ",<br/><br/>Here is a summary of your expenses for today:<br/><br/>"
                        + table
                        + "<br/><br/>Best regards,<br/>Money Manager Team";

                emailService.sendEmail(profile.getEmail(), "Your Daily Expense Summary", body);
            }
        }

        log.info("Job completed: sendDailyExpenseSummary()");
    }
}
