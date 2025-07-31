import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    // Step 1: Send OTP
    const handleSendOtp = (e) => {
        e.preventDefault();

        axios.post("http://localhost:8082/customer/forgot", { email })
            .then((res) => {
                setMessage(res.data || "OTP sent successfully.");
                setError("");
                setOtpSent(true); // ✅ show OTP input
            })
            .catch((err) => {
                setError(err.response?.data || "Failed to send OTP.");
                setMessage("");
            });
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = (e) => {
        e.preventDefault();

        axios.post("http://localhost:8082/customer/verify-otp", { email, otp })
            .then((res) => {
                setMessage(res.data || "OTP verified successfully.");
                setError("");
                setOtpVerified(true);
            })
            .catch((err) => {
                setError(err.response?.data || "Invalid or expired OTP.");
                setMessage("");
            });
    };

    const handleResetPassword = (e) => {
        e.preventDefault();

        axios.post("http://localhost:8082/customer/reset", {
            email,
            otp,
            newPassword
        })
            .then((res) => {
                setMessage(res.data || "Password reset successfully.");
                setError("");
                setOtpSent(false);
                setOtpVerified(false);
                setEmail("");
                setOtp("");
                setNewPassword("");
            })
            .catch((err) => {
                setError(err.response?.data || "Password reset failed.");
                setMessage("");
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-5 shadow" style={{ minWidth: "350px" }}>
                <h3 className="text-center mb-4">Forgot Password</h3>

                {!otpSent ? (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Send OTP
                        </button>
                    </form>
                ) : !otpVerified ? (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-3">
                            <label className="form-label">Enter OTP</label>
                            <input
                                type="text"
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100">
                            Verify OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100">
                            Reset Password
                        </button>
                    </form>
                )}

                {message && <div className="alert alert-success mt-3">{message}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
};

export default ForgotPassword;
