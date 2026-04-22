import { ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";

import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";


const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({validateBeForSafe:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token");
        
    }
}



const registerUser = asyncHandler(async(req,res)=>{
    const {fullname,email,username,password} = req.body;
    if(!(fullname || email || username || password)){
        console.log("All fields are required")
        throw new ApiError(400,"All fields are required")
        
    }
    const userExists = await User.findOne({
        $or:[{email},{username}]
    })
    if(userExists){
        throw new ApiError(409,"User with email or username already exists");
    }
    const user = await User.create({
        fullname,
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user");
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    const {email,username,password} = req.body
    if(!(password|| email)){
        throw new ApiError(400,"Username or email is required")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"User does not exists");
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    } 
    res.status(200)
           .cookie("accessToken", accessToken, options)
           .cookie("refreshToken", refreshToken, options)
           .json({
               message: "User logged in successfully",
               user: loggedInUser,
               token:accessToken
           });
    
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {new:true}
    )
    const options= {
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out"))
})

const generateUserPreference = asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const {age,weight,height,activityLevels,preference,gender,goals,workType,medicalConditions}=req.body;
    if(!(age|| weight|| height || preference || activityLevels || gender || goals || medicalConditions || workType )){
        throw new ApiError(400,"All fields are required")
    }
    const userDetails = await User.findByIdAndUpdate(
        userId,
        {
            age,
            weight,
            height,
            goals,
            activityLevels,
            preference,
            medicalConditions,
            gender,
            workType,
        },
        { new: true, upsert: true } // `upsert: true` creates a document if it doesn't exist
    );
    
    if(!userDetails){
        throw new ApiError(500,"Something went wrong")
    }
    return res.status(201).json(
        new ApiResponse(200,userDetails,"Details generated successfully")
    )
    
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})





export{
    registerUser,
    loginUser,
    logoutUser,
    generateUserPreference,
    getCurrentUser
}
