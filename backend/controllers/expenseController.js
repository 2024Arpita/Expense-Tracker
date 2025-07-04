const xlsx=require('xlsx')
const Expense=require("../models/Expense")
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