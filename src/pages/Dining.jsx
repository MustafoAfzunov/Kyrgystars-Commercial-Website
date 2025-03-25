// src/pages/Dining.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Dining.css';

// Helper function to validate URL
const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const Dining = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [error, setError] = useState(null);

  // Fetch restaurants from Firestore
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'restaurants'));
        const restaurantData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched restaurants:', restaurantData);
        setRestaurants(restaurantData);
        setFilteredRestaurants(restaurantData);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to load restaurants. Please try again later.');
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on search term and category
  useEffect(() => {
    let filtered = restaurants;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(restaurant => restaurant.category === categoryFilter);
    }

    setFilteredRestaurants(filtered);
  }, [searchTerm, categoryFilter, restaurants]);

  // Get unique categories for the filter dropdown
  const categories = ['All', ...new Set(restaurants.map(restaurant => restaurant.category))];

  // Handle image load error
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200.png?text=No+Image';
  };

  return (
    <div className="dining-page">
      <h1 className="dining-title">Dining in Kyrgyzstan</h1>
      <div className="dining-controls">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="dining-search"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="dining-filter"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="dining-error">{error}</div>}
      <div className="dining-list">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(restaurant => {
            console.log(`Restaurant: ${restaurant.name}, Image: ${restaurant.image}`);
            return (
              <div key={restaurant.id} className="restaurant-card">
                <img
                  src={
                    restaurant.image && isValidUrl(restaurant.image)
                      ? restaurant.image
                      : 'https://via.placeholder.com/300x200.png?text=No+Image'
                  }
                  alt={restaurant.name || 'Restaurant'}
                  className="restaurant-image"
                  onError={handleImageError}
                />
                <div className="restaurant-info">
                  <h3 className="restaurant-name">{restaurant.name || 'Unnamed Restaurant'}</h3>
                  <p className="restaurant-description">{restaurant.description}</p>
                  <p className="restaurant-location">
                    <strong>Location:</strong> {restaurant.location}
                  </p>
                  <p className="restaurant-category">
                    <strong>Category:</strong> {restaurant.category}
                  </p>
                  <p className="restaurant-rating">
                    <strong>Rating:</strong> {restaurant.rating || 'N/A'} / 5
                  </p>
                  <Link to={`/restaurants/${restaurant.id}`} className="restaurant-link">
                    Learn More
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
      <div className="dining-map">
        <h2>Map of Restaurants</h2>
        <div className="map-placeholder">
          <p>Map will be integrated here to show restaurant locations.</p>
        </div>
      </div>
    </div>
  );
};

export default Dining;