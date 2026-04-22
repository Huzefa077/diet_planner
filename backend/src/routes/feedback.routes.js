import {Router} from "express"

import { submitFeedback,submitRating } from "../controllers/feedback.controllers.js"
import { submitFoodFeedback } from "../controllers/recommendation.controllers.js";
const router = Router();

router.post("/submit",submitFeedback)

router.post("/submit-feedback-fooditem",submitFoodFeedback)

router.post("/submit-rating", submitRating);


export default router