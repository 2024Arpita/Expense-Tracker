const express=require("express")
const bcrypt=require("bcryptjs");
const mongoose = require("mongoose");

const UserSchema=new mongoose.Schema(
    {
        fullName:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        profileImageUrl:{type:String,default:null},
    },
    {timestamps:true}
)

//hash password before saving //middleware
UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password =await bcrypt.hash(this.password,10);
    next();
})

//compare passwords
UserSchema.methods.comparePassword=async function (candidatePassword) {
     console.log("🔍 Comparing:", candidatePassword, "with", this.password);
    return await bcrypt.compare(candidatePassword,this.password);
}

module.exports=mongoose.model("User",UserSchema);
