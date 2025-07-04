const xlsx=require('xlsx')
const Expense=require("../models/Expense");
// add expense source
exports.addexpense=async(req,res)=>{
    const userId=req.user.id;

    try {
        const{icon,source,amount,date}=req.body;

        //Validation of all fields present
        if(!source ||!amount||!date) {
            return res.status(400).json({message:"All fields are required"})
        }

        const newexpense=new Expense({
            userId,
            icon,
            source,
            amount,
            date:new Date(date)
        })

        await newexpense.save();
        res.status(200).json(newexpense)
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}

//get all expense source

exports.getAllexpense=async(req,res)=>{
    const userId=req.user.id;

    try {
        const expense= await Expense.find({userId}).sort({date:-1});
        res.status(200).json(expense);

    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}

//delete expense source
exports.deleteexpense=async(req,res)=>{
    try {
        console.log('deleeting strated');
        const expenseExist=await Expense.findOneAndDelete(req.params.id);
       if(!expenseExist){
        return res.json({message:"no data found"})
       }
        res.json({message:"expense deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
}

//download excel
exports.downloadexpenseExcel=async(req,res)=>{
    const userId=req.user.id;
    try {
        const expense=await Expense.find({userId}).sort({date:-1});

        //prepare Excel data
        const data=expense.map((item)=>({
            Source:item.source,
            Amount:item.amount,
            Date:item.date,
        }))

        const wb=xlsx.utils.book_new()
        const ws=xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws,"expense")
        xlsx.writeFile(wb,'expense_details.xlsx')
        res.download("expense_details.xlsx")
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}