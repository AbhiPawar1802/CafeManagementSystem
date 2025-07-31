import React, { useEffect, useState } from "react";
import CustomerNavbar from "./CustomerNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBtn, setActiveBtn] = useState(null); // track active button

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:8082/customer/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching customer profile:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div
        className="text-center py-4"
        style={{ fontFamily: "'Gilroy', 'Helvetica Neue', sans-serif" }}
      >
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="text-center py-4 text-danger"
        style={{ fontFamily: "'Gilroy', 'Helvetica Neue', sans-serif" }}
      >
        Failed to load user data.
      </div>
    );
  }

  const cardBgColor = "#bfbfbfbf";
  const buttonDefaultBg = cardBgColor;
  const buttonActiveBg = "#ffffff";

  return (
    <>
      <CustomerNavbar />

      {/* Left Vertical Line */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "1.5rem",
          height: "100vh",
          backgroundColor: "#37718e",
          zIndex: 0,
        }}
      ></div>

      {/* Top Horizontal Header Bar */}
      <div
        className="d-flex justify-content-between align-items-end"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "13rem",
          backgroundColor: "#37718e",
          color: "white",
          padding: "0 2rem 2rem 3rem",
          boxSizing: "border-box",
          zIndex: 0,
          fontFamily: "'Gilroy', 'Helvetica Neue', sans-serif",
        }}
      >
        <div>
          <h1 className="fw-bold mb-1" style={{ fontSize: "2.5rem" }}>
            {user.name || "Guest User"}
          </h1>
          <div
            className="d-flex flex-wrap gap-3"
            style={{ fontSize: "1rem", opacity: 0.85 }}
          >
            <span>{user.email || "example@mail.com"}</span>
            <span>{user.contactNumber || "Phone not available"}</span>
          </div>
        </div>
        <button
          className="btn"
          onClick={() => navigate("/customer/update-profile")}
          style={{
            border: "1px solid white",
            color: "white",
            backgroundColor: "transparent",
            fontWeight: 600,
            fontSize: "1.1rem",
            fontFamily: "'Gilroy', 'Helvetica Neue', sans-serif",
            padding: "0.6rem 1.2rem",
            transition: "all 0.3s ease",
            borderRadius: "0", // explicitly removing border-radius
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          Edit Profile
        </button>
      </div>

      {/* Fixed Vertical Card with Vertical Buttons */}
      <div
        style={{
          position: "fixed",
          top: "15rem",
          left: "3rem",
          height: "27rem",
          width: "15rem",
          background: cardBgColor,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily: "'Gilroy', 'Helvetica Neue', sans-serif",
          fontSize: "1.3rem",
          fontWeight: 600,
          color: "#333",
          transition: "all 0.3s ease",
          zIndex: 10,
          userSelect: "none",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {["Order", "Favorite", "Payments", "Address"].map((btnText) => (
          <button
            key={btnText}
            onClick={() => setActiveBtn(btnText)}
            style={{
              backgroundColor: activeBtn === btnText ? buttonActiveBg : buttonDefaultBg,
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.9rem 1rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              color: activeBtn === btnText ? "#333" : "#555",
              cursor: "pointer",
              userSelect: "none",
              width: "100%",
              marginBottom: "1rem",
              boxShadow: activeBtn === btnText ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (activeBtn !== btnText) e.currentTarget.style.backgroundColor = "#aebac340";
            }}
            onMouseLeave={(e) => {
              if (activeBtn !== btnText)
                e.currentTarget.style.backgroundColor = buttonDefaultBg;
            }}
          >
            {btnText}
          </button>
        ))}
      </div>

      {/* Main Content - scrollable */}
      <div
        className="container"
        style={{
          paddingTop: "14rem",
          paddingLeft: "20rem", // prevent overlap with fixed card
          fontFamily: "'Gilroy', 'Helvetica Neue', sans-serif",
          position: "relative",
          zIndex: 1,
          minHeight: "80vh",
        }}
      >
        <div className="row">
          <div className="col-md-10 col-lg-8 mx-auto text-center">
            <h2>Hello, {user.name || "Guest"}!</h2>
            <p>Welcome to your profile page.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;
