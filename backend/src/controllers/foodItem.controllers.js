import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Food } from "../models/foodItem.model.js";


const insertFoodItemToDatabase = asyncHandler(async(req,res)=>{
    const {name , servingSize , calories , protein , carbs , fats , isVegetarian , isVegan , isGlutenFree , category} = req.body;
    if (!name || !servingSize || !calories || !protein || !carbs || !fats || !category) {
        throw new ApiError(400, "All required fields must be provided.");
    }

    const foodItem = await Food.create({
        name,
        servingSize,
        calories,
        protein,
        carbs,
        fats,
        isVegetarian,
        isVegan,
        isGlutenFree,
        category,
    })
    if(!foodItem){
        throw new ApiError(400,"Something went wrong");
    }
    return res.status(201).json(
        new ApiResponse(200,foodItem,"Food item created successfully")
    )
})

const getAllFoodItems = asyncHandler(async(req,res)=>{
    const foodItems = await Food.find({});
    return res.status(200).json(
        new ApiResponse(200,foodItems,"Food items fetched successfully")
    )
});

const getFoodItemById = asyncHandler(async(req,res)=>{
    const {id} =req.params;
    const foodItem = await Food.findById(id);
    if(!foodItem){
        throw new ApiError(404,"Food item not found")
    }
    return res.status(200).json(
        new ApiResponse(200,foodItem,"Food item retrieved successfully")
    )
});


export {
    insertFoodItemToDatabase,
    getAllFoodItems,
    getFoodItemById
}