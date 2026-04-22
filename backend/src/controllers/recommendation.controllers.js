import { generateMealPlan, updateFoodRating, getSeasonalFoods, getCurrentSeason,
  getLocationBasedFoods,
  getDynamicRecommendations


 } from "../utils/recommendation.utils.js";
import { Meal } from "../models/meal.model.js";
import { User } from "../models/user.model.js";
/**
 * Generate diet plan for the user based on their preferences and goals.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getDietPlan = async (req, res) => {
  try {
    const {userId} = req.body; // Authenticated user
    const { startDate, endDate } = req.body;

    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start and end dates are required." });
    }

    // Generate the meal plan
    
    const mealPlan = await generateMealPlan(userId, startDate, endDate);
   
    
    

    //return savedMealPlan;
    

    
    res.status(200).json(mealPlan);
  } catch (error) {
    console.error("Error in getDietPlan:", error);
    res.status(500).json({ error: "Failed to generate diet plan." });
  }
};

export const submitFoodFeedback = async (req, res) => {
  try {
    const { foodId, rating } = req.body;
    if (!foodId || !rating) {
      return res.status(400).json({ error: "Food ID and rating are required." });
    }

    await updateFoodRating(foodId, rating); // Call utility function
    res.status(200).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    res.status(500).json({ error: "Failed to submit feedback." });
  }
};


export const getAdvancedRecommendations = async (req, res) => {
  try {
      const { userId, type } = req.body;

      if (!userId || !type) {
          return res.status(400).json({ error: "User ID and recommendation type are required" });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      let recommendations = [];

      if (type === "Seasonal") {
          recommendations = await getSeasonalFoods(user);
      }
      /* else if (type === "Location-based") {
          recommendations = await getLocationBasedFoods(user.location);
      }
          */

      //console.log("Recommendations found:", recommendations); // Debugging line

      if (recommendations.length === 0) {
          return res.status(200).json({ message: "No matching recommendations found", recommendations: [] });
      }

      res.status(200).json({ success: true, season: getCurrentSeason(), recommendations });
  } catch (error) {
      console.log("Error in getAdvancedRecommendations:", error);
      res.status(500).json({ error: "Failed to fetch advanced recommendations" });
  }
};



