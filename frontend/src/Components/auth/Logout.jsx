import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios";

const LogoutButton = () => {
  const navigate = useNavigate();

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      clearSession();
      navigate("/login");
    } catch (error) {
      console.log("Logout failed", error);
      if (error.response?.status === 401) {
        clearSession();
        navigate("/login");
      }
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
