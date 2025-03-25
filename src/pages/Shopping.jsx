// src/pages/Shopping.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Shopping.css';

const Shopping = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shopsCollection = collection(db, 'shops');
        const shopsSnapshot = await getDocs(shopsCollection);
        const shopsList = shopsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShops(shopsList);
        setFilteredShops(shopsList);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    let filtered = shops;
    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter(shop =>
        shop.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    setFilteredShops(filtered);
  }, [searchTerm, categoryFilter, shops]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  return (
    <div className="shopping-page">
      <div className="shopping">
        <h1>Shopping</h1>
        <div className="shopping-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search shops..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <i className="fas fa-search"></i>
          </div>
          <div className="filter-box">
            <select value={categoryFilter} onChange={handleCategoryChange}>
              <option value="">Filter by category...</option>
              <option value="clothing">Clothing</option>
              <option value="electronics">Electronics</option>
              <option value="souvenirs">Souvenirs</option>
            </select>
          </div>
        </div>
        <div className="shopping-content">
          <div className="map-placeholder">Map Placeholder</div>
          <div className="listings">
            {filteredShops.length > 0 ? (
              filteredShops.map(shop => (
                <div key={shop.id} className="listing-card">
                  <h3>{shop.name}</h3>
                  <p>{shop.description}</p>
                  <p>Location: {shop.location}</p>
                  <p>Category: {shop.category}</p>
                  <Link to={`/shops/${shop.id}`} className="learn-more">
                    Learn More
                  </Link>
                </div>
              ))
            ) : (
              <p>No shops found.</p>
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

export default Shopping;