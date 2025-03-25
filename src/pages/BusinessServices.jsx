// src/pages/BusinessServices.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CategoryPage.css'; // Reintroduced the import

const BusinessServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const businessServicesListings = [
    { id: 1, name: 'Bishkek IT Solutions', location: 'Bishkek', service: 'IT Support', description: 'Comprehensive IT support for businesses.' },
    { id: 2, name: 'Legal Advisors KG', location: 'Osh', service: 'Legal Consulting', description: 'Expert legal advice for startups.' },
    { id: 3, name: 'Marketing Pros', location: 'Bishkek', service: 'Marketing', description: 'Digital marketing services.' },
  ];

  const filteredListings = businessServicesListings
    .filter((item) => filter === 'all' || item.service === filter)
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="category-page">
      <motion.div
        className="category"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Business Services</h1>
        <div className="category-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search business services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search business services"
            />
            <i className="fas fa-search"></i>
          </div>
          <div className="filter-box">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter business services"
            >
              <option value="all">All Services</option>
              <option value="IT Support">IT Support</option>
              <option value="Legal Consulting">Legal Consulting</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>
        <div className="category-content">
          <div className="map-placeholder">
            <p>Map Placeholder (Integrate Google Maps or Leaflet here)</p>
          </div>
          <div className="listings">
            {filteredListings.length > 0 ? (
              filteredListings.map((item) => (
                <motion.div
                  key={item.id}
                  className="listing-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>{item.name}</h3>
                  <p>Location: {item.location}</p>
                  <p>Service: {item.service}</p>
                  <p>{item.description}</p>
                </motion.div>
              ))
            ) : (
              <p>No business services found.</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>KyrgyStars LLC</h4>
            <p>Your source for city news, events, and dining.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/articles">Articles</Link></li>
              <li><Link to="/business-solutions">Business Solutions</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 KyrgyStars LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessServices;