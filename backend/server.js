require("dotenv").config();
const express=require("express")
const cors=require("cors")
const path=require("path")
const http=require("http")
const connectDB=require("./config/db")
const authRoutes=require("./routes/authRoutes")
const incomeRoutes=require("./routes/incomeRoutes")
const expenseRoutes=require("./routes/expenseRoutes")
const dashboardRoutes=require("./routes/dashboardRoutes")
const budgetRoutes=require("./routes/budgetRoutes")
const {initializeSocket}=require("./socket")
const app=express();
const server=http.createServer(app);

//Middleware to handle CORS
app.use(
    cors({
        origin:process.env.CLIENT_URL ||"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
    })
)

app.use(express.json());

connectDB();

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/income",incomeRoutes);
app.use("/api/v1/expense",expenseRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);
app.use("/api/v1/budget",budgetRoutes);

//server uploads folder
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

// Initialize Socket.IO
initializeSocket(server);

const PORT=process.env.PORT || 5000;
server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));