// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiFog } from 'react-icons/wi';
import { FaDollarSign, FaEuroSign, FaYenSign, FaLiraSign } from 'react-icons/fa';
import SimpleCalendar from '../components/SimpleCalendar'; // Import the Calendar component
import './Home.css';

const CACHE_KEY = 'latestContent';
const CACHE_DURATION = 5 * 60 * 1000;

const Home = () => {
  const [latestContent, setLatestContent] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState({ bishkek: null, osh: null });
  const [weatherError, setWeatherError] = useState({ bishkek: null, osh: null });
  const [currency, setCurrency] = useState(null);
  const [currencyError, setCurrencyError] = useState(null);
  const [newsletterMessage, setNewsletterMessage] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kgsAmount, setKgsAmount] = useState(1);

  const navigate = useNavigate();

  const getCachedContent = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      if (now - timestamp < CACHE_DURATION) {
        return data.map(item => ({
          ...item,
          date: item.date ? new Date(item.date) : null,
        }));
      }
    }
    return null;
  };

  const cacheContent = (content) => {
    const now = Date.now();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: content, timestamp: now }));
  };

  // Fetch latest content
  useEffect(() => {
    const cachedContent = getCachedContent();
    if (cachedContent) {
      console.log('Loaded from cache');
      setLatestContent(cachedContent);
      setLoading(false);
    }

    const q = query(collection(db, 'content'), orderBy('date', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const contentData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.date && typeof data.date.toDate === 'function' ? data.date.toDate() : null;
        return { id: doc.id, ...data, date };
      });
      setLatestContent(contentData);
      cacheContent(contentData);
      setError(null);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching latest content:', error);
      setError('Failed to load latest content. Please try again later.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch restaurants from Firestore
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'restaurants'));
        const restaurantData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched restaurants for Home:', restaurantData);
        setRestaurants(restaurantData);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to load restaurants. Please try again later.');
      }
    };

    fetchRestaurants();
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = 'b6eb1f57e7ceadc2dde62910bde089bc';
      const cities = ['Bishkek', 'Osh'];
      const weatherData = {};
      const weatherErrors = {};

      for (const city of cities) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},KG&appid=${apiKey}&units=metric`
          );
          const data = await response.json();

          if (data.cod === 200) {
            weatherData[city.toLowerCase()] = data;
            weatherErrors[city.toLowerCase()] = null;
          } else {
            weatherData[city.toLowerCase()] = null;
            weatherErrors[city.toLowerCase()] = data.message || 'Failed to fetch weather data';
          }
        } catch (error) {
          console.error(`Error fetching weather for ${city}:`, error);
          weatherData[city.toLowerCase()] = null;
          weatherErrors[city.toLowerCase()] = 'Network error. Please try again later.';
        }
      }

      setWeather({
        bishkek: weatherData.bishkek,
        osh: weatherData.osh,
      });
      setWeatherError({
        bishkek: weatherErrors.bishkek,
        osh: weatherErrors.osh,
      });
    };

    fetchWeather();
  }, []);

  // Fetch currency data
  useEffect(() => {
    const fetchCurrency = async () => {
      const apiKey = '1793a10ccfad65c783eae41c';
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/KGS`
        );
        const data = await response.json();

        if (data.result === 'success') {
          setCurrency(data.conversion_rates);
          setCurrencyError(null);
        } else {
          setCurrency(null);
          setCurrencyError(data.error || 'Failed to fetch currency data');
        }
      } catch (error) {
        console.error('Error fetching currency data:', error);
        setCurrency(null);
        setCurrencyError('Network error. Please try again later.');
      }
    };

    fetchCurrency();
  }, []);

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email,
        subscribedAt: new Date(),
      });
      setNewsletterMessage('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setNewsletterMessage(null), 3000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setNewsletterMessage('Failed to subscribe. Please try again.');
      setTimeout(() => setNewsletterMessage(null), 3000);
    }
  };

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const handleImageLoad = (title) => {
    console.log(`Image for "${title}" loaded`);
  };

  const getWeatherIcon = (description) => {
    if (!description) return <WiCloudy />;
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return <WiDaySunny />;
    if (desc.includes('cloud')) return <WiCloudy />;
    if (desc.includes('rain')) return <WiRain />;
    if (desc.includes('snow')) return <WiSnow />;
    if (desc.includes('fog') || desc.includes('mist')) return <WiFog />;
    return <WiCloudy />;
  };

  const getTempColor = (temp) => {
    if (temp < 0) return '#3498db';
    if (temp >= 0 && temp < 15) return '#2ecc71';
    if (temp >= 15 && temp < 25) return '#f1c40f';
    return '#e74c3c';
  };

  const handleReadMore = () => {
    navigate('/articles');
  };

  const handleKgsChange = (e) => {
    const value = e.target.value;
    if (value === '' || value < 0) {
      setKgsAmount(0);
    } else {
      setKgsAmount(parseFloat(value));
    }
  };

  // Mock category for each article
  const getCategory = (index) => {
    const categories = ['News', 'Culture', 'Travel'];
    return categories[index % categories.length];
  };

  // Handle image loading errors for restaurant cards
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200.png?text=No+Image';
  };

  return (
    <div className="home">
      <div className="layout-container">
        {/* Left Sidebar */}
        <aside className="sidebar sidebar-left">
          <div className="sidebar-content">
            {/* Weather Widget */}
            <section className="widget weather">
              <h3>Weather</h3>
              <div className="weather-item">
                <span className="weather-city">Bishkek</span>
                {weatherError.bishkek ? (
                  <p className="weather-error">{weatherError.bishkek}</p>
                ) : weather.bishkek ? (
                  <div className="weather-details">
                    {getWeatherIcon(weather.bishkek.weather[0].description)}
                    <span
                      className="weather-temp"
                      style={{ color: getTempColor(weather.bishkek.main.temp) }}
                    >
                      {weather.bishkek.main.temp}°C
                    </span>
                    <span className="weather-desc">
                      {weather.bishkek.weather[0].description}
                    </span>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="weather-item">
                <span className="weather-city">Osh</span>
                {weatherError.osh ? (
                  <p className="weather-error">{weatherError.osh}</p>
                ) : weather.osh ? (
                  <div className="weather-details">
                    {getWeatherIcon(weather.osh.weather[0].description)}
                    <span
                      className="weather-temp"
                      style={{ color: getTempColor(weather.osh.main.temp) }}
                    >
                      {weather.osh.main.temp}°C
                    </span>
                    <span className="weather-desc">
                      {weather.osh.weather[0].description}
                    </span>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </section>

            {/* Currency Converter Widget */}
            <section className="widget currency">
              <h3>Currency Converter</h3>
              {currencyError ? (
                <p className="currency-error">{currencyError}</p>
              ) : currency ? (
                <div className="currency-converter">
                  <div className="currency-input">
                    <span className="currency-label">KGS</span>
                    <input
                      type="number"
                      value={kgsAmount}
                      onChange={handleKgsChange}
                      min="0"
                      step="0.01"
                      aria-label="Enter amount in KGS"
                    />
                  </div>
                  <div className="currency-list">
                    <div className="currency-item">
                      <FaDollarSign className="currency-icon" />
                      <span className="currency-value">
                        {(kgsAmount * currency.USD).toFixed(2)} USD
                      </span>
                    </div>
                    <div className="currency-item">
                      <FaEuroSign className="currency-icon" />
                      <span className="currency-value">
                        {(kgsAmount * currency.EUR).toFixed(2)} EUR
                      </span>
                    </div>
                    <div className="currency-item">
                      <FaYenSign className="currency-icon" />
                      <span className="currency-value">
                        {(kgsAmount * currency.CNY).toFixed(2)} CNY
                      </span>
                    </div>
                    <div className="currency-item">
                      <FaLiraSign className="currency-icon" />
                      <span className="currency-value">
                        {(kgsAmount * currency.TRY).toFixed(2)} TRY
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </section>
          </div>
        </aside>

        {/* Main Content */}
        <div className="content-wrapper">
          <main className="main-content">
            {/* Hero Section */}
            {latestContent.length > 0 && (
              <section className="hero-section">
                <div className="hero-content">
                  <img
                    src={latestContent[0].imageUrl || 'https://via.placeholder.com/1200x500'}
                    alt={latestContent[0].title}
                    className="hero-image"
                  />
                  <div className="hero-overlay">
                    <span className="hero-category">{getCategory(0)}</span>
                    <h1 className="hero-title">{latestContent[0].title}</h1>
                    <p className="hero-summary">
                      {latestContent[0].summary || latestContent[0].content.substring(0, 150)}...
                    </p>
                    <button
                      className="hero-button"
                      onClick={handleReadMore}
                      aria-label={`Read more about ${latestContent[0].title}`}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Recent Articles Section */}
            <section className="recent-articles">
              <h2>Recent News</h2>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading content...</p>
                </div>
              ) : error ? (
                <p>{error}</p>
              ) : latestContent.length > 1 ? (
                <div className="article-grid">
                  {latestContent.slice(1).map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="article-card"
                      onClick={() => openModal(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && openModal(item)}
                      aria-label={`Open article: ${item.title}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="article-image"
                          loading="lazy"
                          onLoad={() => handleImageLoad(item.title)}
                        />
                      )}
                      <div className="article-content">
                        <span className="article-category">{getCategory(index + 1)}</span>
                        <h3 className="article-title">{item.title}</h3>
                        <p className="article-summary">
                          {item.summary || item.content.substring(0, 100)}...
                        </p>
                        <small className="article-date">
                          Posted on: {item.date ? item.date.toLocaleDateString() : 'Unknown Date'}
                        </small>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p>No additional content available.</p>
              )}
              <div className="see-all-articles">
                <Link to="/articles">
                  <button className="see-all-button" aria-label="See all articles">
                    See All News
                  </button>
                </Link>
              </div>
            </section>

            {/* Restaurant Listings Section */}
            <section className="restaurants-section">
              <h2>Best Places to Visit</h2>
              {error && <div className="dining-error">{error}</div>}
              <div className="restaurant-grid">
                {restaurants.length > 0 ? (
                  restaurants.slice(0, 2).map(restaurant => (
                    <motion.div
                      key={restaurant.id}
                      className="restaurant-card"
                      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && navigate(`/restaurants/${restaurant.id}`)}
                      aria-label={`Open restaurant: ${restaurant.name || 'Unnamed Restaurant'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={restaurant.image || 'https://via.placeholder.com/300x200.png?text=No+Image'}
                        alt={restaurant.name || 'Restaurant'}
                        className="restaurant-image"
                        onError={handleImageError}
                      />
                      <div className="restaurant-info">
                        <span className="restaurant-category">{restaurant.category}</span>
                        <h3 className="restaurant-name">{restaurant.name || 'Unnamed Restaurant'}</h3>
                        <p className="restaurant-description">{restaurant.description}</p>
                        <p className="restaurant-location">
                          <strong>Location:</strong> {restaurant.location}
                        </p>
                        <p className="restaurant-category-info">
                          <strong>Category:</strong> {restaurant.category}
                        </p>
                        <p className="restaurant-rating">
                          <strong>Rating:</strong> {restaurant.rating || 'N/A'} / 5
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p>No restaurants found.</p>
                )}
              </div>
              <div className="see-all-restaurants">
                <Link to="/directory/dining">
                  <button className="see-all-restaurants-button" aria-label="See all restaurants">
                    Learn More
                  </button>
                </Link>
              </div>
            </section>
          </main>
        </div>

        {/* Right Sidebar */}
        <aside className="sidebar sidebar-right">
          <div className="sidebar-content">
            {/* Advertisement Widget */}
            <section className="widget advertisement">
              <h3>Sponsored</h3>
              <div className="ad-placeholder">
                <img
                  src="https://via.placeholder.com/300x250?text=Advertisement"
                  alt="Advertisement"
                  className="ad-image"
                />
              </div>
            </section>

            {/* Newsletter Signup */}
            <section className="widget newsletter">
              <h3>Subscribe to Our Newsletter</h3>
              {newsletterMessage && <p className="newsletter-message">{newsletterMessage}</p>}
              <form onSubmit={handleNewsletterSignup}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  aria-label="Email address for newsletter subscription"
                />
                <button type="submit" aria-label="Subscribe to newsletter">
                  Subscribe
                </button>
              </form>
            </section>

            {/* Social Media Widget */}
            <section className="widget social-media">
              <h3>Social Media</h3>
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.instagram.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.youtube.com/yourchannel"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </section>

            {/* Calendar Widget */}
            <section className="widget calendar">
              <h3>Calendar</h3>
              <SimpleCalendar />
            </section>
          </div>
        </aside>
      </div>

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
              <li><Link to="/directory/dining">Restaurants</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 KyrgyStars LLC. All rights reserved.</p>
        </div>
      </footer>

      {/* Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            {selectedPost.imageUrl && ( // Changed from fullImageUrl to imageUrl to match data structure
              <div className="modal-image">
                <img src={selectedPost.imageUrl} alt={selectedPost.title} />
              </div>
            )}
            <h2>{selectedPost.title}</h2>
            <small>
              Posted on: {selectedPost.date ? selectedPost.date.toLocaleDateString() : 'Unknown Date'}
            </small>
            <p>{selectedPost.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;