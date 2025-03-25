// src/pages/Articles.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import SimpleCalendar from '../components/SimpleCalendar';
import './Articles.css';

const CACHE_KEY = 'articles';
const CACHE_DURATION = 5 * 60 * 1000;

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCachedArticles = () => {
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

  const cacheArticles = (articles) => {
    const now = Date.now();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: articles, timestamp: now }));
  };

  useEffect(() => {
    const cachedArticles = getCachedArticles();
    if (cachedArticles) {
      console.log('Loaded articles from cache');
      setArticles(cachedArticles);
      setFilteredArticles(cachedArticles);
      setLoading(false);
    }

    const q = query(collection(db, 'content'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const startTime = performance.now();
      const articleData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.date && typeof data.date.toDate === 'function' ? data.date.toDate() : null;
        return { id: doc.id, ...data, date };
      });
      const endTime = performance.now();
      console.log(`Firestore snapshot processed in ${(endTime - startTime).toFixed(2)} ms`);

      setArticles(articleData);
      setFilteredArticles(articleData);
      cacheArticles(articleData);
      setError(null);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles. Please try again later.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(term) ||
        article.content.toLowerCase().includes(term)
    );
    setFilteredArticles(filtered);
  };

  const openModal = (article) => {
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  const handleImageLoad = (title) => {
    console.log(`Image for "${title}" loaded`);
  };

  return (
    <motion.div
      className="articles"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="content-wrapper">
        <main className="main-content">
          <h1>All Articles</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Search articles by title or content"
            />
          </div>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading articles...</p>
            </div>
          ) : error ? (
            <p className="articles-error">{error}</p>
          ) : filteredArticles.length > 0 ? (
            <div className="article-grid">
              {filteredArticles.map((item, index) => (
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
                    <div className="article-image">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        onLoad={() => handleImageLoad(item.title)}
                      />
                    </div>
                  )}
                  <div className="article-content">
                    <span className="article-category">Article</span>
                    <h3 className="article-title">{item.title}</h3>
                    <p className="article-summary">
                      {item.summary || item.content.substring(0, 100)}...
                    </p>
                    <small className="article-date">
                      Posted on:{' '}
                      {item.date ? item.date.toLocaleDateString() : 'Unknown Date'}
                    </small>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p>No articles found.</p>
          )}
        </main>

        <aside className="sidebar sidebar-right">
          <div className="sidebar-content">
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

            <section className="widget calendar">
              <h3>Calendar</h3>
              <SimpleCalendar />
            </section>
          </div>
        </aside>
      </div>

      {selectedArticle && (
        <div className="modal-overlay" onClick={closeModal}>
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            {selectedArticle.imageUrl && (
              <div className="modal-image">
                <img src={selectedArticle.imageUrl} alt={selectedArticle.title} />
              </div>
            )}
            <h2>{selectedArticle.title}</h2>
            <small>
              Posted on:{' '}
              {selectedArticle.date ? selectedArticle.date.toLocaleDateString() : 'Unknown Date'}
            </small>
            <p>{selectedArticle.content}</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Articles;