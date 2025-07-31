// src/pages/auth/LoginPage.jsx

import React, { useState } from "react";
import CustomerLogin from "./CustomerLogin";
import AdminLogin from "./AdminLogin";
import { FaUserShield, FaUser } from "react-icons/fa";

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleMode = () => setIsAdmin(!isAdmin);

  return (
    <>
      {isAdmin ? <AdminLogin /> : <CustomerLogin />}

      {/* Toggle Button */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleMode}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px) saturate(180%)",
            WebkitBackdropFilter: "blur(12px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "999px",
            padding: "10px 20px",
            fontSize: "13px",
            fontWeight: "500",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease-in-out",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          {isAdmin ? (
            <>
              <FaUser />
              Switch to Customer
            </>
          ) : (
            <>
              <FaUserShield />
              Switch to Admin
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default LoginPage;
