// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeNavbar from './components/HomeNavbar'; // Should resolve to HomeNavbar.jsx
import Home from './pages/Home';
import Articles from './pages/Articles';
import Investments from './pages/Investment';
import BusinessSolutions from './pages/BusinessSolutions';
import Dining from './pages/Dining';
import Shopping from './pages/Shopping';
import Useful from './pages/Useful';
import KidActivities from './pages/KidActivities';
import Advertising from './pages/Advertising';
import Stories from './pages/Stories';
import Contact from './pages/Contact';
import './App.css';

const App = () => {
  return (
    <Router>
      <HomeNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/business-solutions" element={<BusinessSolutions />} />
        <Route path="/directory" element={<Navigate to="/directory/dining" />} />
        <Route path="/directory/dining" element={<Dining />} />
        <Route path="/directory/shopping" element={<Shopping />} />
        <Route path="/directory/useful" element={<Useful />} />
        <Route path="/directory/kid-activities" element={<KidActivities />} />
        <Route path="/advertising" element={<Advertising />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default App;