import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../../api/authApi";
import customerRegisterBg from '../../assets/images/customer-register.jpg';
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CustomerRegister = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        contactNumber: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();

        registerCustomer(form)
            .then(res => {
                toast.success("Registration successful!");
                navigate("/login");
            })
            .catch(err => {
                toast.error("Registration failed.");
                console.error(err.response?.data || err.message);
            });
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                backgroundImage: `url(${customerRegisterBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#f5f3f0',
            }}
        >
            <div
                className="p-4 rounded"
                style={{
                    minWidth: '400px',
                    maxWidth: '450px',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)'
                }}
            >
                <h4 className="text-center mb-4 text-black">Customer Registration</h4>

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label text-black">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-black">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-black">Contact Number</label>
                        <input
                            type="text"
                            name="contactNumber"
                            className="form-control"
                            value={form.contactNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4 position-relative">
                        <label className="form-label text-black">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <span
                            className="position-absolute"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                right: '10px',
                                top: '38px',
                                cursor: 'pointer',
                                color: '#4b3621'
                            }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button 
                        type="submit"
                        className="btn w-100"
                        style={{
                            backgroundColor: '#4b3621',
                            color: '#fff',
                            border: 'none'
                        }}
                    >
                        Register
                    </button>
                </form>

                <div className="text-center mt-3">
                    <span className="text-black">Already have an account? </span>
                    <button
                        className="btn btn-link p-0 text-black text-decoration-none"
                        onClick={() => {
                            toast.info("Redirecting to Login...");
                            navigate('/login');
                        }}
                        style={{ fontWeight: '500' }}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerRegister;
