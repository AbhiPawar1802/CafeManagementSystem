import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-4">
            <div className="container text-center text-md-left">
                <div className="row text-Center text-md-left">

                    <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Coffee Point</h5>
                        <p>Bringing you the best taste with love and passion. Visit us and enjoy a delightful dining experience!</p>
                    </div>

                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Quick Links</h5>
                        <p><Link to="/" className="text-white text-decoration-none">Home</Link></p>
                        <p><Link to="/menu" className="text-white text-decoration-none">Menu</Link></p>
                        <p><Link to="/reservation" className="text-white text-decoration-none">Reservation</Link></p>
                        <p><Link to="/contact" className="text-white text-decoration-none">Contact Us</Link></p>
                    </div>

                    <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                    <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Contact</h5>
                        <p><FaMapMarkerAlt className="me-2" /> 123 Main Street, City</p>
                        <p><FaEnvelope className="me-2" /> support@coffeepoint.com</p>
                        <p><FaPhoneAlt className="me-2" /> +91 9876543210</p>
                    </div>
                    <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mt-3">
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
                    <div className="col-md-7 col-lg-8">
                        <p className="text-white mb-0">
                            © 2025 <strong>Klassy Cafe</strong>. All Rights Reserved.
                        </p>
                    </div>
                    <div className="col-md-5 col-lg-4">
                        <p className="text-white mb-0">Designed with ❤️ for You</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;