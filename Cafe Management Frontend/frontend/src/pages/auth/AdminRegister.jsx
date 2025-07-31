import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8082";

const AdminRegister = () => {
  const [admin, setAdmin] = useState({
    name: "",
    contactNumber: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, contactNumber, email, password } = admin;
    if (!name || !contactNumber || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/user/signup`, admin);

      if (res.status === 200) {
        toast.success("Admin registered successfully!");
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e27d60, #f7d6bf)",
        padding: "20px"
      }}
    >
      <div
        className="p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "360px",
          borderRadius: "1.5rem",
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          fontFamily: "'Poppins', sans-serif",
          color: "#4b3b2b"
        }}
      >
        <h3 className="text-center mb-4 fw-bold" style={{ letterSpacing: "1.2px" }}>
          Admin Registration
        </h3>
        <form onSubmit={handleSubmit}>
          {["name", "contactNumber", "email", "password"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              name={field}
              placeholder={
                field === "contactNumber"
                  ? "Contact Number"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              className="form-control mb-3"
              value={admin[field]}
              onChange={handleChange}
              required
              style={{
                borderRadius: "12px",
                border: "1px solid #bfb1a8",
                padding: "10px 16px",
                fontSize: "0.95rem",
                fontWeight: "500",
                outline: "none",
                boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)"
              }}
            />
          ))}

          <button
            type="submit"
            className="btn w-100 fw-semibold"
            style={{
              padding: "12px 0",
              fontSize: "1.1rem",
              borderRadius: "12px",
              border: "none",
              backgroundImage: "linear-gradient(90deg, #c8553d, #f2b880)",
              color: "#fff",
              boxShadow: "0 4px 15px rgba(242, 184, 128, 0.7)",
              cursor: "pointer"
            }}
          >
            Register
          </button>
        </form>

        <p className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/admin/login")}
            style={{
              color: "#c8553d",
              fontWeight: "600",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.9rem"
            }}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
