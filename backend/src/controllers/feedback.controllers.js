import { Food } from "../models/foodItem.model.js";
import { Meal } from "../models/meal.model.js";

export const submitFeedback = async (req, res) => {
  try {
    const { mealId, date, mealType, rating, comments } = req.body;

    // Validate input
    if (!mealId || !date || !mealType || !rating) {
      return res.status(400).json({ error: "Meal ID, date, meal type, and rating are required." });
    }

    // Find the meal plan containing the specific date
    const mealPlan = await Meal.findOne({ 
      _id: mealId, 
      "dailyPlans.date": new Date(date) 
    });

    if (!mealPlan) {
      return res.status(404).json({ error: "Meal plan not found for the specified date." });
    }

    // Locate the specific meal by type
    const dailyPlan = mealPlan.dailyPlans.find(
      (plan) => plan.date.toISOString() === new Date(date).toISOString()
    );

    if (!dailyPlan) {
      return res.status(404).json({ error: "Daily plan not found for the specified date." });
    }

    const meal = dailyPlan.meals.find((m) => m.mealType === mealType);
    if (!meal) {
      return res.status(404).json({ error: "Meal not found for the specified type." });
    }

    // Update feedback
    meal.feedback = { rating, comments };
    await mealPlan.save();

    res.status(200).json({ message: "Feedback submitted successfully", meal });
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    res.status(500).json({ error: "Failed to submit feedback." });
  }
};

export const submitRating = async (req, res) => {
  try {
      const { foodId, rating, userId } = req.body;

      if (!foodId || !userId || !rating) {
        return res.status(400).json({
          success: false,
          message: "Food, user, and rating are required",
        });
      }

      const numericRating = Number(rating);
      if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be a number between 1 and 5",
        });
      }

      const food = await Food.findById(foodId);
      if (!food) {
        return res.status(404).json({ success: false, message: "Food not found" });
      }

      const existingRating = food.ratings.find(
        (entry) => entry.userId.toString() === userId
      );

      if (existingRating) {
        existingRating.rating = numericRating;
      } else {
        food.ratings.push({ userId, rating: numericRating });
      }

      const ratingTotal = food.ratings.reduce((sum, entry) => sum + entry.rating, 0);
      food.ratingCount = food.ratings.length;
      food.averageRating = food.ratingCount ? ratingTotal / food.ratingCount : 0;

      await food.save();

      res.status(200).json({
        success: true,
        message: "Rating submitted successfully",
        data: {
          averageRating: food.averageRating,
          ratingCount: food.ratingCount,
        },
      });
  } catch (error) {
      console.error("Error submitting rating:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

