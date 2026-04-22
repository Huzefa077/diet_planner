import "dotenv/config";
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app= express()

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin:allowedOrigins,
    credentials:true
}))

app.use(express.json({limit:"32kb"}))
app.use(express.urlencoded({extended:true,limit:"32kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Diet Planner backend is running" });
});


import userRoute from './routes/user.routes.js'
app.use("/api/v1/users",userRoute);

import foodItemRoute from './routes/foodItem.routes.js'
app.use("/api/v1/foodItem",foodItemRoute);

import recommendationRoute from './routes/recommendation.routes.js'
app.use("/api/v1/recommendation",recommendationRoute);

import mealRoute from './routes/meal.routes.js'
app.use("/api/v1/meal",mealRoute);

import feedbackRoute from './routes/feedback.routes.js'
app.use("/api/v1/feedback",feedbackRoute);

export {app}
