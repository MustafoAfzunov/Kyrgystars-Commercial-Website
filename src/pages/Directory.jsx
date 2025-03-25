// src/pages/Directory.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const Directory = () => {
  return <Outlet />; // Render child routes (Dining, Shopping, etc.)
};

export default Directory;