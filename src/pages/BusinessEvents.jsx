// src/pages/BusinessEvents.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CategoryPage.css'; // Reintroduced the import

const BusinessEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const businessEventsListings = [
    { id: 1, name: 'Tech Summit 2025', location: 'Bishkek', type: 'Conference', description: 'Annual tech conference.' },
    { id: 2, name: 'Startup Pitch Night', location: 'Osh', type: 'Networking', description: 'Networking event for startups.' },
    { id: 3, name: 'Business Expo', location: 'Bishkek', type: 'Expo', description: 'Business exhibition.' },
  ];

  const filteredListings = businessEventsListings
    .filter((item) => filter === 'all' || item.type === filter)
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
        <h1>Business Events</h1>
        <div className="category-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search business events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search business events"
            />
            <i className="fas fa-search"></i>
          </div>
          <div className="filter-box">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter business events"
            >
              <option value="all">All Types</option>
              <option value="Conference">Conference</option>
              <option value="Networking">Networking</option>
              <option value="Expo">Expo</option>
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
                  <p>Type: {item.type}</p>
                  <p>{item.description}</p>
                </motion.div>
              ))
            ) : (
              <p>No business events found.</p>
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

export default BusinessEvents;