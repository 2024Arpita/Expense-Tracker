export const BASE_URL="http://localhost:8000"
//utils/apiPaths.js

export const API_PATHS={
    AUTH:{
        LOGIN:"/api/v1/auth/login",
        REGISTER:"/api/v1/auth/register",
        GET_USER_INFO:"/api/v1/auth/getUser",
    },

    DASHBOARD:{
        GET_DATA:"/api/v1/dashboard",
    },

    INCOME:{
        ADD_INCOME:"/api/v1/income/add",
        GET_ALL_INCOME:"/api/v1/income/get",
        DELETE_INCOME:(incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME:`/api/v1/income/downloadexcel`,
    },

    EXPENSE:{
        ADD_EXPENSE:"/api/v1/expense/add",
        GET_ALL_EXPENSE:"/api/v1/expense/get",
        DELETE_EXPENSE:(expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE:`/api/v1/expense/downloadexcel`,
    },
    BUDGET:{
        ADD_BUDGET:"/api/v1/budget/add",
        GET_ALL_BUDGETS:"/api/v1/budget/get",
        UPDATE_BUDGET:(budgetId) => `/api/v1/budget/${budgetId}`,
        DELETE_BUDGET:(budgetId) => `/api/v1/budget/${budgetId}`,
    },
    IMAGE:{
        UPLOAD_IMAGE:"/api/v1/auth/upload-image"
    },
}