import React from "react";
import "./Sidebar.css";
import profileIcon from '../assets/images/profile.png';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose, customer, onLogout }) => {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <div className="sidebar-blur-overlay show" onClick={onClose}></div>
      )}

      <div className={`customer-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center p-3">
          <div 
            className="d-flex align-items-center flex-grow-1" 
            style={{ minWidth: 0 }}
          >
            <img
              src={profileIcon}
              alt="Profile"
              className="rounded-circle border border-2"
              style={{ width: 50, height: 50, objectFit: "cover", flexShrink: 0 }}
            />
            <div className="ms-3" style={{ minWidth: 0 }}>
              <h6 className="mb-1 text-muted" style={{ fontSize: "14px" }}>
                Welcome,
              </h6>
              <h5 
                className="customer-name fw-bold" 
                style={{ fontSize: "18px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#000000' }}
                title={customer?.name || "Guest"}
              >
                {customer?.name || "Guest"}
              </h5>
            </div>
          </div>

          <button
            className="btn btn-link p-0 text-dark ms-3"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ fontSize: "1.5rem", lineHeight: 1 }}
          >
            &times;
          </button>
        </div>

        {customer && (
          <button
            className="btn btn-outline-primary w-100 mt-3"
            onClick={() => {
              navigate("/customer/profile");
              onClose();
            }}
          >
            View Profile
          </button>
        )}

        {/* Menu Items */}
        <ul className="sidebar-links mt-3 px-3">
          <li onClick={() => { navigate("/customer/dashboard"); onClose(); }}>Dashboard</li>
          <li onClick={() => { navigate("/customer/offers"); onClose(); }}>Deals & Offers</li>
          <li onClick={() => { navigate("/customer/trackorder"); onClose(); }}>Track Order</li>
          <li onClick={() => { navigate("/customer/history"); onClose(); }}>Order History</li>
          <li onClick={() => { navigate("/customer/feedback"); onClose(); }}>Feedback</li>
          <li onClick={() => { navigate("/customer/terms"); onClose(); }}>Terms & Conditions</li>
          <li onClick={() => { navigate("/customer/favorite"); onClose(); }}>Favorites</li>
        </ul>

        {/* Login/Logout */}
        <div className="text-center mt-3 px-3">
          {!customer ? (
            <button 
              className="btn btn-danger w-100" 
              onClick={() => {
                navigate("/login");
                onClose();
              }}
            >
              Login
            </button>
          ) : (
            <button className="btn btn-danger w-100" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>

        <div className="text-center mt-auto p-2 small text-muted">v0.0.1</div>
      </div>
    </>
  );
};

export default Sidebar;
