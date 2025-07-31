import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/klassy-logo.png";
import profile from "../assets/images/profile.png";
import "./AdminHeader.css";

const BASE_URL = "http://localhost:8082";

const AdminHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("User not authenticated. Please log in.");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${BASE_URL}/user/getAdminDetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const activeAdmin = response.data.find((admin) => admin.status === "true");

        if (activeAdmin) {
          setAdminName(activeAdmin.name);
        } else {
          toast.error("Active admin not found.");
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
        toast.error("Failed to load admin details. Please try again later.");
      }
    };
    fetchAdminDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <header
        className="admin-navbar"
        style={{
          position: "fixed",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "96.5%",
          zIndex: 999,
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "15px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          padding: "10px 24px",
          backdropFilter: "blur(10px)",
          marginBottom: "70px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <img src={logo} alt="Admin Dashboard" style={{ height: "40px" }} />
          <div className="d-flex align-items-center">
            {adminName && (
              <span className="welcome-text me-3">Welcome, {adminName}</span>
            )}
            <div className="me-3">
              <img
                src={profile}
                alt="Profile"
                onClick={() => setSidebarOpen(true)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "2px solid #ccc",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="sidebar-blur-overlay show"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header d-flex align-items-start">
          <img
            src={profile}
            alt="Profile"
            className="profile-icon sidebar-profile-icon"
          />
          <div className="welcome-message">
            <h6 className="mb-1 text-muted">Welcome,</h6>
            <h5 className="admin-name">{adminName}</h5>
          </div>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            X
          </button>
        </div>

        <ul className="sidebar-links">
          <li onClick={() => navigate("/admin/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/admin/customer")}>Manage Customer</li>
          <li onClick={() => navigate("/admin/manageadmin")}>Manage Admin</li>
          <li onClick={() => navigate("/admin/product")}>Manage Products</li>
          <li onClick={() => navigate("/admin/chef")}>Manage Chefs</li>
          <li onClick={() => navigate("/admin/order")}>Manage Order</li>
          <li onClick={() => navigate("/admin/reservation")}>Manage Reservations</li>
        </ul>

        <div className="text-center">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
