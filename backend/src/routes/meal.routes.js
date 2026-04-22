import express from "express";
import {
  getConsumedMeals,
  saveLatestDietPlan,
  markFoodAsConsumed,
  getLatestDietPlan,
  deleteDietPlan,
  completeDietDay,
  addSeasonalFoodToMeal,
} from "../controllers/meal.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/consumed-meals", verifyJWT, getConsumedMeals);
router.post("/save-latest", verifyJWT, saveLatestDietPlan);
router.post("/mark-consumed", verifyJWT, markFoodAsConsumed);
router.get("/latest-diet", verifyJWT, getLatestDietPlan);
router.post("/complete-day", verifyJWT, completeDietDay);
router.post("/add-seasonal-food", verifyJWT, addSeasonalFoodToMeal);
router.delete("/delete-latest", verifyJWT, deleteDietPlan);

export default router;
