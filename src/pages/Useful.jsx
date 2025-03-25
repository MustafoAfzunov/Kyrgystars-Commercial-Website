// src/pages/Useful.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Useful.css';

const Useful = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesCollection = collection(db, 'resources');
        const resourcesSnapshot = await getDocs(resourcesCollection);
        const resourcesList = resourcesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResources(resourcesList);
        setFilteredResources(resourcesList);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = resources;
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (typeFilter) {
      filtered = filtered.filter(resource =>
        resource.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    setFilteredResources(filtered);
  }, [searchTerm, typeFilter, resources]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
  };

  return (
    <div className="useful-page">
      <div className="useful">
        <h1>Useful</h1>
        <div className="useful-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <i className="fas fa-search"></i>
          </div>
          <div className="filter-box">
            <select value={typeFilter} onChange={handleTypeChange}>
              <option value="">Filter by type...</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="services">Services</option>
            </select>
          </div>
        </div>
        <div className="useful-content">
          <div className="map-placeholder">Map Placeholder</div>
          <div className="listings">
            {filteredResources.length > 0 ? (
              filteredResources.map(resource => (
                <div key={resource.id} className="listing-card">
                  <h3>{resource.name}</h3>
                  <p>{resource.description}</p>
                  <p>Location: {resource.location}</p>
                  <p>Type: {resource.type}</p>
                  <Link to={`/resources/${resource.id}`} className="learn-more">
                    Learn More
                  </Link>
                </div>
              ))
            ) : (
              <p>No resources found.</p>
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

export default Useful;