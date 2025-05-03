import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./footer.css";

// Footer
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-column logo-column">
            <div className="footer-logo">
              <img 
                src='/icons/logo.png'
                alt="FoodDelivery" 
                style={{ width: "150px", height: "auto" }}
              />
            </div>
            <p className="footer-description">
              Delicious food delivered to your doorstep. Order online from your favorite local restaurants.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/" aria-label="Facebook">
                <FaFacebook className="social-icon" />
              </a>
              <a href="https://x.com/" aria-label="X">
                <FaTwitter className="social-icon" />
              </a>
              <a href="https://www.instagram.com/" aria-label="Instagram">
                <FaInstagram className="social-icon" />
              </a>
              <a href="https://www.youtube.com/" aria-label="Youtube">
                <FaYoutube className="social-icon" />
              </a>
            </div>
          </div>

          <div className="footer-column links-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links-list">
              <li><a href="/">Home</a></li>
              <li><a href="/menu">Menu</a></li>
              <li><a href="/news">News</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column contact-column">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>support@fooddelivery.com</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Delivery St, Food City, FC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} FoodDelivery. All rights reserved.</p>
          <div className="legal-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;