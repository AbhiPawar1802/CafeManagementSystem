// src/components/AdminNavigation.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const AdminNavigation = () => {
  const linkStyle = ({ isActive }) => ({
    padding: "12px 16px",
    textDecoration: "none",
    color: isActive ? "#fff" : "#ccc",
    backgroundColor: isActive ? "#0d6efd" : "transparent",
    borderRadius: "8px",
    display: "block",
    marginBottom: "8px",
  });

  return (
    <div style={{ padding: "20px" }}>
      <NavLink to="products" style={linkStyle}>Manage Products</NavLink>
      <NavLink to="chefs" style={linkStyle}>Manage Chefs</NavLink>
      <NavLink to="orders" style={linkStyle}>Order Management</NavLink>
      <NavLink to="offers" style={linkStyle}>Offers</NavLink>
      <NavLink to="reservations" style={linkStyle}>Reservations</NavLink>
    </div>
  );
};

export default AdminNavigation;
