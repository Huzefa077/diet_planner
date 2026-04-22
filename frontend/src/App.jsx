import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom' 
import Register from "./Components/auth/Register"
import Home from './Components/Home/Home'
import Login from './Components/auth/Login'
import Dashboard from './Components/Dashboard'
import { LayoutDashboard } from 'lucide-react'
import DietPlan from './Components/DietPlan'
import { UserPreferencesForm } from './Components/UserPreferencesForm'
import { AdvancedPreferencesForm } from './Components/AdvancePreferenceForm'
import SeasonalDietPlan from './Components/SeasonalDietPlan'
import About from './Components/About'

function App() {
 

  return (
    <>
      <Routes>
      <Route path ="/login" element={<Login/>}/>
      <Route path ="/register" element={<Register/>}/>
      <Route path ="/" element={<Home/>}/>
      <Route path ="/dashboard" element={<Dashboard/>}/>
      <Route path ="/about" element={<About/>}/>
      <Route path ="/diet-plan" element={<DietPlan/>}/>
      <Route path ="/user-preference" element={<UserPreferencesForm/>}/>
      <Route path ="/advance-user-preference" element={<AdvancedPreferencesForm/>}/>
      <Route path ="/advance-diet-plan" element={<SeasonalDietPlan/>}/>
      
      </Routes>
      
    </>
  )
}

export default App
