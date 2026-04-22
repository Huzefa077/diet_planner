"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from pymongo import MongoClient
import pickle

# Connect to MongoDB
MONGO_URI = "mongodb+srv://zayedans022:Zayed123@cluster0.d7hjd.mongodb.net"  # Replace with your MongoDB URI
client = MongoClient(MONGO_URI)
db = client["library"]  # Replace with your database name

# Fetch the cleaned data from MongoDB
def fetch_data():
    collection = db["Foods"]  # Replace with the collection name
    data = list(collection.find())
    return pd.DataFrame(data)

# Preprocess the data
def preprocess_data(df):
    # Drop unnecessary fields
    df = df[["preference", "goals","workType"]]
    
    # Convert categorical data to numerical (e.g., healthGoals)
    df["goals"] = df["goals"].astype("category").cat.codes
    
    # Feature engineering for meals and preferences (convert to vectors)
    df["meal_vector"] = df["workType"].apply(lambda x: len(x))  # Example: number of meals
    df["preferences_vector"] = df["preference"].apply(lambda x: len(x))  # Example: number of preferences
    
    # Replace missing ratings with median or a default value
    df["rating"] = df["rating"].fillna(df["rating"].median())
    
    # Prepare features (X) and target (y)
    X = df[["goals", "meal_vector", "preferences_vector"]]
    y = df["rating"]
    return X, y

# Train the model
def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    return model

# Save the model
def save_model(model, filepath="recommendation_model.pkl"):
    with open(filepath, "wb") as file:
        pickle.dump(model, file)
    print(f"Model saved to {filepath}")

if __name__ == "__main__":
    df = fetch_data()
    X, y = preprocess_data(df)
    model = train_model(X, y)
    save_model(model)

    """

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from bson import ObjectId

def get_user_preferences(user_id, db):
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})  # Convert string ID to ObjectId
    except:
        raise ValueError(f"Invalid user_id format: {user_id}")

    if not user:
        raise ValueError(f"User with ID {user_id} not found in the database")
    return {
        "isVegan": user.get("isVegan", False),
        "isVegetarian": user.get("isVegetarian", False),
        "isGlutenFree": user.get("isGlutenFree", False),
        "goal": user.get("goal", "maintain"),
        "preferredCalories": user.get("preferredCalories", 2000),
        "preferredProtein": user.get("preferredProtein", 50),
    }

def get_food_items(db):
    return list(db.foods.find({}))

def create_feature_vector(food_item):
    return np.array([
        food_item.get("calories", 0),
        food_item.get("protein", 0),
        food_item.get("carbs", 0),
        food_item.get("fats", 0),
        1 if food_item.get("isVegan", False) else 0,
        1 if food_item.get("isVegetarian", False) else 0,
        1 if food_item.get("isGlutenFree", False) else 0,
    ])

def create_user_vector(user_prefs):
    return np.array([
        user_prefs["preferredCalories"],
        user_prefs["preferredProtein"],
        0,  # Carbs placeholder (optional)
        0,  # Fats placeholder (optional)
        1 if user_prefs["isVegan"] else 0,
        1 if user_prefs["isVegetarian"] else 0,
        1 if user_prefs["isGlutenFree"] else 0,
    ])

def recommend_meals(user_id, db):
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise ValueError(f"Invalid user ID format: {user_id}")

    if not user:
        raise ValueError(f"User with ID {user_id} not found.")

    if not user:
        raise ValueError(f"User with ID {user_id} not found.")
    user_prefs = get_user_preferences(user_id, db)
    food_items = get_food_items(db)
    
    user_vector = create_user_vector(user_prefs)
    food_vectors = np.array([create_feature_vector(food) for food in food_items])

    filtered_foods = [
        food for food in food_items 
        if (user["isVegetarian"] and food["isVegetarian"]) or not user["isVegetarian"]
    ]
    
    filtered_vectors = [food["vector"] for food in filtered_foods]
    similarity_scores = cosine_similarity([user_vector], filtered_vectors)[0]

# Print filtered results
    for food, score in zip(filtered_foods, similarity_scores):
        print(f"Food: {food['name']}, Similarity Score: {score:.4f}")

    sorted_indices = np.argsort(similarity_scores)[::-1]
    
    recommended_foods = [food_items[i] for i in sorted_indices[:10]]  # Top 10 recommendations
    return recommended_foods

# Example MongoDB connection
client = MongoClient("mongodb+srv://zayedans022:Zayed123@cluster0.d7hjd.mongodb.net")
db = client.library

# Example usage
user_id = "67718e816fd185605671a26a"
recommended_meals = recommend_meals(user_id, db)
print(recommended_meals)

