import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
        {/* Left Side - Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            AI-Powered{" "}
            <span className="text-green-600">Personalized Diet Plans</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Get customized meal plans tailored to your health goals, dietary
            preferences, and lifestyle using AI-powered recommendations.
          </p>
          <div className="mt-6 flex justify-center lg:justify-start space-x-4">
            <Link to="/user-preference">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300">
                Get Your Plan
              </button>
            </Link>
            
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
          <img
            src="https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Healthy Food"
            className="w-full max-w-md lg:max-w-lg rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
