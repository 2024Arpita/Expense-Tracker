# Expense Tracker

A full-stack personal finance management application built with the MERN stack for tracking income, expenses, and spending insights.

## Features

* Secure user authentication with JWT
* Add and manage income sources
* Add and manage expense transactions
* User-specific transaction history
* Dashboard with financial summaries and spending insights
* Category-based expense tracking
* Protected REST APIs
* Export income and expense records to Excel
* Responsive React interface

## Tech Stack

**Frontend**

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* Recharts

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Multer
* XLSX

## Project Structure

```text
Expense-Tracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── server.js
│
└── frontend/
    └── expense-tracker/
        └── src/
            ├── components/
            ├── pages/
            ├── context/
            └── App.jsx
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend/expense-tracker
npm install
npm run dev
```

Create a `.env` file in the backend and configure the MongoDB connection, JWT secret, and frontend URL.

## Author

**Arpita Maurya**
