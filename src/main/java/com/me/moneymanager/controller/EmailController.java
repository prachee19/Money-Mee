package com.me.moneymanager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.me.moneymanager.dto.IncomeDTO;
import com.me.moneymanager.entity.ProfileEntity;
import com.me.moneymanager.service.IncomeService;
import com.me.moneymanager.service.ProfileService;
import com.me.moneymanager.dto.ExpenseDTO; 
import com.me.moneymanager.service.ExpenseService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor

public class EmailController {

    private final IncomeService incomeService;
    private final JavaMailSender mailSender;
    private final ProfileService profileService;
    private final ExpenseService expenseService;

    @GetMapping("/income")
    public String emailIncomeTable() {
        try {
            // 1️⃣ Get current user email
            ProfileEntity profile = profileService.getCurrentProfile();
            String userEmail = profile.getEmail();

            // 2️⃣ Get current month incomes
            List<IncomeDTO> incomes = incomeService.getCurrentMonthIncomesForCurrentUser();

            // 3️⃣ Build HTML table
            StringBuilder html = new StringBuilder();
            html.append("<h3>Your Income Details for This Month</h3>");
            html.append("<table border='1' cellpadding='5' cellspacing='0'>");
            html.append("<thead>");
            html.append("<tr>")
                    .append("<th>Name</th>")
                    .append("<th>Category</th>")
                    .append("<th>Amount</th>")
                    .append("<th>Date</th>")
                    .append("</tr>");
            html.append("</thead>");
            html.append("<tbody>");
            for (IncomeDTO income : incomes) {
                html.append("<tr>")
                        .append("<td>").append(income.getName()).append("</td>")
                        .append("<td>").append(income.getCategoryName()).append("</td>")
                        .append("<td>").append(income.getAmount()).append("</td>")
                        .append("<td>").append(income.getDate()).append("</td>")
                        .append("</tr>");
            }
            html.append("</tbody></table>");

            // 4️⃣ Prepare and send email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(userEmail);
            helper.setSubject("Your Income Details");
            helper.setText(html.toString(), true); // true = HTML

            mailSender.send(message);

            return "Income details emailed successfully";

        } catch (MessagingException e) {
            e.printStackTrace();
            return "Failed to send income details email";
        }
    }


     @GetMapping("/expense")
    public String emailExpenseTable() {
        try {
            // 1️⃣ Get current user email
            ProfileEntity profile = profileService.getCurrentProfile();
            String userEmail = profile.getEmail();

            // 2️⃣ Get all expenses for the current user
            List<ExpenseDTO> expenses = expenseService.getAllExpensesForCurrentUser();

            // 3️⃣ Build HTML table for expenses
            StringBuilder html = new StringBuilder();
            html.append("<h3>Your Expense Details</h3>");
            html.append("<table border='1' cellpadding='5' cellspacing='0'>");
            html.append("<thead>");
            html.append("<tr>")
                .append("<th>Name</th>")
                .append("<th>Category</th>")
                .append("<th>Amount</th>")
                .append("<th>Date</th>")
                .append("</tr>");
            html.append("</thead>");
            html.append("<tbody>");
            for (ExpenseDTO expense : expenses) {
                html.append("<tr>")
                    .append("<td>").append(expense.getName()).append("</td>")
                    .append("<td>").append(expense.getCategoryName()).append("</td>")
                    .append("<td>").append(expense.getAmount()).append("</td>")
                    .append("<td>").append(expense.getDate()).append("</td>")
                    .append("</tr>");
            }
            html.append("</tbody></table>");

            // 4️⃣ Prepare and send email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(userEmail);
            helper.setSubject("Your Expense Details");
            helper.setText(html.toString(), true); // true = HTML

            mailSender.send(message);
            return "Expense details emailed successfully";

        } catch (MessagingException e) {
            e.printStackTrace();
            return "Failed to send expense details email";
        }
    }
}
