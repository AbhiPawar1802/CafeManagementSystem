import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCustomer } from "../../api/authApi";
import { toast } from "react-toastify";
import customerLoginBg from '../../assets/images/customer-login.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CustomerLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        loginCustomer({ email, password })
            .then(res => {
                const token = res.data.token;
                if (rememberMe) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('role', 'CUSTOMER');
                } else {
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('role', 'CUSTOMER');
                }

                toast.success('Login Successful!');
                navigate('/customer/dashboard');
            })
            .catch(err => {
                toast.error('Login failed!');
                console.error(err.response?.data || err.message);
            });
    };

    return (
        <div 
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                backgroundImage: `url(${customerLoginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#f5f3f0'
            }}
        >
            <div className="p-3 rounded"
                style={{ 
                    minWidth: '400px', 
                    maxWidth: '400px', 
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)'
                }}
            >
                <h4 className="text-center mb-4 text-white">Login</h4>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label text-black">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 position-relative">
                        <label className="form-label text-black">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    <div className="mb-4 d-flex justify-content-between align-items-center">
                        <div className="form-check m-0">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <label className="form-check-label text-black" htmlFor="rememberMe">
                                Remember Me
                            </label>
                        </div>

                        <button
                            type="button"
                            className="btn btn-link p-0 text-black text-decoration-none"
                            onClick={() => navigate('/forgot-password')}
                        >
                            Forgot Password?
                        </button>
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
                        Login
                    </button>
                </form>

                <div className="text-center mt-3">
                    <span className="text-white">Don't have an account? </span>
                    <button
                        className="btn btn-link p-0 text-white text-decoration-none"
                        onClick={() => {
                            toast.info("Redirecting to Sign Up...");
                            navigate('/register');
                        }}
                        style={{ fontWeight: '500' }}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Demo credentials below Sign Up */}
                <div className="text-center mt-2" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                    <div><strong>Email:</strong> abhipawar762@gmail.com</div>
                    <div><strong>Password:</strong> Abhi@1802</div>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
