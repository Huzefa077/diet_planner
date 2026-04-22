export default function WhyChooseUs() {
    const benefits = [
      {
        title: "AI-Powered Recommendations",
        description: "Get highly personalized diet plans tailored to your needs.",
        icon: "🚀",
      },
      {
        title: "Easy to Use",
        description: "Simple and intuitive interface for effortless diet planning.",
        icon: "👍",
      },
      {
        title: "Science-Backed Nutrition",
        description: "Our recommendations are based on scientific research.",
        icon: "📚",
      },
      {
        title: "Track & Improve",
        description: "Monitor your diet and make improvements over time.",
        icon: "📈",
      },
      
    ];
  
    return (
      <section className="bg-white py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 mt-2">
            Discover the key benefits of using AI-powered diet planning.
          </p>
  
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-2xl shadow-lg text-center transform transition hover:scale-105"
              >
                <div className="text-4xl">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mt-4">{benefit.title}</h3>
                <p className="text-gray-600 mt-2">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  