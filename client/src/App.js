import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShelterRegisterPage from './pages/ShelterRegisterPage';
import ShelterLoginPage from './pages/ShelterLoginPage';
import ShelterDashboard from './pages/ShelterDashboard';
import ShelterPrivateRoute from './components/ShelterPrivateRoute';
import LandingPage from './pages/LandingPage';
import AddPetPage from './pages/AddPetPage';
import EditPetPage from './pages/EditPetPage';

// Import the components that will be nested in the dashboard
import ShelterPetList from './components/ShelterPetList'; 
import ShelterInbox from './pages/ShelterInbox'; // Make sure you've created this file
import ShelterProfile from './components/ShelterProfile';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* A global Navbar could go here if you want it on every page */}
        {/* <Navbar /> */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/pets" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shelter/register" element={<ShelterRegisterPage />} />
          <Route path="/shelter/login" element={<ShelterLoginPage />} />
          
          {/* --- Shelter Private Routes --- */}

          {/* 1. This is the new, nested dashboard route structure */}
          <Route 
            path="/shelter/dashboard" 
            element={
              <ShelterPrivateRoute>
                <ShelterDashboard />
              </ShelterPrivateRoute>
            }
          >
            {/* The index route is the default component shown for "/shelter/dashboard" */}
            <Route index element={<ShelterPetList />} />
            <Route path="inbox" element={<ShelterInbox />} />
            <Route path="profile" element={<ShelterProfile />} />
          </Route>

          {/* 2. These are other protected routes that don't need the dashboard sidebar */}
          <Route 
            path="/shelter/add-pet" 
            element={ <ShelterPrivateRoute><AddPetPage /></ShelterPrivateRoute> } 
          />
          <Route 
            path="/shelter/edit-pet/:petId" 
            element={ <ShelterPrivateRoute><EditPetPage /></ShelterPrivateRoute> } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

