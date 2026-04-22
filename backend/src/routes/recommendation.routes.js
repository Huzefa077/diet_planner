import { Router } from "express";
import { getAdvancedRecommendations, getDietPlan } from "../controllers/recommendation.controllers.js";
import { recommendMeals } from "../controllers/re.controllers.js";
const router =Router()

router.post("/recommend", getDietPlan);
router.post("/advanced-recommendations", getAdvancedRecommendations);

router.get("/recommend/:userId", async (req,res) => {
    try {
        const userId = req.params.userId;
        const recommendations = await recommendMeals(userId);
        res.json(recommendations);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong"})
    }
})


export default router