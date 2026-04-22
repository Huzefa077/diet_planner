import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../lib/axios";

const seasonalMealTypes = {
  "Breads, cereals, fastfood,grains": ["Breakfast", "Snack"],
  "Drinks,Alcohol, Beverages": ["Breakfast", "Snack"],
  "Fruits A-F": ["Breakfast", "Snack"],
  "Fruits G-P": ["Breakfast", "Snack"],
  "Fruits R-Z": ["Breakfast", "Snack"],
  "Vegetables A-E": ["Lunch", "Dinner"],
  "Vegetables F-P": ["Lunch", "Dinner"],
  "Vegetables R-Z": ["Lunch", "Dinner"],
  "Fish, Seafood": ["Lunch", "Dinner"],
  "Meat, Poultry": ["Lunch", "Dinner"],
  Soups: ["Lunch", "Dinner"],
  "Seeds and Nuts": ["Snack", "Breakfast"],
  "Dairy products": ["Breakfast", "Snack"],
};

const getSuggestedMealTypes = (category) =>
  seasonalMealTypes[category] || ["Lunch"];

const groupRecommendationsByMeal = (foods) => {
  const grouped = {
    Breakfast: [],
    Lunch: [],
    Snack: [],
    Dinner: [],
  };

  foods.forEach((food) => {
    getSuggestedMealTypes(food.category).forEach((mealType) => {
      grouped[mealType].push(food);
    });
  });

  return grouped;
};

const SeasonalDietPlan = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [season, setSeason] = useState("");
  const [latestPlan, setLatestPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [addingKey, setAddingKey] = useState("");
  const [addedItems, setAddedItems] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError("Please log in to view recommendations.");
        setLoading(false);
        return;
      }

      try {
        const [seasonalResponse, latestPlanResponse] = await Promise.all([
          axios.post("/api/v1/recommendation/advanced-recommendations", {
            userId,
            type: "Seasonal",
          }),
          axios.get("/api/v1/meal/latest-diet"),
        ]);

        setRecommendations(seasonalResponse.data.recommendations || []);
        setSeason(seasonalResponse.data.season || "");
        setLatestPlan(latestPlanResponse.data?.data || null);
      } catch (requestError) {
        console.error(requestError);
        setError("Failed to fetch seasonal recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-xl bg-red-100 p-4 text-red-700">
        {error}
      </div>
    );
  }

  const totalCalories = recommendations.reduce((sum, food) => sum + (food.calories || 0), 0);
  const averageCalories = recommendations.length ? Math.round(totalCalories / recommendations.length) : 0;
  const today = new Date().toDateString();
  const todayPlan = latestPlan?.dailyPlans?.find(
    (dayPlan) => new Date(dayPlan.date).toDateString() === today
  );
  const canAddToPlan = Boolean(todayPlan) && todayPlan.status !== "Completed";
  const groupedRecommendations = groupRecommendationsByMeal(recommendations);

  const handleAddSeasonalFood = async (foodId, mealType) => {
    if (!todayPlan) {
      setActionError("Open your daily plan first so today's meals can be created.");
      return;
    }

    setActionError("");
    const key = `${foodId}-${mealType}`;
    setAddingKey(key);

    try {
      const response = await axios.post("/api/v1/meal/add-seasonal-food", {
        date: todayPlan.date,
        mealType,
        foodId,
      });

      setLatestPlan(response.data?.data || latestPlan);
      setAddedItems((prev) => ({ ...prev, [key]: true }));
    } catch (requestError) {
      console.error(requestError);
      setActionError(
        requestError.response?.data?.message || "Could not add this seasonal food to today's plan."
      );
    } finally {
      setAddingKey("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/diet-plan"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
          >
            Standard Plan
          </Link>
          <Link
            to="/dashboard"
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-900"
          >
            Dashboard
          </Link>
        </div>

        <section className="rounded-3xl bg-white/85 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            Seasonal Layer
          </p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">Seasonal Picks for Your Plan</h1>
          <p className="mx-auto mt-3 max-w-3xl text-center text-gray-600">
            These are season-friendly foods filtered with your saved diet preference. Add them into
            today's meal slots when you want more variety without leaving your main plan flow.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-amber-50 p-5">
              <p className="text-sm text-gray-500">Current season</p>
              <p className="mt-2 text-3xl font-bold text-amber-700">{season || "Seasonal"}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-5">
              <p className="text-sm text-gray-500">Recommended foods</p>
              <p className="mt-2 text-3xl font-bold text-emerald-700">{recommendations.length}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm text-gray-500">Average calories</p>
              <p className="mt-2 text-3xl font-bold text-blue-700">{averageCalories}</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50/80 p-5 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">How this fits the product flow</p>
            <p className="mt-2">
              Your daily plan is still the main tracker. Seasonal picks work like optional swaps or
              add-ons, so this feature feels connected to the rest of the app instead of being a separate demo.
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white/85 p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Use seasonal foods in today's plan</h2>
              <p className="mt-2 text-gray-600">
                {todayPlan
                  ? todayPlan.status === "Completed"
                    ? "Today's plan is already completed, so it is locked for changes."
                    : "Choose a suggested meal slot on any seasonal card to add that item to today's plan."
                  : "Open your daily plan once to generate today's meals, then you can add seasonal foods here."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/diet-plan"
                className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                {todayPlan ? "Open Today's Plan" : "Create Today's Plan"}
              </Link>
              <Link
                to="/user-preference"
                className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow hover:bg-gray-50"
              >
                Update Profile
              </Link>
            </div>
          </div>
          {!!actionError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>
          )}
        </section>

        {Object.entries(groupedRecommendations)
          .filter(([, foods]) => foods.length > 0)
          .map(([mealType, foods]) => (
          <section key={mealType} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                  Seasonal suggestions
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">{mealType}</h2>
              </div>
              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                {foods.length} options
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {foods.slice(0, 4).map((food) => (
                <article
                  key={`${mealType}-${food._id}`}
                  className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-gray-900">{food.name}</h3>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      {food.category || "Seasonal"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p><strong>Calories:</strong> {food.calories} kcal</p>
                    <p><strong>Protein:</strong> {food.protein}g</p>
                    <p><strong>Carbs:</strong> {food.carbs}g</p>
                    <p><strong>Fats:</strong> {food.fats}g</p>
                    <p>
                      <strong>Serving:</strong> {food.servingSize?.amount ?? 0} {food.servingSize?.unit ?? "unit"}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {getSuggestedMealTypes(food.category).map((suggestedMealType) => {
                      const key = `${food._id}-${suggestedMealType}`;
                      const isAdded = addedItems[key];

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleAddSeasonalFood(food._id, suggestedMealType)}
                          disabled={!canAddToPlan || addingKey === key || isAdded}
                          className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-200"
                        >
                          {isAdded
                            ? `Added to ${suggestedMealType}`
                            : addingKey === key
                            ? "Adding..."
                            : `Add to ${suggestedMealType}`}
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl bg-white/85 p-6 text-center shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-900">Next Steps</h2>
          <p className="mt-2 text-gray-600">
            Continue your daily plan, review progress in the dashboard, or update the profile that powers both flows.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/diet-plan"
              className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Open Daily Plan
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Open Dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeasonalDietPlan;
