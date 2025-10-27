export const BASE_URL = "http://localhost:8080";
 export const CLOUDINARY_CLOUD_NAME = import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;


export const API_ENDPOINTS = {
    LOGIN : "/login",
    REGISTER : "/register",
    GET_USER_INFO : "/profile", 
    GET_ALL_CATEGORIES: "/categories",
      ADD_CATEGORY: "/categories",
      DELETE_CATEGORY: "/categories", 
       UPDATE_CATEGORY: "/categories", 
       GET_ALL_INCOME : "/incomes/all" ,  
       CATEGORY_BY_TYPE :(type) => `/categories/${type}`,
       ADD_INCOME : "/incomes",
      DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
      INCOME_EXCEL_DOWNLOAD : "/excel/download/income",
      EMAIL_INCOME:"/email/income",


    // ✅ NEW: Expense Endpoints
    GET_ALL_EXPENSE : "/expenses/all",
    ADD_EXPENSE : "/expenses",
    DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,
    EXPENSE_EXCEL_DOWNLOAD : "/excel/download/expense",
    EMAIL_EXPENSE:"/email/expense",
    GET_SPENDING_SUGGESTIONS: "/expenses/suggestions",

    DASHBOARD_DATA:"/dashboard",
    APPLY_FILTERS:"/filter",







    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

}