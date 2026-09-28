const Budget=require("../models/Budget")
const Expense=require("../models/Expense")
const {Types}=require("mongoose")

// Add Budget
exports.addBudget=async(req,res)=>{
    const userId=req.user.id

    try {
        const{category,monthlyLimit,month,year}=req.body

        //Validation of all fields present
        if(!category || !monthlyLimit || !month || !year){
            return res.status(400).json({message:"All fields are required"})
        }

        if(isNaN(monthlyLimit) || Number(monthlyLimit)<=0){
            return res.status(400).json({message:"Monthly limit must be a valid number greater than 0"})
        }

        if(month<1 || month>12){
            return res.status(400).json({message:"Month must be between 1 and 12"})
        }

        if(year<2000 || year>2100){
            return res.status(400).json({message:"Please provide a valid year"})
        }

        const newBudget=new Budget({
            userId,
            category,
            monthlyLimit:Number(monthlyLimit),
            month:Number(month),
            year:Number(year),
        })

        await newBudget.save()
        res.status(200).json(newBudget)
    } catch (error) {
        // Handle duplicate budget
        if(error.code===11000){
            return res.status(400).json({message:"A budget for this category already exists for the selected month"})
        }
        res.status(500).json({message:"Server Error"})
    }
}

// Get all budgets for current user (with spending calculated)
exports.getBudgets=async(req,res)=>{
    const userId=req.user.id

    try {
        const budgets=await Budget.find({userId}).sort({year:-1,month:-1})

        // Calculate spending for each budget
        const budgetsWithSpending=await Promise.all(
            budgets.map(async(budget)=>{
                const startOfMonth=new Date(budget.year,budget.month-1,1)
                const endOfMonth=new Date(budget.year,budget.month,0,23,59,59,999)

                const spendingResult=await Expense.aggregate([
                    {
                        $match:{
                            userId:new Types.ObjectId(String(userId)),
                            category:budget.category,
                            date:{$gte:startOfMonth,$lte:endOfMonth},
                        },
                    },
                    {$group:{_id:null,total:{$sum:"$amount"}}},
                ])

                const spent=spendingResult[0]?.total || 0
                return{
                    ...budget.toObject(),
                    spent,
                    percentage:Math.round((spent/budget.monthlyLimit)*100),
                }
            })
        )

        res.status(200).json(budgetsWithSpending)
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}

// Update Budget
exports.updateBudget=async(req,res)=>{
    try {
        const budget=await Budget.findById(req.params.id)

        if(!budget){
            return res.status(404).json({message:"Budget not found"})
        }

        // Ensure user owns this budget
        if(budget.userId.toString()!==req.user.id){
            return res.status(403).json({message:"Not authorized to update this budget"})
        }

        const{category,monthlyLimit,month,year}=req.body

        if(monthlyLimit && (isNaN(monthlyLimit) || Number(monthlyLimit)<=0)){
            return res.status(400).json({message:"Monthly limit must be a valid number greater than 0"})
        }

        // If the limit changes, reset notification flags so alerts can re-trigger
        const updates={}
        if(category) updates.category=category
        if(monthlyLimit){
            updates.monthlyLimit=Number(monthlyLimit)
            updates.notifiedWarning=false
            updates.notifiedExceeded=false
        }
        if(month) updates.month=Number(month)
        if(year) updates.year=Number(year)

        const updatedBudget=await Budget.findByIdAndUpdate(
            req.params.id,
            updates,
            {new:true}
        )

        res.status(200).json(updatedBudget)
    } catch (error) {
        if(error.code===11000){
            return res.status(400).json({message:"A budget for this category already exists for the selected month"})
        }
        res.status(500).json({message:"Server Error"})
    }
}

// Delete Budget
exports.deleteBudget=async(req,res)=>{
    try {
        const budget=await Budget.findById(req.params.id)

        if(!budget){
            return res.status(404).json({message:"Budget not found"})
        }

        // Ensure user owns this budget
        if(budget.userId.toString()!==req.user.id){
            return res.status(403).json({message:"Not authorized to delete this budget"})
        }

        await Budget.findByIdAndDelete(req.params.id)
        res.json({message:"Budget deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}
