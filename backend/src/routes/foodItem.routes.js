import { Router } from "express";
import {
    insertFoodItemToDatabase,
    getAllFoodItems,
    getFoodItemById
} from "../controllers/foodItem.controllers.js"

const router = Router();

router.route("/insert-food-item").post(insertFoodItemToDatabase);
router.route("/get-food-items").get(getAllFoodItems);
router.route("/:id").get(getFoodItemById)

export default router;