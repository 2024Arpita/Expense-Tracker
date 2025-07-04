const User=require("../models/User")
const jwt =require("jsonwebtoken")

//generate JWT token

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"30d"});
}

//Register User
exports.registerUser=async (req,res) => {
    const {fullName,email,password,profileImageUrl}=req.body;

    //Validation: Check for missing fields
    if(!fullName ||!email ||!password){
        return res.status(400).json({message:"All fields are mandatory"})
    }

    try {
        //check if email already exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User Already Exists"})
        }

        //create user
        const user=await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        })

        res.status(200).json({
            id:user._id,
            user,
            token: generateToken(user._id),
        })
    } catch (err) {
        res.status(500).json({message:" Error registering user",error:err.message})
    }
}


//Login User
exports.loginUser=async (req,res) => {
    console.log("📩 Login attempt:");
    const {email,password}=req.body;
    if(!email ||!password){
        return res.status(400).json({message:"All fields are required"})
    }

    try {
        const user=await User.findOne({email});
        console.log("User found:", user);
        console.log("Entered password:", password);
        console.log("Stored hash:", user?.password);
        console.log("Compare result:", await user.comparePassword(password));
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        

        res.status(200).json({
        id:user._id,
        user,
        token:generateToken(user._id),
    })
    console.log("Password from body:", password);
console.log("Hashed password from DB:", user.password);
console.log("Comparison result:", await user.comparePassword(password));

    } catch (err) {
       res
       .status(500)
       .json({message:"Error registering user",error:err.message}); 
    }
}

// User
exports.getUserInfo=async (req,res) => {
    try {
        const user=await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(400).json({message :"User not found"});
        }

        res.status(200).json({user});
    } catch (err) {
        res
        .status(500)
        .json({message :"Error registering user",error:err.message})
    }
}
