import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../assets/images/top-left-bg.jpg';
import logo from '../assets/images/klassy-logo.png';
import profileIcon from '../assets/images/profile.png';
import cartIcon from '../assets/images/cart.png';
import Sidebar from './Sidebar';
import axios from 'axios';
import { CartContext } from '../components/CartContext';
import { motion } from 'framer-motion';
import './HeroSection.css';

const HeroSection = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.length;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get('http://localhost:8082/customer/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCustomer(res.data))
        .catch((err) => console.error("profile fetch error:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleReservationClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const reservationElement = document.getElementById("reservation");
      if (reservationElement) {
        reservationElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <section
      className="hero-section"
      id="top"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
      }}
    >
      <div className="blur-overlay" />

      {/* FLOATING NAVBAR */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -1 }}
        style={{
          position: 'fixed',
          top: '10px',
          left: '2%',
          transform: 'translateX(-50%)',
          width: '96%',
          maxWidth: '1230px',
          background: 'rgba(255, 255, 255, 0.85)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          borderRadius: '18px',
          padding: '8px 26px',
          zIndex: 1000,
          backdropFilter: 'blur(39px)',
          border: '1px solid rgba(255,255,255,0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'Lobster, cursive',
        }}
      >
        {/* Left: Logo + Nav */}
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <Link to="/">
            <img src={logo} alt="Logo" style={{ height: '42px' }} />
          </Link>

          <ul className="nav d-none d-md-flex gap-4 mb-0" style={{ fontWeight: 600 }}>
            {['Our Story', 'Menu', 'Chefs', 'Reservation'].map((item, index) => (
              <li key={index}>
                <a
                  href={`#${item.toLowerCase().replace(/\s/g, '')}`}
                  className="text-black text-decoration-none nav-link-hover"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            className={`d-md-none bg-transparent border-0 hamburger-btn ${
              isMobileMenuOpen ? 'open' : ''
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="bi bi-list" style={{ fontSize: '1.8rem' }} />
          </button>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div
            className="d-none d-md-flex align-items-center me-3"
            style={{
              background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
              padding: '6px 16px',
              borderRadius: '9999px',
              boxShadow: 'inset 0 0 8px rgba(255,255,255,0.3), 0 2px 6px rgba(38,50,56,0.15)',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem',
              letterSpacing: '0.03em',
              userSelect: 'none',
              cursor: 'default',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              whiteSpace: 'nowrap',
            }}
            aria-label={`Greeting message. Hello, ${customer?.name || 'Guest'}`}
            title={`Hello, ${customer?.name || 'Guest'}`}
          >
            <span
              role="img"
              aria-hidden="true"
              style={{ marginRight: '8px', fontSize: '1.2rem', lineHeight: 1 }}
            >
              👋
            </span>
            Hello, {customer?.name || 'Guest'}
          </div>

          {/* Cart Icon */}
          <Link to="/customer/cart" className="position-relative">
            <img src={cartIcon} alt="Cart" style={{ width: '28px', height: '28px' }} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-10px',
                  backgroundColor: 'red',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '12px',
                  padding: '2px 6px',
                  fontWeight: 'bold',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile Icon */}
          <img
            src={profileIcon}
            alt="Profile"
            onClick={() => setSidebarOpen(true)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              objectFit: 'cover',
              cursor: 'pointer',
            }}
          />
        </div>
      </motion.nav>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="nav flex-column d-md-none text-center"
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: '12px',
            padding: '12px 0',
            width: '90%',
            maxWidth: '320px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            zIndex: 999,
          }}
        >
          {['Our Story', 'Menu', 'Chefs', 'Reservation'].map((item, index) => (
            <li key={index}>
              <a
                href={`#${item.toLowerCase().replace(/\s/g, '')}`}
                className="text-black text-decoration-none py-2 d-block"
              >
                {item}
              </a>
            </li>
          ))}
        </motion.ul>
      )}

      {/* HERO TEXT */}
      <div
        className="container content-wrapper"
        style={{
          marginTop: '110px',
          textAlign: 'center',
          maxWidth: '900px',
          zIndex: 1,
          position: 'relative',
        }}
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="caption text-white">
              <h6 style={{ fontWeight: 600, letterSpacing: '2px' }}>Coffee Point</h6>
              <h2 style={{ fontWeight: 700, fontSize: '3rem' }}>Welcome to Coffee Point</h2>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.85)' }}>
                👋 Hey there, food lover! Whether you're craving cozy coffee, a fresh bite, or something sweet—
                we’ve got you covered. <br />
                Dive into our menu and make yourself at home. Your next favorite dish is just a few clicks away! 🍽️☕
              </p>
              <div className="main-button-white mt-4">
                <button
                  className="btn btn-outline-light"
                  onClick={handleReservationClick}
                  style={{ fontSize: '1.1rem', padding: '10px 30px', borderRadius: '30px' }}
                >
                  Make A Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        customer={customer}
        onLogout={handleLogout}
      />
    </section>
  );
};

export default HeroSection;
