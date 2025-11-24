import {User} from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateTocken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup=async(req,res)=>{
   const {fullName,email,password}= req.body;
   try {
      //koi feild empty nhi hona chiye
      if(!fullName || !email || !password){
         res.status(400).json({message:"All feilds are required"});
      }
      //password ka length 6 se chota nhi hona chiye
      if(password.length<6){
         return res.status(400).json({message:"Password must be at least 6 characters"});
      }
      //finding user using emailId
      const user=await User.findOne({email});
      //agar email match hua user phle se exist krta hai
      if(user) res.status(400).json({message:"Email already exists"});
      //pass ko hath kro 
      const salt=await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(password,salt);
  //new user bnao
      const newUser= new User({
         fullName:fullName,
         email:email,
         password:hashedPassword
      })


      if(newUser){
         //generate jwt tocken
         generateTocken(newUser._id,res)
         //save krdo user ko
         await newUser.save();
        return res.status(201).json({
         _id:newUser._id,
         fullName:newUser.fullName,
         email:newUser.email,
         profilePic:newUser.profilePic,
      });
      }else{
         return res.status(400).json({message:"Invalid user data"});
      }
      
   } catch (error) {
      console.log("Error in signup controller",error.message);
       return res.status(500).json({message:"Internal Server Error"});
   }
}

export const login=async(req,res)=>{
   //body se email and password aya
   const {email,password}=req.body;
   
   try {
      //check validation
      if(!email || !password){
       return  res.status(400).json({message:"All fields are required"});
      }
      //find user in db with email
       const user=await User.findOne({email});
      if(!user){
        return res.status(400).json({message:"Invalid credentials"})
      }
       //password check
    const isPassCorrect = await bcrypt.compare(password,user.password);
    if(!isPassCorrect){
    return  res.status(400).json({message:"Invalid credentials"});
    }
   //token generate
    generateTocken(user._id,res)
    res.status(200).json({
      _id:user._id,
      fullName:user.fullName,
      email:user.email,
      profilePic:user.profilePic
    })
   } catch (error) {
      console.log("Error",error.message);
     return res.status(500).json({message:"Internal server error"});
   }
}

export const logout=(req,res)=>{
   try {
      //cookie delet krdo empty krdo
      res.cookie("jwt","",{maxAge:0});
    return  res.status(200).json({message:"Logged out successfully"});
   } catch (error) {
      console.log("logout error",error.message);
      return res.status(500).json("Internal server error");
   }
}

export const updateProfile= async(req,res)=>{
 try {
   const {profilePic}=req.body;
   const userId=req.user._id;
   if(!profilePic){
     return res.status(400).json({message:"Profile pic is required"});
   }
   const uploadResponse=await cloudinary.uploader.upload(profilePic);
   const updateUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
 return   res.status(200).json(updateUser);
 } catch (error) {
   console.log("Error in update Profile",error.message);
   return res.status(500).json({message:"Internal server error"});
 }
}

export const checkAuth=(req,res)=>{
try {
   return res.status(200).json(req.user)
} catch (error) {
   console.log("Error in checkAuth controller",error.message);
   return res.status(500).json({message:"Internal server error"});
}
}