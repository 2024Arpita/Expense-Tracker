const mongoose=require("mongoose")

const BudgetSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    category:{type:String,required:true},
    monthlyLimit:{type:Number,required:true},
    month:{type:Number,required:true}, // 1-12
    year:{type:Number,required:true},
    notifiedWarning:{type:Boolean,default:false},
    notifiedExceeded:{type:Boolean,default:false},
},{timestamps:true})

// Prevent duplicate budgets for same user + category + month + year
BudgetSchema.index({userId:1,category:1,month:1,year:1},{unique:true})

module.exports=mongoose.model("Budget",BudgetSchema)
