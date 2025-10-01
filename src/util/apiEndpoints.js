export const BASE_URL = "https://moneymee.onrender.com";
 export const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;


export const API_ENDPOINTS = {
    LOGIN : "/api/v1.0/login",
    REGISTER : "/api/v1.0/register",
    GET_USER_INFO : "/api/v1.0/profile", 
    GET_ALL_CATEGORIES: "/api/v1.0/categories",
      ADD_CATEGORY: "/api/v1.0/categories",
      DELETE_CATEGORY: "/api/v1.0/categories", 
       UPDATE_CATEGORY: "/api/v1.0/categories", 
       GET_ALL_INCOME : "/api/v1.0/incomes/all" ,  
       CATEGORY_BY_TYPE :(type) => `/api/v1.0/categories/${type}`,
       ADD_INCOME : "/api/v1.0/incomes",
      DELETE_INCOME: (incomeId) => `/api/v1.0/incomes/${incomeId}`,
      INCOME_EXCEL_DOWNLOAD : "/api/v1.0/excel/download/income",
      EMAIL_INCOME:"/api/v1.0/email/income",


    // ✅ NEW: Expense Endpoints
    GET_ALL_EXPENSE : "/api/v1.0/expenses/all",
    ADD_EXPENSE : "/api/v1.0/expenses",
    DELETE_EXPENSE: (expenseId) => `/api/v1.0/expenses/${expenseId}`,
    EXPENSE_EXCEL_DOWNLOAD : "/api/v1.0/excel/download/expense",
    EMAIL_EXPENSE:"/api/v1.0/email/expense",
    GET_SPENDING_SUGGESTIONS: "/api/v1.0/expenses/suggestions",

    DASHBOARD_DATA:"/api/v1.0/dashboard",
    APPLY_FILTERS:"/api/v1.0/filter",







    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

}