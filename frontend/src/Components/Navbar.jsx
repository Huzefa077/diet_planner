import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import LogoutButton from "./auth/Logout";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-600">
          AI Diet Planner
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium">
          <Link to="/" className="text-gray-700 hover:text-green-600 transition">
            Home
          </Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition">
            Dashboard
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-green-600 transition">
            About
          </Link>
          <Link to="/advance-diet-plan" className="text-gray-700 hover:text-green-600 transition">
            Seasonal Recommendation
          </Link>
        </div>

        {/* Login/Signup Button */}
        <div className="hidden md:block">
      {isLoggedIn ? (
        <LogoutButton />
      ) : (
        <Link to="/login">
          <button className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition hover:bg-green-700">
            Login / Sign Up
          </button>
        </Link>
      )}
    </div>


        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg p-4 absolute w-full left-0">
          <Link
            to="/"
            className="block py-2 text-gray-700 hover:text-green-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="block py-2 text-gray-700 hover:text-green-600"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/about"
            className="block py-2 text-gray-700 hover:text-green-600"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/advance-diet-plan"
            className="block py-2 text-gray-700 hover:text-green-600"
            onClick={() => setIsOpen(false)}
          >
            Seasonal Recommendation
          </Link>
          {isLoggedIn ? (
            <div onClick={() => setIsOpen(false)}>
              <LogoutButton />
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <button className="w-full mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Login / Sign Up
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
