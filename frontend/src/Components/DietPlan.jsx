import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../lib/axios";

const emptyMacros = { calories: 0, protein: 0, carbs: 0, fats: 0 };

const addMacros = (totals, item) => ({
  calories: totals.calories + (item.calories || 0),
  protein: totals.protein + (item.protein || 0),
  carbs: totals.carbs + (item.carbs || 0),
  fats: totals.fats + (item.fats || 0),
});

const getProgressPercent = (consumedCount, totalCount) => {
  if (!totalCount) return 0;
  return Math.round((consumedCount / totalCount) * 100);
};

const isSameDay = (dateA, dateB) =>
  new Date(dateA).toDateString() === new Date(dateB).toDateString();

const buildPlanSummary = (dailyPlans, consumedFoods) => {
  const summary = {
    planned: { ...emptyMacros },
    consumed: { ...emptyMacros },
    totalFoods: 0,
    consumedFoods: 0,
  };

  dailyPlans.forEach((dayPlan) => {
    dayPlan.meals.forEach((meal) => {
      summary.planned = addMacros(summary.planned, meal.totalNutrients || emptyMacros);

      meal.foods.forEach((food) => {
        summary.totalFoods += 1;

        if (consumedFoods[food._id]) {
          summary.consumedFoods += 1;
          summary.consumed = addMacros(summary.consumed, food);
        }
      });
    });
  });

  summary.progress = getProgressPercent(summary.consumedFoods, summary.totalFoods);
  return summary;
};

const DietPlan = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [consumedFoods, setConsumedFoods] = useState({});
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyMeal, setBusyMeal] = useState("");
  const [completingDay, setCompletingDay] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError("Please log in to view your diet plan.");
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      try {
        setLoading(true);
        const latestPlanResponse = await axios.get("/api/v1/meal/latest-diet");
        const latestPlan = latestPlanResponse.data?.data;
        const todayPlan =
          latestPlan?.dailyPlans?.some((dayPlan) => isSameDay(dayPlan.date, today))
            ? latestPlan
            : null;

        const planResponse = todayPlan
          ? { data: todayPlan }
          : await axios.post("/api/v1/recommendation/recommend", {
              userId,
              startDate: today,
              endDate: today,
            });

        const generatedPlan = planResponse.data;
        const initialConsumed = {};

        generatedPlan.dailyPlans.forEach((dayPlan) => {
          dayPlan.meals.forEach((meal) => {
            meal.foods.forEach((food) => {
              initialConsumed[food._id] = Boolean(food.isConsumed);
            });
          });
        });

        setMealPlan(generatedPlan);
        setConsumedFoods(initialConsumed);
      } catch (fetchError) {
        console.log("Error fetching meals:", fetchError);
        setError("Failed to load meal plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFoodConsumption = async (mealId, foodId, isConsumed) => {
    setConsumedFoods((prev) => ({
      ...prev,
      [foodId]: isConsumed,
    }));

    if (!isConsumed) {
      setRatings((prev) => {
        const updatedRatings = { ...prev };
        delete updatedRatings[foodId];
        return updatedRatings;
      });
    }

    try {
      await axios.post("/api/v1/meal/mark-consumed", {
        mealId,
        foodId,
        isConsumed,
      });
    } catch (updateError) {
      console.error("Error updating consumption:", updateError);
      setConsumedFoods((prev) => ({
        ...prev,
        [foodId]: !isConsumed,
      }));
    }
  };

  const handleMealToggle = async (meal, shouldConsume) => {
    setBusyMeal(meal._id);

    try {
      await Promise.all(
        meal.foods.map((food) =>
          handleFoodConsumption(meal._id, food._id, shouldConsume)
        )
      );
    } finally {
      setBusyMeal("");
    }
  };

  const handleRatingSubmit = async (foodId, mealId, rating) => {
    try {
      setRatings((prev) => ({
        ...prev,
        [foodId]: rating,
      }));

      await axios.post("/api/v1/feedback/submit-rating", {
        foodId,
        mealId,
        rating,
        userId,
      });
    } catch (submitError) {
      console.error("Error submitting rating:", submitError);
    }
  };

  const handleCompleteDay = async (date) => {
    try {
      setCompletingDay(date);
      const response = await axios.post("/api/v1/meal/complete-day", { date });
      setMealPlan(response.data.data);
    } catch (completeError) {
      console.error("Error completing diet day:", completeError);
      setError("Could not mark the day as completed. Please try again.");
    } finally {
      setCompletingDay("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-red-100 p-4 text-red-700">
        {error}
      </div>
    );
  }

  const dailyPlans = mealPlan?.dailyPlans || [];
  const planSummary = buildPlanSummary(dailyPlans, consumedFoods);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-10 px-4">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/user-preference"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
          >
            Update Preferences
          </Link>
          <Link
            to="/advance-user-preference"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Seasonal Recommendations
          </Link>
          <Link
            to="/dashboard"
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-900"
          >
            View Dashboard
          </Link>
        </div>

        <section className="rounded-3xl bg-white/90 p-8 shadow-xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
            Daily Plan
          </p>
          <h1 className="mt-3 text-center text-4xl font-bold text-gray-900">
            Your Personalized Meal Plan
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Follow your meal plan, mark foods as consumed, and review your daily nutrition progress.
          </p>
          <p className="mt-2 text-center text-sm font-medium text-green-700">
            Progress is auto-saved. You can leave this page and continue later.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-sm text-gray-500">Completion</p>
              <p className="mt-2 text-3xl font-bold text-green-700">{planSummary.progress}%</p>
              <p className="mt-1 text-sm text-gray-600">
                {planSummary.consumedFoods} of {planSummary.totalFoods} foods consumed
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm text-gray-500">Consumed Calories</p>
              <p className="mt-2 text-3xl font-bold text-blue-700">{planSummary.consumed.calories}</p>
              <p className="mt-1 text-sm text-gray-600">
                Planned: {planSummary.planned.calories}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-5">
              <p className="text-sm text-gray-500">Protein</p>
              <p className="mt-2 text-3xl font-bold text-amber-700">{planSummary.consumed.protein}g</p>
              <p className="mt-1 text-sm text-gray-600">
                Planned: {planSummary.planned.protein}g
              </p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-sm text-gray-500">Carbs / Fats</p>
              <p className="mt-2 text-2xl font-bold text-purple-700">
                {planSummary.consumed.carbs}g / {planSummary.consumed.fats}g
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Planned: {planSummary.planned.carbs}g / {planSummary.planned.fats}g
              </p>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
              style={{ width: `${planSummary.progress}%` }}
            />
          </div>
        </section>

        {dailyPlans.map((dayPlan) => (
          <section key={dayPlan._id || dayPlan.date} className="space-y-6">
            {(() => {
              const dayTotals = dayPlan.totalNutrients || emptyMacros;
              const isCompleted = dayPlan.status === "Completed";
              return (
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {new Date(dayPlan.date).toLocaleDateString()}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Planned totals: {dayTotals.calories} kcal, {dayTotals.protein}g protein,
                    {` ${dayTotals.carbs}g carbs, ${dayTotals.fats}g fats`}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        isCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isCompleted ? "Completed" : "In Progress"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCompleteDay(dayPlan.date)}
                      disabled={isCompleted || completingDay === dayPlan.date}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {isCompleted
                        ? "Day Completed"
                        : completingDay === dayPlan.date
                        ? "Saving..."
                        : "Finish This Day"}
                    </button>
                  </div>
                </div>
              );
            })()}

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {dayPlan.meals.map((meal) => {
                const mealTotals = meal.totalNutrients || emptyMacros;
                const isCompleted = dayPlan.status === "Completed";
                const consumedCount = meal.foods.filter((food) => consumedFoods[food._id]).length;
                const mealProgress = getProgressPercent(consumedCount, meal.foods.length);
                const consumedMacros = meal.foods.reduce((totals, food) => {
                  if (!consumedFoods[food._id]) return totals;
                  return addMacros(totals, food);
                }, { ...emptyMacros });
                const allChecked = meal.foods.length > 0 && consumedCount === meal.foods.length;

                return (
                  <div
                    key={meal._id}
                    className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{meal.mealType}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {consumedCount}/{meal.foods.length} items consumed
                        </p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        {mealProgress}%
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMealToggle(meal, true)}
                        disabled={isCompleted || busyMeal === meal._id || allChecked}
                        className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMealToggle(meal, false)}
                        disabled={isCompleted || busyMeal === meal._id || consumedCount === 0}
                        className="flex-1 rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                      <p>Consumed calories: {consumedMacros.calories} / {mealTotals.calories}</p>
                      <p>Protein: {consumedMacros.protein}g / {mealTotals.protein}g</p>
                      <p>Carbs: {consumedMacros.carbs}g / {mealTotals.carbs}g</p>
                      <p>Fats: {consumedMacros.fats}g / {mealTotals.fats}g</p>
                    </div>

                    <ul className="mt-4 space-y-3">
                      {meal.foods.map((food) => (
                        <li
                          key={food._id}
                          className={`rounded-2xl border p-4 shadow-sm ${
                            consumedFoods[food._id] ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={consumedFoods[food._id] || false}
                              onChange={(event) =>
                                handleFoodConsumption(meal._id, food._id, event.target.checked)
                              }
                              disabled={isCompleted}
                              className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">{food.name}</p>
                                  <p className="text-sm text-gray-500">
                                    Serving: {food.servingSize?.amount ?? 0} {food.servingSize?.unit ?? "unit"}
                                  </p>
                                </div>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow">
                                  {food.calories} kcal
                                </span>
                              </div>

                              <p className="mt-2 text-sm text-gray-600">
                                Protein {food.protein}g, Carbs {food.carbs}g, Fats {food.fats}g
                              </p>

                              {consumedFoods[food._id] && (
                                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                                  <label className="text-sm font-medium text-gray-700">
                                    Feedback
                                  </label>
                                  <select
                                    value={ratings[food._id] || ""}
                                    onChange={(event) =>
                                      handleRatingSubmit(food._id, meal._id, Number(event.target.value))
                                    }
                                    disabled={isCompleted}
                                    className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm sm:w-auto disabled:cursor-not-allowed disabled:bg-gray-100"
                                  >
                                    <option value="">Rate this food</option>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                  </select>
                                </div>
                              )}

                              {isCompleted && (
                                <p className="mt-3 text-xs font-medium text-green-700">
                                  This day is locked because it has already been completed.
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section className="rounded-3xl bg-white/90 p-6 text-center shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-900">What next?</h2>
          <p className="mt-2 text-gray-600">
            View your dashboard, update your profile, or return later to continue tracking.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Open Dashboard
            </Link>
            <Link
              to="/user-preference"
              className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Generate Another Plan
            </Link>
            <Link
              to="/"
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow hover:bg-gray-50"
            >
              Save and Continue Later
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DietPlan;
