import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/klassy-logo.png";
import profileIcon from "../assets/images/profile.png";
import cartIcon from "../assets/images/cart.png";
import discountIcon from "../assets/images/discount.png";
import helpIcon from "../assets/images/help.png";
import { CartContext } from "./CartContext";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useContext } from "react";

const CustomerNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.length;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCustomer(token);
    }
  }, []);

  const fetchCustomer = (token) => {
    fetch("http://localhost:8082/customer/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setCustomer(data))
      .catch((err) => console.error("Customer fetch error:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -1 }}
        style={{
          position: "fixed",
          top: "10px",
          left: "2%",
          transform: "translateX(-50%)",
          width: "96%",
          maxWidth: "1230px",
          background: "rgba(255, 255, 255, 0.85)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          borderRadius: "18px",
          padding: "8px 26px",
          zIndex: 1000,
          backdropFilter: "blur(39px)",
          border: "1px solid rgba(255,255,255,0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Gilbert, sans-serif",
        }}
      >
        {/* Left: Logo + My Account */}
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <Link to="/">
            <img src={logo} alt="Logo" style={{ height: "42px" }} />
          </Link>

          <Link
            to="/customer/profile"
            className="text-black text-decoration-none nav-link-hover"
            style={{ fontWeight: 600, fontSize: "1rem" }}
          >
            My Account
          </Link>

          {/* Hamburger */}
          <button
            className={`d-md-none bg-transparent border-0 hamburger-btn ${
              isMobileMenuOpen ? "open" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="bi bi-list" style={{ fontSize: "1.8rem" }} />
          </button>
        </div>

        {/* Right: Offers, Help, Cart, Profile */}
        <div className="d-flex align-items-center gap-4" style={{ fontFamily: "Gilbert, sans-serif" }}>
          <Link
            to="/offers"
            title="Offers"
            className="d-flex align-items-center text-decoration-none text-black nav-link-hover"
            style={{ gap: "6px", fontWeight: 600, fontSize: "1rem" }}
          >
            <img src={discountIcon} alt="Offers" style={{ width: "20px", height: "20px" }} />
            <span>Offers</span>
          </Link>

          <Link
            to="/help"
            title="Help"
            className="d-flex align-items-center text-decoration-none text-black nav-link-hover"
            style={{ gap: "6px", fontWeight: 600, fontSize: "1rem" }}
          >
            <img src={helpIcon} alt="Help" style={{ width: "20px", height: "20px" }} />
            <span>Help</span>
          </Link>

          <Link
            to="/customer/cart"
            className="position-relative d-flex align-items-center text-decoration-none text-black nav-link-hover"
            title="Cart"
            style={{ gap: "6px", fontWeight: 600, fontSize: "1rem" }}
          >
            <img src={cartIcon} alt="Cart" style={{ width: "20px", height: "20px" }} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-10px",
                  backgroundColor: "red",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: "12px",
                  padding: "2px 6px",
                  fontWeight: "bold",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <img
            src={profileIcon}
            alt="Profile"
            onClick={() => setSidebarOpen(true)}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
            }}
          />
        </div>
      </motion.nav>

      {isMobileMenuOpen && (
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="nav flex-column d-md-none text-center"
          style={{
            position: "fixed",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: "12px",
            padding: "12px 0",
            width: "90%",
            maxWidth: "320px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            zIndex: 999,
          }}
        >
          {/* Mobile menu items can be added here */}
        </motion.ul>
      )}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        customer={customer}
        onLogout={handleLogout}
      />
    </>
  );
};

export default CustomerNavbar;
