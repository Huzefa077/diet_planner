import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../lib/axios'
import Navbar from '../Navbar'
import HeroSection from '../HeroSection'
import Footer from '../Footer'
import HowItWorks from '../HowItWorks'
import WhyChooseUs from '../WhyChooseUs'

function Home() {
  const [latestPlan, setLatestPlan] = useState(null)
  const [loadingPlan, setLoadingPlan] = useState(true)
  const isLoggedIn = Boolean(localStorage.getItem("token"))

  useEffect(() => {
    const loadLatestPlan = async () => {
      if (!isLoggedIn) {
        setLoadingPlan(false)
        return
      }

      try {
        const response = await axios.get("/api/v1/meal/latest-diet")
        setLatestPlan(response.data?.data || null)
      } catch (error) {
        console.log("Unable to fetch latest plan", error)
      } finally {
        setLoadingPlan(false)
      }
    }

    loadLatestPlan()
  }, [isLoggedIn])

  const todaysPlan = latestPlan?.dailyPlans?.find(
    (dayPlan) => new Date(dayPlan.date).toDateString() === new Date().toDateString()
  )

  const totalFoods = todaysPlan
    ? todaysPlan.meals.reduce((count, meal) => count + meal.foods.length, 0)
    : 0

  const consumedFoods = todaysPlan
    ? todaysPlan.meals.reduce(
        (count, meal) => count + meal.foods.filter((food) => food.isConsumed).length,
        0
      )
    : 0

  const progress = totalFoods ? Math.round((consumedFoods / totalFoods) * 100) : 0
  const isTodayCompleted = todaysPlan?.status === "Completed"

  return (
    <div>
      <Navbar/>
      <br />
      <HeroSection/>
      {isLoggedIn && !loadingPlan && (
        <section className="mx-auto mt-8 max-w-5xl px-6">
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
              Continue Your Progress
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {todaysPlan
                ? isTodayCompleted
                  ? "Today's meal plan has been completed"
                  : "Today's meal plan is already in progress"
                : "Your saved profile can generate a fresh plan for today"}
            </h2>
            <p className="mt-3 text-gray-600">
              {todaysPlan
                ? isTodayCompleted
                  ? `You completed ${consumedFoods} of ${totalFoods} foods today. Review it anytime in the dashboard. When you return on a new day, the app can create that day's plan using your saved profile.`
                  : `You have completed ${consumedFoods} of ${totalFoods} foods today. Resume exactly where you left off.`
                : "You do not need to refill your body attributes every day. The app uses your saved profile and preferences to generate today's meal plan when needed."}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/diet-plan"
                className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                {todaysPlan
                  ? isTodayCompleted
                    ? "Open Today's Meal Plan"
                    : "Continue Today's Plan"
                  : "Open Today's Meal Plan"}
              </Link>
              <Link
                to="/dashboard"
                className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Your Dashboard
              </Link>
              <Link
                to="/advance-diet-plan"
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Seasonal Recommendations
              </Link>
            </div>
            {todaysPlan && (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                  <span>Today's completion</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      <br />
      <HowItWorks/>
      <br />
      <WhyChooseUs/>
      <br />
      <Footer/>
    </div>
  )
}

export default Home
