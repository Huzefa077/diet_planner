import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "../lib/axios";

const Dashboard = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLatestPlan = async () => {
      try {
        const response = await axios.get("/api/v1/meal/latest-diet");
        setPlan(response.data.data || null);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load dashboard data right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPlan();
  }, []);

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

  if (!plan || !plan.dailyPlans?.length) {
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-3 text-gray-600">
          No tracked diet plan yet. Generate a plan first, then your progress charts will appear here.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/user-preference"
            className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            Create Diet Plan
          </Link>
          <Link
            to="/advance-user-preference"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Seasonal Recommendation
          </Link>
        </div>
      </div>
    );
  }

  const dayData = plan.dailyPlans.map((dayPlan) => {
    const consumed = dayPlan.meals.reduce(
      (totals, meal) => {
        meal.foods.forEach((food) => {
          if (food.isConsumed) {
            totals.calories += food.calories || 0;
            totals.protein += food.protein || 0;
            totals.carbs += food.carbs || 0;
            totals.fats += food.fats || 0;
            totals.consumedFoods += 1;
          }

          totals.totalFoods += 1;
        });

        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0, consumedFoods: 0, totalFoods: 0 }
    );

    const planned = dayPlan.totalNutrients || {};
    const completion = consumed.totalFoods
      ? Math.round((consumed.consumedFoods / consumed.totalFoods) * 100)
      : 0;

    return {
      dateLabel: new Date(dayPlan.date).toLocaleDateString(),
      plannedCalories: planned.calories || 0,
      consumedCalories: consumed.calories,
      plannedProtein: planned.protein || 0,
      consumedProtein: consumed.protein,
      plannedCarbs: planned.carbs || 0,
      consumedCarbs: consumed.carbs,
      plannedFats: planned.fats || 0,
      consumedFats: consumed.fats,
      completion,
      consumedFoods: consumed.consumedFoods,
      totalFoods: consumed.totalFoods,
    };
  });

  const totals = dayData.reduce(
    (summary, day) => ({
      plannedCalories: summary.plannedCalories + day.plannedCalories,
      consumedCalories: summary.consumedCalories + day.consumedCalories,
      plannedProtein: summary.plannedProtein + day.plannedProtein,
      consumedProtein: summary.consumedProtein + day.consumedProtein,
      plannedCarbs: summary.plannedCarbs + day.plannedCarbs,
      consumedCarbs: summary.consumedCarbs + day.consumedCarbs,
      plannedFats: summary.plannedFats + day.plannedFats,
      consumedFats: summary.consumedFats + day.consumedFats,
      consumedFoods: summary.consumedFoods + day.consumedFoods,
      totalFoods: summary.totalFoods + day.totalFoods,
    }),
    {
      plannedCalories: 0,
      consumedCalories: 0,
      plannedProtein: 0,
      consumedProtein: 0,
      plannedCarbs: 0,
      consumedCarbs: 0,
      plannedFats: 0,
      consumedFats: 0,
      consumedFoods: 0,
      totalFoods: 0,
    }
  );

  const overallCompletion = totals.totalFoods
    ? Math.round((totals.consumedFoods / totals.totalFoods) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0fdf4,_#eff6ff_55%,_#ffffff)] px-4 py-10">
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
            Back to Meal Plan
          </Link>
          <Link
            to="/advance-diet-plan"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Seasonal View
          </Link>
        </div>

        <section className="rounded-3xl bg-white/90 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
            Progress Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">Meal Completion and Nutrition Tracking</h1>
          <p className="mx-auto mt-3 max-w-3xl text-center text-gray-600">
            Track completed meals, compare planned and consumed nutrition, and review progress over time.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-sm text-gray-500">Overall completion</p>
              <p className="mt-2 text-3xl font-bold text-green-700">{overallCompletion}%</p>
              <p className="mt-1 text-sm text-gray-600">
                {totals.consumedFoods} of {totals.totalFoods} foods completed
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm text-gray-500">Calories</p>
              <p className="mt-2 text-3xl font-bold text-blue-700">{totals.consumedCalories}</p>
              <p className="mt-1 text-sm text-gray-600">
                Planned: {totals.plannedCalories}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-5">
              <p className="text-sm text-gray-500">Protein</p>
              <p className="mt-2 text-3xl font-bold text-amber-700">{totals.consumedProtein}g</p>
              <p className="mt-1 text-sm text-gray-600">
                Planned: {totals.plannedProtein}g
              </p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-sm text-gray-500">Carbs / Fats</p>
              <p className="mt-2 text-2xl font-bold text-purple-700">
                {totals.consumedCarbs}g / {totals.consumedFats}g
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Planned: {totals.plannedCarbs}g / {totals.plannedFats}g
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/90 p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">Planned vs Consumed Calories</h2>
            <p className="mt-1 text-sm text-gray-600">Compare what the system recommended with what the user actually completed.</p>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateLabel" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="plannedCalories" fill="#94a3b8" name="Planned" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="consumedCalories" fill="#22c55e" name="Consumed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl bg-white/90 p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">Completion Rate by Date</h2>
            <p className="mt-1 text-sm text-gray-600">Shows whether the user followed the full plan for each recorded day.</p>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateLabel" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    name="Completion %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white/90 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900">Day-by-Day Summary</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead>
                <tr className="text-gray-500">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Completion</th>
                  <th className="px-4 py-3 font-semibold">Foods</th>
                  <th className="px-4 py-3 font-semibold">Calories</th>
                  <th className="px-4 py-3 font-semibold">Protein</th>
                  <th className="px-4 py-3 font-semibold">Carbs</th>
                  <th className="px-4 py-3 font-semibold">Fats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dayData.map((day) => (
                  <tr key={day.dateLabel}>
                    <td className="px-4 py-3 font-medium text-gray-900">{day.dateLabel}</td>
                    <td className="px-4 py-3 text-gray-700">{day.completion}%</td>
                    <td className="px-4 py-3 text-gray-700">
                      {day.consumedFoods}/{day.totalFoods}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {day.consumedCalories} / {day.plannedCalories}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {day.consumedProtein}g / {day.plannedProtein}g
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {day.consumedCarbs}g / {day.plannedCarbs}g
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {day.consumedFats}g / {day.plannedFats}g
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
