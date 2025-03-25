// src/components/HomeNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Navbar.css';
import newLogo from '../assets/photo_2025-03-24_19-20-40.jpg';

const HomeNavbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const navigate = useNavigate();

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set the current date
  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  // Toggle dropdown on mobile
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clicking a search result
  const handleResultClick = (result) => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchError(null);
    switch (result.type) {
      case 'restaurants':
        navigate(`/restaurants/${result.id}`);
        break;
      case 'shops':
        navigate(`/shops/${result.id}`);
        break;
      case 'resources':
        navigate(`/resources/${result.id}`);
        break;
      case 'activities':
        navigate(`/activities/${result.id}`);
        break;
      default:
        break;
    }
  };

  // Fetch search results from Firestore
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setSearchError(null);
        return;
      }

      try {
        const collections = ['restaurants', 'shops', 'resources', 'activities'];
        const allResults = [];

        for (const coll of collections) {
          const querySnapshot = await getDocs(collection(db, coll));
          const items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            type: coll,
          }));
          allResults.push(...items);
        }

        const filteredResults = allResults.filter(item => {
          const nameMatch = item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase());
          const descMatch = item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase());
          return nameMatch || descMatch;
        });

        setSearchResults(filteredResults);
        setSearchError(null);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
        setSearchError('Failed to fetch search results. Please try again later.');
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <nav className="navbar">
      {/* Date Display */}
      

      <div className="navbar-content">
        {/* Title with Logo at the Beginning */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={newLogo} alt="KyrgyStars Logo" className="logo-image" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-menu">
  <Link to="/" className="navbar-link">Home</Link>
  <Link to="/articles" className="navbar-link">Articles</Link>
  <Link to="/investments" className="navbar-link">Investments</Link>
  <Link to="/business-solutions" className="navbar-link">Business Solutions</Link> {/* Ensure this uses "navbar-link" */}
  <div className={`navbar-dropdown ${isDropdownOpen ? 'active' : ''}`}>
    <span className="navbar-link navbar-dropdown-toggle" onClick={toggleDropdown}>
      Directory
    </span>
    <div className="navbar-dropdown-menu">
      <Link to="/directory/dining" className="navbar-dropdown-item" onClick={toggleDropdown}>
        Dining
      </Link>
      <Link to="/directory/shopping" className="navbar-dropdown-item" onClick={toggleDropdown}>
        Shopping
      </Link>
      <Link to="/directory/useful" className="navbar-dropdown-item" onClick={toggleDropdown}>
        Useful
      </Link>
      <Link to="/directory/kid-activities" className="navbar-dropdown-item" onClick={toggleDropdown}>
        Kid Activities
      </Link>
    </div>
  </div>
  <Link to="/advertising" className="navbar-link">Advertising</Link>
  <Link to="/stories" className="navbar-link">Stories</Link>
  <Link to="/contact" className="navbar-link">Contact Us</Link>
</div>

        {/* Search and Social Icons */}
        <div className="navbar-center">
          <div className="navbar-search">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <i className="fas fa-search"></i>
            </div>
            {searchError && (
              <div className="search-error">
                {searchError}
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(result => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="search-result-item"
                    onClick={() => handleResultClick(result)}
                  >
                    <span className="result-name">{result.name}</span>
                    <span className="result-type">
                      {result.type.charAt(0).toUpperCase() + result.type.slice(1, -1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="navbar-social">
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
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;