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
import ShelterPetList from './components/ShelterPetList';
import DonationsPage from './pages/DonationsPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ShelterProfilePage from './pages/ShelterProfilePage';

import ShelterInbox from './pages/ShelterInbox';
import ShelterProfile from './components/ShelterProfile';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/pets" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shelter/register" element={<ShelterRegisterPage />} />
          <Route path="/shelter/login" element={<ShelterLoginPage />} />
          <Route path="/shelters/:id" element={<ShelterProfilePage />} />
          {/* These two routes have been moved below */}
          {/* <Route path="/shelter/donations" ... /> */}
          {/* <Route path="/shelter/activities" ... /> */}
          
          {/* --- Shelter Private Routes --- */}

          <Route 
            path="/shelter/dashboard" 
            element={
              <ShelterPrivateRoute>
                <ShelterDashboard />
              </ShelterPrivateRoute>
            }
          >
            {/* The index route (defaults to /shelter/dashboard) */}
            <Route index element={<ShelterPetList />} />
            
            {/* All pages that should appear INSIDE the dashboard go here */}
            <Route path="inbox" element={<ShelterInbox />} />
            <Route path="profile" element={<ShelterProfile />} />
            <Route path="donations" element={<DonationsPage />} />   {/* <-- MOVED HERE */}
            <Route path="activities" element={<ActivitiesPage />} /> {/* <-- MOVED HERE */}
          </Route>

          {/* Other protected routes that DON'T need the dashboard sidebar */}
          <Route 
            path="/shelter/add-pet" 
            element={ <ShelterPrivateRoute><AddPetPage /></ShelterPrivateRoute> } 
          />
          <Route 
            path="/shelter/edit-pet/:id"
            element={ <ShelterPrivateRoute><EditPetPage /></ShelterPrivateRoute> } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;