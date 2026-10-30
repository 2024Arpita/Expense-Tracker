# Expense Tracker

A full-stack personal finance management application built with the MERN stack for tracking income, expenses, budgets, and spending insights.

## Features

* Secure user authentication with JWT
* Add and manage income sources
* Add and manage expense transactions
* User-specific transaction history
* Dashboard with financial summaries and spending insights
* Category-based expense tracking
* Monthly budget creation and management
* Real-time budget alerts using Socket.IO
* Budget warning when spending reaches 80% of the monthly limit
* Budget exceeded notification when spending reaches 100% of the monthly limit
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
* Socket.IO Client
* Recharts

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Socket.IO
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

Follow the steps below to download, configure, and run the Expense Tracker application on your local machine.

### 1. Prerequisites

Before running the project, make sure you have installed the following software:

- **Node.js and npm:** Required to run the frontend and backend. Download them from [Node.js Official Website](https://nodejs.org/).
- **Git:** Required to clone the project repository. Download it from [Git Official Website](https://git-scm.com/).
- **MongoDB:** Required for storing application data. You can either use [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) (cloud database) or install MongoDB locally.

To verify that Node.js and npm are installed, open your terminal or command prompt and run:

```bash
node -v
npm -v
```

If both commands display version numbers, you are ready to proceed.

### 2. Download the Project

Open your terminal (Command Prompt, PowerShell, or VS Code Terminal) and run:

```bash
git clone <repository-url>
```

Replace `<repository-url>` with the actual GitHub repository URL.

Once the project is downloaded, navigate into its folder:

```bash
cd Expense-Tracker
```

### 3. Backend Setup

The backend handles application logic, user authentication, API requests, and communication with the MongoDB database.

**Step 1: Navigate to the backend folder**

From the main project directory, execute:

```bash
cd backend
```

**Step 2: Install the required dependencies**

Run the following command to install all the packages required by the backend:

```bash
npm install
```

This command reads the `package.json` file and automatically downloads the required dependencies into the `node_modules` folder.

**Step 3: Configure environment variables**

Inside the `backend` folder, create a new file named `.env`.

This file stores configuration values and sensitive information required by the backend.

Add the following variables to your `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Replace the placeholder values with your actual configuration:

- **MONGO_URI:** Your MongoDB connection string. If you are using MongoDB Atlas, copy the connection string from your Atlas dashboard and replace the username, password, and database name with your own details.
- **JWT_SECRET:** A private, randomly generated string used to sign and verify authentication tokens. You can generate a secure value using a password generator.
- **FRONTEND_URL:** The URL where your frontend application runs. The default Vite development URL is `http://localhost:5173`.

**Important:** Never share your `.env` file or upload it to GitHub, as it contains sensitive credentials.

**Step 4: Start the backend server**

After configuring the environment variables, run:

```bash
npm run dev
```

The backend development server should now start successfully. Keep this terminal open while using the application.

### 4. Frontend Setup

The frontend provides the user interface through which users interact with the Expense Tracker.

**Step 1: Open a new terminal**

Keep the backend terminal running. Open another terminal window or tab.

Navigate to the main project directory if you are not already there, and then execute:

```bash
cd frontend/expense-tracker
```

**Step 2: Install frontend dependencies**

Run:

```bash
npm install
```

This installs all the packages required to run the frontend application.

**Step 3: Start the frontend development server**

Execute:

```bash
npm run dev
```

Once the server starts, Vite will display a local development URL in the terminal, usually:

```text
http://localhost:5173
```

Open this URL in your web browser to access the Expense Tracker application.

### 5. Running the Application

To use the application, make sure both servers are running simultaneously:

| Component | Command | Purpose |
|---|---|---|
| Backend | `npm run dev` | Handles APIs, authentication, and database operations |
| Frontend | `npm run dev` | Runs the user interface |

**Remember:** You need two separate terminal windows: one for the backend and another for the frontend.

### 6. Troubleshooting

If you encounter any issues while setting up the project, try the following:

- **`npm is not recognized`:** Make sure Node.js is installed correctly and restart your terminal.
- **MongoDB connection error:** Verify that your MongoDB connection string is correct, your database is accessible, and your Atlas IP access settings allow your connection.
- **Port already in use:** Another application may already be using the required port. Stop that application or configure a different port.
- **Missing dependencies:** Navigate to the relevant backend or frontend directory and run `npm install` again.
- **Environment variable errors:** Make sure the `.env` file is inside the `backend` folder and that all required variables are correctly configured.

Once both servers are running, you can register an account, log in, and start managing your personal expenses!

## Author

**Arpita Maurya**
