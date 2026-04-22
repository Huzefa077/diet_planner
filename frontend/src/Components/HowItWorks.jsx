export default function HowItWorks() {
    const steps = [
      {
        title: "Enter Your Details",
        description: "Provide your dietary preferences and health goals.",
        icon: "📝",
      },
      {
        title: "AI Generates a Plan",
        description: "Our AI recommends a personalized diet plan for you.",
        icon: "🤖",
      },
      {
        title: "Track Your Progress",
        description: "Monitor your diet and adjust as needed.",
        icon: "📊",
      },
    ];
  
    return (
      <section className="bg-gray-100 py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            How It Works
          </h2>
          <p className="text-gray-600 mt-2">
            Follow these simple steps to get your personalized diet plan.
          </p>
  
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg text-center transform transition hover:scale-105"
              >
                <div className="text-4xl">{step.icon}</div>
                <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
                <p className="text-gray-600 mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  