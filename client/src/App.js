import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShelterRegisterPage from './pages/ShelterRegisterPage';
import ShelterLoginPage from './pages/ShelterLoginPage';
import ShelterDashboard from './pages/ShelterDashboard';
import ShelterPrivateRoute from './components/ShelterPrivateRoute';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AddPetPage from './pages/AddPetPage';
import EditPetPage from './pages/EditPetPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* This is the correct syntax for v6 */}
           <Route path="/" element={<LandingPage />} /> 
          <Route path="/pets" element={<HomePage />} />

          {/* User Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
         
          {/* Shelters Routes */}
          <Route path="/shelter/register" element={<ShelterRegisterPage />} />
          <Route path="/shelter/login" element={<ShelterLoginPage />} />
          <Route 
            path="/shelter/dashboard" 
            element={
              <ShelterPrivateRoute>
                <ShelterDashboard />
              </ShelterPrivateRoute>
            } />
             <Route 
            path="/shelter/add-pet" 
            element={ <ShelterPrivateRoute><AddPetPage /></ShelterPrivateRoute> } 
          />
          {/* You can add routes for other pages here later */}
          {/* <Route path="/about" element={<AboutPage />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;