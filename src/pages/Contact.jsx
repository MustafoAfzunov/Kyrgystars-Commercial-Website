// src/pages/Contact.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import HomeNavbar from '../components/HomeNavbar';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    enquiryType: '',
    message: '',
  });
  const [formMessage, setFormMessage] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const enquiryOptions = [
    'Investment',
    'Business Solutions',
    'Advertising',
    'Story Submissions',
    'Job Opportunities',
    'Feedback',
    'Suggestions',
    'Problem Reporting',
    'Others',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Name is required.';
    }
    if (!formData.phone.trim()) {
      return 'Phone number is required.';
    }
    // Basic phone number validation (e.g., at least 10 digits)
    const phoneRegex = /^\+?\d{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      return 'Please enter a valid phone number (at least 10 digits).';
    }
    if (!formData.email.trim()) {
      return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    if (!formData.enquiryType) {
      return 'Please select a type of inquiry.';
    }
    if (!formData.message.trim()) {
      return 'Message is required.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      setFormMessage(null);
      setTimeout(() => setFormError(null), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        submittedAt: new Date(),
      });
      setFormMessage('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        enquiryType: '',
        message: '',
      });
      setFormError(null);
      setTimeout(() => setFormMessage(null), 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormError('Failed to send your message. Please try again.');
      setFormMessage(null);
      setTimeout(() => setFormError(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Add HomeNavbar */}
      <HomeNavbar />

      <motion.div
        className="contact"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Contact Us</h1>
        <motion.div
          className="contact-form"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {formMessage && <p className="form-message">{formMessage}</p>}
          {formError && <p className="form-error">{formError}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-label="Your name"
              />
              <label htmlFor="name">Name</label>
            </div>
            <div className="form-group">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                aria-label="Your phone number"
              />
              <label htmlFor="phone">Phone Number</label>
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-label="Your email address"
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-group">
              <select
                id="enquiryType"
                name="enquiryType"
                value={formData.enquiryType}
                onChange={handleChange}
                required
                aria-label="Type of inquiry"
              >
                <option value="" disabled>Type of inquiry</option>
                {enquiryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <label htmlFor="enquiryType">Type of Inquiry</label>
            </div>
            <div className="form-group">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                aria-label="Your message"
              ></textarea>
              <label htmlFor="message">Message</label>
            </div>
            <button type="submit" aria-label="Send message" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>
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
              <li><a href="/">Home</a></li>
              <li><a href="/articles">Articles</a></li>
              <li><a href="/directory/dining">Dining</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="footer-social">
              <a
                href="https://www.facebook.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
              >
                <i className="fab fa-facebook-f"></i>
                <span className="fallback-text">FB</span>
              </a>
              <a
                href="https://www.instagram.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
              >
                <i className="fab fa-instagram"></i>
                <span className="fallback-text">IG</span>
              </a>
              <a
                href="https://www.youtube.com/yourchannel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
              >
                <i className="fab fa-youtube"></i>
                <span className="fallback-text">YT</span>
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

export default Contact;