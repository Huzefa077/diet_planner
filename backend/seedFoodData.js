import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Food } from "./src/models/foodItem.model.js"; // Update the path as needed

dotenv.config({
  path: "./.env",
});

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in backend/.env");
}

// Connect to the same MongoDB database the app uses
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

const results = [];

// Helper function to determine vegetarian and vegan status
const determineVegetarianStatus = (name, category) => {
  const nonVegetarianKeywords = ["chicken", "beef", "pork", "fish", "egg", "meat", "lamb", "shrimp", "bacon"];
  const veganExcludedCategories = ["dairy", "egg"];

  const lowerName = name.toLowerCase();
  const lowerCategory = category.toLowerCase();

  const isNonVegetarian = nonVegetarianKeywords.some((keyword) => lowerName.includes(keyword));
  const isVegan = !isNonVegetarian && !veganExcludedCategories.includes(lowerCategory);

  return {
    isVegetarian: !isNonVegetarian, // Vegetarian if no non-veg keyword is found
    isVegan,
  };
};

// Helper function to determine gluten-free status
const determineGlutenFreeStatus = (name, category) => {
  const glutenContainingKeywords = ["wheat", "barley", "rye", "bread", "pasta", "flour", "cracker", "cake", "cookie", "beer"];
  const glutenFreeCategories = ["fruit", "vegetables", "protein", "dairy", "fat", "beverage"]; // Categories likely to be gluten-free

  const lowerName = name.toLowerCase();
  const lowerCategory = category.toLowerCase();

  const containsGluten = glutenContainingKeywords.some((keyword) => lowerName.includes(keyword));
  const isGlutenFree = !containsGluten && glutenFreeCategories.includes(lowerCategory);

  return isGlutenFree;
};

fs.createReadStream("nutrients.csv") // Ensure the path and file name are correct
  .pipe(csv())
  .on("data", (data) => {
    const validUnits = ["g", "ml", "oz", "cup", "tbsp", "tsp"]; // Valid units

    try {
      // Extract and validate data
      const name = data["Food"]?.trim() || "Unknown"; // Default to 'Unknown' for missing names
      const servingSizeAmount = parseFloat(data["Grams"]) || 0; // Default to 0 if missing or invalid
      const servingSizeUnit = data["servingSize.unit"]?.trim()?.toLowerCase() || "g"; // Default to 'g'
      const sanitizedUnit = validUnits.includes(servingSizeUnit) ? servingSizeUnit : "g";

      const calories = parseFloat(data["Calories"]) || 0; // Default to 0
      const protein = parseFloat(data["Protein"]) || 0;
      const carbs = parseFloat(data["Carbs"]) || 0;
      const fats = parseFloat(data["Fat"]) || 0;

      // Category validation and sanitization
      /*
      const category = ["Fruits A-F","Fruits G-P","Fruits R-Z","Vegetables A-E","Vegetables F-P","Vegetables R-Z","Meat,Poultry","Dairy products","Breads, cereals, fastfood,grains","Fats,Oil,Shortenings","Drinks,Alcohol, Beverages","Other","Fish,Seafood","Soups","Desserts, sweets","Seeds and Nuts"].includes(
        data["Category"]?.trim()?.toLowerCase()
      )
        ? data["Category"].trim()
        : "Other"; // Default to 'Other'
        */
        const category = data["Category"]?.trim() || "Other";

      // Determine isVegetarian, isVegan, and isGlutenFree dynamically
      const { isVegetarian, isVegan } = determineVegetarianStatus(name, category);
      const isGlutenFree = determineGlutenFreeStatus(name, category);

      // Push valid food object to results
      results.push({
        name,
        servingSize: {
          amount: servingSizeAmount,
          unit: sanitizedUnit,
        },
        calories,
        protein,
        carbs,
        fats,
        isVegetarian,
        isVegan,
        isGlutenFree,
        category,
      });
    } catch (error) {
      console.error("Error processing data:", error);
    }
  })
  .on("end", async () => {
    try {
      // Reset foods so reseeding does not duplicate entries.
      await Food.deleteMany({});
      await Food.insertMany(results);
      console.log(`Food data inserted successfully: ${results.length} items`);
    } catch (err) {
      console.error("Error inserting data:", err);
    } finally {
      mongoose.connection.close();
    }
  });
