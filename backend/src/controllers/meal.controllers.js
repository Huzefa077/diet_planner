import { Meal } from "../models/meal.model.js";
import { Food } from "../models/foodItem.model.js";

const emptyTotals = { calories: 0, protein: 0, carbs: 0, fats: 0 };

const sumFoodTotals = (foods = []) =>
  foods.reduce(
    (totals, food) => ({
      calories: totals.calories + (food.calories || 0),
      protein: totals.protein + (food.protein || 0),
      carbs: totals.carbs + (food.carbs || 0),
      fats: totals.fats + (food.fats || 0),
    }),
    { ...emptyTotals }
  );

const sumMealTotals = (meals = []) =>
  meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + (meal.totalNutrients?.calories || 0),
      protein: totals.protein + (meal.totalNutrients?.protein || 0),
      carbs: totals.carbs + (meal.totalNutrients?.carbs || 0),
      fats: totals.fats + (meal.totalNutrients?.fats || 0),
    }),
    { ...emptyTotals }
  );

export const getConsumedMeals = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const consumedMeals = await Meal.aggregate([
        { $match: { userId } },
        { $unwind: "$dailyPlans" },
        { $unwind: "$dailyPlans.meals" },
        { $unwind: "$dailyPlans.meals.foods" },
        { $match: { "dailyPlans.meals.foods.isConsumed": true } },
        {
          $group: {
            _id: "$dailyPlans.date",
            totalCalories: { $sum: "$dailyPlans.meals.foods.calories" },
            totalProtein: { $sum: "$dailyPlans.meals.foods.protein" },
            totalCarbs: { $sum: "$dailyPlans.meals.foods.carbs" },
            totalFats: { $sum: "$dailyPlans.meals.foods.fats" },
            foodsConsumed: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      
  
      res.status(200).json({ success: true, data: consumedMeals });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  export const saveLatestDietPlan = async (req, res) => {
    try {
      const userId = req.user._id;
      const { dailyPlans, startDate, endDate, status } = req.body;
  
      const plan = await Meal.findOneAndUpdate(
        { userId },
        {
          userId,
          dailyPlans,
          startDate,
          endDate,
          status: status || "Active",
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );
  
      res.status(200).json({ success: true, data: plan, message: "Diet plan saved!" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const markFoodAsConsumed = async (req, res) => {
    try {
      const { mealId, foodId } = req.body;
      const isConsumed = req.body.isConsumed ?? req.body.consumed;
      const userId = req.user._id;

      const updatedPlan = await Meal.findOneAndUpdate(
        { userId, "dailyPlans.meals._id": mealId },
        {
          $set: {
            "dailyPlans.$[].meals.$[meal].foods.$[food].isConsumed": isConsumed,
          },
        },
        {
          arrayFilters: [
            { "meal._id": mealId },
            { "food._id": foodId },
          ],
          new: true,
        }
      );

      if (!updatedPlan) {
        return res.status(404).json({ success: false, message: "Meal or food not found" });
      }

      res.status(200).json({ success: true, data: updatedPlan, message: "Meal status updated!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  };

  export const getLatestDietPlan = async (req, res) => {
    try {
      const userId = req.user._id;
      const dietPlan = await Meal.findOne({ userId }).sort({ updatedAt: -1 });
  
      res.status(200).json({ success: true, data: dietPlan || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const deleteDietPlan = async (req, res) => {
    try {
      const userId = req.user._id;
      await Meal.deleteOne({ userId });
  
      res.status(200).json({ success: true, message: "Diet plan deleted!" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const completeDietDay = async (req, res) => {
    try {
      const userId = req.user._id;
      const { date } = req.body;

      if (!date) {
        return res.status(400).json({ success: false, message: "Date is required" });
      }

      const targetDate = new Date(date).toDateString();
      const plan = await Meal.findOne({ userId }).sort({ updatedAt: -1 });

      if (!plan) {
        return res.status(404).json({ success: false, message: "No diet plan found" });
      }

      const dayPlan = plan.dailyPlans.find(
        (day) => new Date(day.date).toDateString() === targetDate
      );

      if (!dayPlan) {
        return res.status(404).json({ success: false, message: "Diet day not found" });
      }

      dayPlan.status = "Completed";
      dayPlan.completedAt = new Date();
      plan.status = plan.dailyPlans.every((day) => day.status === "Completed")
        ? "Completed"
        : "Active";

      await plan.save();

      res.status(200).json({
        success: true,
        data: plan,
        message: "Diet day marked as completed",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  };

  export const addSeasonalFoodToMeal = async (req, res) => {
    try {
      const userId = req.user._id;
      const { date, mealType, foodId } = req.body;

      if (!date || !mealType || !foodId) {
        return res.status(400).json({
          success: false,
          message: "Date, meal type, and food are required",
        });
      }

      const plan = await Meal.findOne({ userId }).sort({ updatedAt: -1 });

      if (!plan) {
        return res.status(404).json({ success: false, message: "No diet plan found" });
      }

      const targetDate = new Date(date).toDateString();
      const dayPlan = plan.dailyPlans.find(
        (day) => new Date(day.date).toDateString() === targetDate
      );

      if (!dayPlan) {
        return res.status(404).json({
          success: false,
          message: "Open your daily plan first so the app can create today's meals",
        });
      }

      if (dayPlan.status === "Completed") {
        return res.status(400).json({
          success: false,
          message: "This day is already completed and can no longer be changed",
        });
      }

      const meal = dayPlan.meals.find((entry) => entry.mealType === mealType);

      if (!meal) {
        return res.status(404).json({ success: false, message: "Meal slot not found" });
      }

      const alreadyExists = meal.foods.some(
        (food) => food._id?.toString() === foodId
      );

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "This seasonal food is already in that meal",
        });
      }

      const food = await Food.findById(foodId);

      if (!food) {
        return res.status(404).json({ success: false, message: "Food not found" });
      }

      meal.foods.push({
        _id: food._id,
        name: food.name,
        servingSize: food.servingSize,
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fats: food.fats || 0,
        isConsumed: false,
        isVegetarian: food.isVegetarian,
        isVegan: food.isVegan,
        isGlutenFree: food.isGlutenFree,
        category: food.category,
      });

      meal.totalNutrients = sumFoodTotals(meal.foods);
      dayPlan.totalNutrients = sumMealTotals(dayPlan.meals);
      plan.status = plan.dailyPlans.every((day) => day.status === "Completed")
        ? "Completed"
        : "Active";

      await plan.save();

      return res.status(200).json({
        success: true,
        data: plan,
        message: `${food.name} was added to ${mealType}`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  };
