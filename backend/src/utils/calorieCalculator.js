export const calculateCalorieRequirements = (user) => {
    const { age, weight, height, activityLevels, gender } = user;
  
    if (!age || !weight || !height || !activityLevels || !gender) {
      throw new Error("Missing user details for calorie calculation");
    }
  
    let bmr;
    if (gender === "Male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
  
    const activityMultiplier = {
      Low: 1.2,
      Moderate: 1.55,
      High: 1.9,
    }[activityLevels] || 1.2;
  
    const maintenanceCalories = bmr * activityMultiplier;
    const calorieAdjustments = {
      "Weight loss": -500,
      "Weight gain": 500,
      "Muscle Building": 250,
    }[user.goals] || 0;
  
    return {
      maintenanceCalories,
      maxCalories: Math.max(0, maintenanceCalories + calorieAdjustments), // Ensure positive calories
    };
  };
  