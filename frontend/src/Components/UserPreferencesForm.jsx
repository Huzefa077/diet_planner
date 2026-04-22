import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../lib/axios";

export const UserPreferencesForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    activityLevels: "",
    preference: "",
    gender: "",
    goals: "",
    workType: "",
    medicalConditions: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");

  const activityLevelsOptions = ["Low", "Moderate", "High"];
  const preferenceOptions = ["Vegan", "Vegetarian", "Non-Vegetarian"];
  const genderOptions = ["Male", "Female", "Other"];
  const goalsOptions = ["Weight loss", "Weight gain", "Muscle Building"];
  const workTypeOptions = [
    { label: "Sedentary", value: "sedentary" },
    { label: "Lightly Active", value: "lightly-active" },
    { label: "Moderately Active", value: "moderately-active" },
    { label: "Very Active", value: "very-active" },
    { label: "Extra Active", value: "extra-active" },
  ];

  useEffect(() => {
    const loadCurrentProfile = async () => {
      try {
        const response = await axios.get("/api/v1/users/current-user");
        const profile = response.data?.data;

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            age: profile.age ?? "",
            weight: profile.weight ?? "",
            height: profile.height ?? "",
            activityLevels: profile.activityLevels ?? "",
            preference: profile.preference ?? "",
            gender: profile.gender ?? "",
            goals: profile.goals ?? "",
            workType: profile.workType ?? "",
            medicalConditions: profile.medicalConditions ?? "",
          }));
        }
      } catch (loadError) {
        console.error("Failed to load current profile", loadError);
      } finally {
        setProfileLoading(false);
      }
    };

    loadCurrentProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "/api/v1/users/details",
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        navigate("/diet-plan");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white/95 p-8 shadow-xl">
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
            Daily Plan
          </Link>
          <Link
            to="/advance-user-preference"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600"
          >
            Seasonal Picks
          </Link>
          <Link
            to="/dashboard"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
            Profile Setup
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            Personalize Your Diet Plan
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Save your basic health details once. The app uses this profile for your daily meal plan,
            dashboard summaries, and seasonal suggestions.
          </p>
          {profileLoading && (
            <p className="mt-3 text-sm text-gray-500">Loading your saved details...</p>
          )}
        </div>

        {error && <p className="mt-6 text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { label: "Age", name: "age", type: "number" },
              { label: "Weight (kg)", name: "weight", type: "number" },
              { label: "Height (cm)", name: "height", type: "number" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
            ))}

            {[
              { label: "Gender", name: "gender", options: genderOptions },
              { label: "Activity Level", name: "activityLevels", options: activityLevelsOptions },
              { label: "Dietary Preference", name: "preference", options: preferenceOptions },
              { label: "Health Goals", name: "goals", options: goalsOptions },
              { label: "Work Type", name: "workType", options: workTypeOptions },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700">
                  {field.label}
                </label>
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-green-400"
                  required
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {field.options.map((option) => (
                    <option
                      key={typeof option === "string" ? option : option.value}
                      value={typeof option === "string" ? option : option.value}
                    >
                      {typeof option === "string" ? option : option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Medical Conditions
              </label>
              <input
                type="text"
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-green-400"
                placeholder="e.g., Diabetes, Hypertension"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || profileLoading}
            className="w-full rounded-lg bg-green-600 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Saving Profile..." : "Save Profile and Open Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};
