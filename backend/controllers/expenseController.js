const xlsx=require('xlsx')
const Expense=require("../models/Expense")
const Budget=require("../models/Budget")
const {Types}=require("mongoose")
const {getIO}=require("../socket")
// add Expense source
exports.addExpense=async(req,res)=>{
    const userId=req.user.id;

    try {
        const{icon,category,amount,date}=req.body;

        //Validation of all fields present
        if(!category ||!amount||!date) {
            return res.status(400).json({message:"All fields are required"})
        }

        const newExpense=new Expense({
            userId,
            icon,
            category,
            amount,
            date:new Date(date)
        })

        await newExpense.save();
        res.status(200).json(newExpense)

        // Budget alert check (non-blocking — transaction is already saved and response sent)
        try {
            const expenseDate=new Date(date)
            const expenseMonth=expenseDate.getMonth()+1 // 1-12
            const expenseYear=expenseDate.getFullYear()

            // Find budget for this category and month
            const budget=await Budget.findOne({
                userId,
                category,
                month:expenseMonth,
                year:expenseYear,
            })

            if(!budget) return // No budget set for this category/month

            // Already notified for exceeded — skip entirely
            if(budget.notifiedExceeded) return

            // Calculate total spending for this category in this month
            const startOfMonth=new Date(expenseYear,expenseMonth-1,1)
            const endOfMonth=new Date(expenseYear,expenseMonth,0,23,59,59,999)

            const totalSpendingResult=await Expense.aggregate([
                {
                    $match:{
                        userId:new Types.ObjectId(String(userId)),
                        category:category,
                        date:{$gte:startOfMonth,$lte:endOfMonth},
                    },
                },
                {$group:{_id:null,total:{$sum:"$amount"}}},
            ])

            const currentSpending=totalSpendingResult[0]?.total || 0
            const percentage=Math.round((currentSpending/budget.monthlyLimit)*100)

            const io=getIO()

            // Transition-based notification logic:
            // If jumps from <80% to >=100%, emit only exceeded (not both)
            if(percentage>=100 && !budget.notifiedExceeded){
                io.to(`user:${userId}`).emit("budget:exceeded",{
                    category,
                    budget:budget.monthlyLimit,
                    spent:currentSpending,
                    percentage,
                    message:`${category} budget has been exceeded`,
                })
                await Budget.findByIdAndUpdate(budget._id,{
                    notifiedWarning:true,
                    notifiedExceeded:true,
                })
            } else if(percentage>=80 && !budget.notifiedWarning){
                io.to(`user:${userId}`).emit("budget:warning",{
                    category,
                    budget:budget.monthlyLimit,
                    spent:currentSpending,
                    percentage,
                    message:`${category} budget is ${percentage}% utilized`,
                })
                await Budget.findByIdAndUpdate(budget._id,{
                    notifiedWarning:true,
                })
            }
        } catch (budgetError) {
            console.error("Budget notification error:",budgetError)
        }
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}

//get all Expense source

exports.getAllExpense=async(req,res)=>{
    const userId=req.user.id;

    try {
        const expense= await Expense.find({userId}).sort({date:-1});
        res.status(200).json(expense);

    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}

//delete expense source
exports.deleteExpense=async(req,res)=>{
    try {
        const isExist=await Expense.findOneAndDelete(req.params.id);
        if(!isExist){
            return res.json({message:"No entry exist"})
        }
        res.json({message:"Expense deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
}

//download excel
exports.downloadExpenseExcel=async(req,res)=>{
    const userId=req.user.id;
    try {
        const expense=await Expense.find({userId}).sort({date:-1});

        //prepare Excel data
        const data=expense.map((item)=>({
            category:item.category,
            Amount:item.amount,
            Date:item.date,
        }))

        const wb=xlsx.utils.book_new()
        const ws=xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws,"Expense")
        xlsx.writeFile(wb,'expense_details.xlsx')
        res.download("expense_details.xlsx")
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}