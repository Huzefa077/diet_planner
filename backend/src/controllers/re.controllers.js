import mongoose from "mongoose"
import {Food} from "../models/foodItem.model.js"
import {User} from "../models/user.model.js"
import { cosineSimilarity } from "../utils/similarity.js"

const getUserPreferences = async(userId) =>{
    const user = await User.findById(userId);
    return {
        goals : user.goals,
        preference: user.preference,
        pastRating : user.ratedMeals,
    };
};


const fetchFoods = async(preferences)=>{
    return await Food.find({
        isVegetarian: preferences.preference==="Vegetarian",
        isVegan: preferences.preference === "Vegan",
        isGlutenFree: preferences.isGlutenFree,
    });
};


const createFeatureVector = (food) =>{
    return [
        food.calories,
        food.isVegetarian? 1 : 0,
        food.isVegan ? 1 : 0,
        food.isGlutenFree ? 1 : 0,
    ];
};

//Recommend Meals using content-based filtering

const recommendMeals = async (userId) =>{
    const userPreference = await getUserPreferences(userId);
    const meals = await fetchFoods(userPreference)

    const mealVectors = meals.map(createFeatureVector);
    const mealIds = meals.map((food)=> food._id);
    let recommendedMeals = meals;
/*
    if(userPreference.pastRating.length > 0){
        const userRatedMealIds = userPreference.pastRating.map((r)=>r.mealIds)
        const ratedMeals = meals.filter((food)=> userRatedMealIds.includes(food._id))
        if(ratedMeals.length > 0){
            const ratedMealVectors = ratedMeals.map(createFeatureVector);
            const similarityScores = cosineSimilarity(ratedMealVectors,mealVectors);
            recommendMeals = meals
                .map((food, index)=>({
                    food,
                    score: similarityScores[index],
                }))
                .sort((a,b)=> b.score - a.score)
                .map((item)=> item.meal);
        }
    }
        */
    return {
        breakfast: recommendedMeals[0] || null,
        lunch: recommendedMeals[1] || null,
        snack: recommendedMeals[2] || null,
        dinner: recommendedMeals[3] || null,
    }
}

export {recommendMeals}