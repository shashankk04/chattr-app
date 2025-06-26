import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync,unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge});
};

export const signup = async(request,response,next)=>{
    try{
        const {email,password} = request.body;
        if(!email || !password){
            return response.status(400).json({message:"Email and password are required"});
        }
        const user = await User.create({email,password});
        response.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        return response.status(201).json({user:{
            id:user.id,
            email:user.email,
            // firstName:user.firstName,
            // lastName:user.lastName,
            // image:user.image,
            profileSetup:user.profileSetup

        }});
    }
    catch(error){
        console.log(error);
        return response.status(500).json({message:"Internal server error"});
    }
};

export const login = async(request,response,next)=>{
    try{
        const {email,password} = request.body;
        if(!email || !password){
            return response.status(400).json({message:"Email and password are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return response.status(400).json({message:"User not found"});
        }
        const auth = await compare(password,user.password);//compare user enetered password and database stores password
        if(!auth){
            return response.status(400).json({message:"Password is incorrect"});
        }
        response.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        return response.status(200).json({user:{
            id:user.id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            image:user.image,
            profileSetup:user.profileSetup,
            color:user.color
        }});
    }
    catch(error){
        console.log(error);
        return response.status(500).json({message:"Internal server error"});
    }
};

export const getUserInfo = async(request,response,next)=>{
    try{
        const userData = await User.findById(request.userId);
        if(!userData){
            return response.status(400).json({message:"User not found"});
        }

        
        return response.status(200).json({
            
            id:userData.id,
            email:userData.email,
            firstName:userData.firstName,
            lastName:userData.lastName,
            image:userData.image,
            profileSetup:userData.profileSetup,
            color:userData.color
        
    });
    }
    catch(error){
        console.log(error);
        return response.status(500).json({message:"Internal server error"});
    }
};


export const updateProfile = async (request, response, next) => {
  try {
    const {userId} = request;
    const {firstName,lastName,color} = request.body;
    if(!firstName || !lastName ){
        return response.status(400).json({message:"First name, last name and color are required"});
    }
    const userData = await User.findByIdAndUpdate(userId,{firstName,lastName,color,profileSetup:true},{new:true, runValidators:true});


    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      profileSetup: userData.profileSetup,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export const addProfileImage = async (request, response, next) => {
  try {
    if (!request.file || !request.file.path) {
      return response.status(400).json({ message: "Image is required" });
    }

    // Cloudinary already returns a hosted URL in request.file.path
    const imageUrl = request.file.path;

    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { image: imageUrl },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal server error" });
  }
};



export const removeProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);
    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    // Optional: you could call cloudinary.uploader.destroy(public_id) here if needed

    user.image = null;
    await user.save();

    return response.status(200).json({ message: "Image removed" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"});
    return response.status(200).json({message:"Logged out"});

  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

