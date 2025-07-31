import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8082";

const AdminLogin = () => {
  const [admin, setAdmin] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!admin.email || !admin.password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/user/login`, admin);

      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("adminEmail", admin.email);
        localStorage.setItem("role", "ADMIN");
        toast.success("Login Successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid Credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="p-5 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "1.5rem",
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="text-center mb-4 text-dark fw-bold">Admin Login</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control form-control-lg"
              value={admin.email}
              onChange={handleChange}
              required
              style={{
                borderRadius: "0.75rem",
                border: "1px solid #ccc",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
          </div>
          <div className="form-group mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control form-control-lg"
              value={admin.password}
              onChange={handleChange}
              required
              style={{
                borderRadius: "0.75rem",
                border: "1px solid #ccc",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 btn-lg"
            style={{
              backgroundColor: "#6c5ce7",
              color: "white",
              borderRadius: "0.75rem",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#5e50c9")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#6c5ce7")
            }
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <button
            className="btn btn-link p-0"
            onClick={() => navigate('/admin/register')}
            style={{ fontWeight: '500', color: '#6c5ce7', textDecoration: 'none' }}
          >
            Sign Up
          </button>
        </div>

        {/* Demo credentials */}
        <div className="text-center mt-2" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '14px' }}>
          <div><strong>Email:</strong> abhi@mailinator.com</div>
          <div><strong>Password:</strong> abcd@1234</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
