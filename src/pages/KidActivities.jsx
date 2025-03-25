// src/pages/KidActivities.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './KidActivities.css';

const KidActivities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesCollection = collection(db, 'activities');
        const activitiesSnapshot = await getDocs(activitiesCollection);
        const activitiesList = activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(activitiesList);
        setFilteredActivities(activitiesList);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    let filtered = activities;
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (typeFilter) {
      filtered = filtered.filter(activity =>
        activity.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    setFilteredActivities(filtered);
  }, [searchTerm, typeFilter, activities]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
  };

  return (
    <div className="kid-activities-page">
      <div className="kid-activities">
        <h1>Kid Activities</h1>
        <div className="kid-activities-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <i className="fas fa-search"></i>
          </div>
          <div className="filter-box">
            <select value={typeFilter} onChange={handleTypeChange}>
              <option value="">Filter by type...</option>
              <option value="outdoor">Outdoor</option>
              <option value="indoor">Indoor</option>
              <option value="educational">Educational</option>
            </select>
          </div>
        </div>
        <div className="kid-activities-content">
          <div className="map-placeholder">Map Placeholder</div>
          <div className="listings">
            {filteredActivities.length > 0 ? (
              filteredActivities.map(activity => (
                <div key={activity.id} className="listing-card">
                  <h3>{activity.name}</h3>
                  <p>{activity.description}</p>
                  <p>Location: {activity.location}</p>
                  <p>Type: {activity.type}</p>
                  <Link to={`/activities/${activity.id}`} className="learn-more">
                    Learn More
                  </Link>
                </div>
              ))
            ) : (
              <p>No activities found.</p>
            )}
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Us</h4>
            <p>Learn more about KyrgyStars and our mission.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="footer-social">
              <a href="https://facebook.com"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 KyrgyStars. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default KidActivities;