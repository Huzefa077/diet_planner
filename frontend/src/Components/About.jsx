import React from "react";
import Navbar from "./Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-green-50 to-gray-100 min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white py-24 text-center overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in-down">
              About <span className="text-yellow-300">AI Diet Planner</span>
            </h1>
            <p className="mt-4 text-xl font-light opacity-90">
              Revolutionizing nutrition through artificial intelligence
            </p>
          </div>
          <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-light.png')"}}></div>
        </section>

        {/* Features Section */}
        <section className="py-16 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Plans",
                content: "Custom diet recommendations tailored to your DNA, lifestyle, and goals",
                icon: "🧬"
              },
              {
                title: "Science-Backed Nutrition",
                content: "Clinical-grade recommendations validated by nutrition experts",
                icon: "🔬"
              },
              {
                title: "AI-Powered Intelligence",
                content: "Deep learning algorithms that evolve with your progress",
                icon: "🤖"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2"
              >
                <div className="text-6xl mb-4 opacity-90 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white bg-opacity-50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="relative">
              <div className="absolute -left-8 top-0 w-1 h-full bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  Our Mission
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To democratize access to personalized nutrition through cutting-edge AI technology, 
                making healthy living accessible to everyone.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-amber-500 rounded-full"></div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                <span className="bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent">
                  Our Vision
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                A future where AI-powered health guidance helps prevent chronic diseases 
                and empowers individuals to take control of their well-being.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section 
        <section className="py-20 bg-gradient-to-br from-green-500 to-emerald-700 text-white">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-sm opacity-90">Happy Users</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">97%</div>
              <div className="text-sm opacity-90">Success Rate</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-sm opacity-90">Nutrition Experts</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90">AI Support</div>
            </div>
          </div>
        </section>
        */}
      </div>
    </>
  );
};

export default About;