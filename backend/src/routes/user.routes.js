import {Router} from "express"
import {
    registerUser,
    loginUser,
    logoutUser,
    generateUserPreference,
    getCurrentUser
} from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/details").post(verifyJWT,generateUserPreference)
router.route("/current-user").get(verifyJWT,getCurrentUser)

export default router;
