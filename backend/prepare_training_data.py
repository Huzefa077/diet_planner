import pymongo
import pandas as pd

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://zayedans022:Zayed123@cluster0.d7hjd.mongodb.net")
db = client["library"]  # Replace with your database name

# Collections
users_collection = db["users"]
meals_collection = db["meals"]
foods_collection = db["foods"]

def consolidate_data():
    # Fetch users
    users = list(users_collection.find({}, {"_id": 1, "dietaryPreferences": 1, "healthGoals": 1}))
    users_df = pd.DataFrame(users)

    # Fetch meals
    meals = list(meals_collection.find({}, {"_id": 1, "foodItems": 1, "mealType": 1}))
    meals_df = pd.DataFrame(meals)

    # Fetch foods
    foods = list(foods_collection.find({}, {"_id": 1, "name": 1, "calories": 1, "protein": 1, "carbs": 1, "fats": 1}))
    foods_df = pd.DataFrame(foods)

    # Merge meals and foods
    meals_df = meals_df.explode("foodItems")  # If foodItems is a list
    meals_df = meals_df.rename(columns={"foodItems": "foodId"})
    consolidated = pd.merge(meals_df, foods_df, left_on="foodId", right_on="_id", how="left")

    # Add user preferences
    final_data = pd.merge(users_df, consolidated, left_on="_id", right_on="_id", how="inner")
    final_data = final_data.drop(columns=["_id"])  # Drop MongoDB IDs for training

    return final_data

# Consolidate data and save as CSV
data = consolidate_data()
data.to_csv("training_data.csv", index=False)
print("Data consolidated and saved as training_data.csv")
