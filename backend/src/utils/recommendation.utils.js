import { User } from "../models/user.model.js";
import { Food } from "../models/foodItem.model.js";
import { Meal } from "../models/meal.model.js";

/**
 * Generate a diet plan for a user between specified dates.
 * @param {String} userId - User ID.
 * @param {String} startDate - Start date of the plan.
 * @param {String} endDate - End date of the plan.
 * @returns {Object} Diet plan with daily meals.
 * 
 */

/*
export const generateMealPlan = async (userId, startDate, endDate) => {
  // Parse dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  //const day = new Date(date)
  const plan = [];
  const dailyPlans =[]

  // Fetch user details
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Calculate TDEE
  const tdee = calculateTDEE(user);
  
  

  // Loop through each day
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const dailyPlan = await generateDailyMealPlan(user, tdee);
    dailyPlans.push({ date: new Date(date), ...dailyPlan });
  }
  await Meal.create({dailyPlans})
  
  return dailyPlans;
};


*/
/*
export const generateMealPlan = async (userId, startDate, endDate) => {
  // Parse dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Fetch user details
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Calculate TDEE
  const tdee = calculateTDEE(user);

  // Initialize meal plan structure
  const mealPlan = {
    userId,
    startDate: start,
    endDate: end,
    dailyPlans: [],
  };

  // Generate daily plans
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const dailyMeals = await generateDailyMealPlan(user, tdee); // Generate meals for the day
    mealPlan.dailyPlans.push({
      date: new Date(date),
      meals: dailyMeals,
    });
  }

  // Save the meal plan to the database
  const savedMealPlan = await Meal.create(mealPlan);

  return savedMealPlan; // Return the saved plan
};
*/

export const generateMealPlan = async (userId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const tdee = calculateTDEE(user);
  const generatedDailyPlans = [];

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dailyPlan = await generateDailyMealPlan(user, tdee);
    generatedDailyPlans.push({
      date: new Date(date),
      status: "In Progress",
      completedAt: null,
      meals: dailyPlan.meals,
      totalNutrients: dailyPlan.totalNutrients,
    });
  }

  const existingPlan = await Meal.findOne({ userId }).sort({ updatedAt: -1 });

  if (!existingPlan) {
    return await Meal.create({
      userId,
      startDate: start,
      endDate: end,
      dailyPlans: generatedDailyPlans,
      status: "Active",
    });
  }

  const dailyPlansByDate = new Map(
    existingPlan.dailyPlans.map((dailyPlan) => [
      new Date(dailyPlan.date).toDateString(),
      dailyPlan,
    ])
  );

  generatedDailyPlans.forEach((dailyPlan) => {
    const key = new Date(dailyPlan.date).toDateString();
    const existingDay = dailyPlansByDate.get(key);

    if (!existingDay || existingDay.status !== "Completed") {
      dailyPlansByDate.set(key, dailyPlan);
    }
  });

  existingPlan.dailyPlans = Array.from(dailyPlansByDate.values()).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  existingPlan.startDate = new Date(
    Math.min(new Date(existingPlan.startDate), start)
  );
  existingPlan.endDate = new Date(
    Math.max(new Date(existingPlan.endDate), end)
  );
  existingPlan.status = existingPlan.dailyPlans.every((day) => day.status === "Completed")
    ? "Completed"
    : "Active";

  await existingPlan.save();
  return existingPlan;
};



/**
 * Generate a single day's meal plan for the user.
 * @param {Object} user - User object.
 * @param {Number} tdee - Total daily energy expenditure.
 * @returns {Object} Daily meal plan.
 */
const generateDailyMealPlan = async (user, tdee) => {
  const calorieSplit = {
    Breakfast: 0.25,
    Lunch: 0.35,
    Snack: 0.15,
    Dinner: 0.25,
  };

  const meals = ["Breakfast", "Lunch", "Snack", "Dinner"];
  const dailyMeals = [];
  let totalNutrients = { calories: 0, protein: 0, carbs: 0, fats: 0 };

  for (const mealType of meals) {
    const mealCalories = Math.round(tdee * calorieSplit[mealType]);

    const foods = await recommendFoods(user, mealCalories, mealType);

    // Aggregate macros
    const macros = foods.reduce(
      (acc, food) => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fats += food.fats || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    totalNutrients = {
      calories: totalNutrients.calories + macros.calories,
      protein: totalNutrients.protein + macros.protein,
      carbs: totalNutrients.carbs + macros.carbs,
      fats: totalNutrients.fats + macros.fats,
    };

    dailyMeals.push({ mealType, foods, totalNutrients: macros });
  }

  return { meals: dailyMeals, totalNutrients };
};

/**
 * Recommend foods for a meal.
 * @param {Object} user - User details.
 * @param {Number} calorieLimit - Calorie limit for the meal.
 * @param {String} mealType - Meal type.
 * @returns {Array} List of recommended foods.
 */
const recommendFoods = async (user, calorieLimit, mealType) => {
  const preferences = {
    ...(user.preference === "Vegan" && { isVegan: true }),
    ...(user.preference === "Vegetarian" && { isVegetarian: true }),
    ...(user.preference === "GlutenFree" && { isGlutenFree: true }), // Add more filters if needed
  };

  const categoryFilter = getCategoryFilter(mealType);

  /*
  return await Food.find({
    calories: { $lte: calorieLimit },
    ...preferences,
    category: { $in: categoryFilter },
  }).limit(5);
   // Select up to 5 items per meal
   */

   return await Food.aggregate([
    { $match: { calories: { $lte: calorieLimit }, ...preferences, category: { $in: categoryFilter } } },
    { $sample: { size: 5 } }, // Random selection to ensure variety
    
    
  ]);
  
};

/**
 * Calculate TDEE for a user.
 */
const calculateTDEE = (user) => {
  // BMR Calculation
  let bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age;
  if (user.gender === "Male") bmr += 5;
  else if (user.gender === "Female") bmr -= 161;

  const activityMultiplier = {
    Low: 1.2,
    Moderate: 1.55,
    High: 1.75,
  }[user.activityLevels];

  const tdee = Math.round(bmr * activityMultiplier);

  if (user.goals === "Weight loss") return tdee * 0.85;
  if (user.goals === "Weight gain") return tdee * 1.15;
  return tdee;
};

/**
 * Get category filter based on meal type.
 */
const getCategoryFilter = (mealType) => {
  const filters = {
    Breakfast: ["Breads, cereals, fastfood,grains", "Fruits A-F", "Drinks,Alcohol, Beverages"],
    Lunch: ["Meat, Poultry", "Vegetables F-P", "Fish, Seafood"],
    Snack: ["Desserts, sweets", "Seeds and Nuts"],
    Dinner: ["Vegetables R-Z", "Fats, Oils, Shortenings"],
  };

  return filters[mealType] || [];
};


export const updateFoodRating = async (foodId, newRating) => {
  const food = await Food.findById(foodId);
  if (!food) throw new Error("Food not found");

  const updatedRating =
    ((food.averageRating * food.ratingCount) + newRating) /
    (food.ratingCount + 1);

  food.averageRating = updatedRating;
  food.ratingCount += 1;
  await food.save();
};


const buildPreferenceFilters = (user) => ({
  ...(user?.preference === "Vegan" && { isVegan: true }),
  ...(user?.preference === "Vegetarian" && { isVegetarian: true }),
  ...(user?.preference === "GlutenFree" && { isGlutenFree: true }),
});

export const getSeasonalFoods = async (user) => {
  const season = getCurrentSeason();
  const seasonalCategories = {
    Winter: ["Soups", "Vegetables A-E", "Drinks,Alcohol, Beverages"],
    Summer: ["Vegetables F-P", "Fruits A-F", "Drinks,Alcohol, Beverages"],
    Spring: ["Vegetables R-Z", "Fruits G-P"],
    Autumn: ["Vegetables A-E", "Seeds and Nuts", "Fruits R-Z"],
  };

  return await Food.aggregate([
    {
      $match: {
        category: { $in: seasonalCategories[season] || [] },
        ...buildPreferenceFilters(user),
      },
    },
    { $sample: { size: 16 } },
  ]);
};

export const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if ([11, 0, 1].includes(month)) return "Winter";
  if ([2, 3, 4].includes(month)) return "Spring";
  if ([5, 6, 7].includes(month)) return "Summer";
  
  return "Autumn";
};


export const getLocationBasedFoods = async (userLocation) => {
  const regionSpecificCategories = {
    India: ["Indian Breads", "Curries", "Spices"],
    USA: ["Burgers", "Fries", "BBQ"],
    Italy: ["Pasta", "Pizza", "Cheeses"],
    // Add more regions as needed
  };

  return await Food.find({ category: { $in: regionSpecificCategories[userLocation] } });
};

export const getDynamicRecommendations = async (user) => {
  const recentlyConsumedFoods = user.consumedMeals.flatMap(meal => 
    meal.meals.flatMap(m => m.foods.map(f => f._id))
  );

  return await Food.find({ _id: { $nin: recentlyConsumedFoods } }).limit(10);
};

const recommendedFoods = async (user, calorieLimit, mealType, options = {}) => {
  const { seasonal, locationBased, dynamic } = options;

  if (seasonal) {
    return await getSeasonalFoods();
  }
  if (locationBased) {
    return await getLocationBasedFoods(user.location);
  }
  if (dynamic) {
    return await getDynamicRecommendations(user);
  }

  // Default recommendation logic
  return await Food.find({
    calories: { $lte: calorieLimit },
    ...preferences,
    category: { $in: getCategoryFilter(mealType) },
  }).limit(5);
};
