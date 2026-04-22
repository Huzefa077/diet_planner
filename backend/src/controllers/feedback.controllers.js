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
      const { foodId, mealId, rating, userId } = req.body;

      // Store rating in database
      await Food.findByIdAndUpdate(foodId, {
          $push: { ratings: { userId, rating } }
      });
      
      res.status(200).json({ success: true, message: "Rating submitted successfully" });
      console.log("Rating submitted successfully")
      
  } catch (error) {
      console.error("Error submitting rating:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

