import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const requiredProfileFields = [
  "age",
  "weight",
  "height",
  "activityLevels",
  "preference",
  "gender",
  "goals",
  "workType",
];

export const AdvancedPreferencesForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get("/api/v1/users/current-user");
        const profile = response.data?.data || null;
        setUserProfile(profile);

        const hasCompleteProfile = requiredProfileFields.every(
          (field) => profile?.[field] !== undefined && profile?.[field] !== null && profile?.[field] !== ""
        );

        if (hasCompleteProfile) {
          navigate("/advance-diet-plan");
        }
      } catch (requestError) {
        console.error(requestError);
        setError("Please log in again to use seasonal recommendations.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

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

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
        Seasonal Recommendation Mode
      </p>
      <h1 className="mt-3 text-3xl font-bold text-gray-900">
        Seasonal recommendations use your saved profile automatically
      </h1>
      <p className="mt-3 text-gray-600">
        You do not need to fill your body attributes twice. The seasonal mode reads the same health and
        preference data that you already saved for the standard meal recommendation flow.
      </p>

      <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-sm text-gray-700">
        <p><strong>Age:</strong> {userProfile?.age ?? "Not set"}</p>
        <p><strong>Weight:</strong> {userProfile?.weight ?? "Not set"}</p>
        <p><strong>Height:</strong> {userProfile?.height ?? "Not set"}</p>
        <p><strong>Preference:</strong> {userProfile?.preference ?? "Not set"}</p>
        <p><strong>Goal:</strong> {userProfile?.goals ?? "Not set"}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/user-preference"
          className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
        >
          Update Standard Profile
        </Link>
        <Link
          to="/advance-diet-plan"
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Continue to Seasonal Recommendations
        </Link>
      </div>
    </div>
  );
};
