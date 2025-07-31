import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const AdminFooter = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-4 mt-4">
            <div className="container text-center text-md-left">
                <div className="row text-center text-md-left">

                    <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Admin Panel</h5>
                        <p>Manage cafe operations efficiently — from products to reservations, all in one place.</p>
                    </div>

                    <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
                    <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Contact Info</h5>
                        <p><FaMapMarkerAlt className="me-2" /> 123 Admin Street, HQ</p>
                        <p><FaEnvelope className="me-2" /> admin@coffeepoint.com</p>
                        <p><FaPhoneAlt className="me-2" /> +91 9876543210</p>
                    </div>

                    <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Follow Us</h5>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-4">
                            <FaFacebookF />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white me-4">
                            <FaInstagram />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white me-4">
                            <FaTwitter />
                        </a>
                    </div>
                </div>

                <hr className="my-3" />

                <div className="row align-items-center">
                    <div className="col-md-12 text-center">
                        <p className="text-white mb-0">
                            © 2025 <strong>Coffee Point Admin</strong> — Built for Performance & Control.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default AdminFooter;