import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import mascotAnimation from "../assets/images/mascot.json";
import successAnimation from "../assets/images/success.json";
import "./Reservation.css";

const BASE_URL = "http://localhost:8082";

const Reservation = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized access. Please try again.");
      return;
    }

    const formData = new FormData(e.target);
    const reservationData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      date: formData.get("date"),
      message: formData.get("message"),
    };

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/reservation/add`, reservationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Reservation submitted successfully!");
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        e.target.reset();
      }, 10000);
    } catch (error) {
      console.error("Reservation failed", error);
      toast.error("Failed to submit reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reservation-section" id="reservation">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-5 text-center mascot-box">
            <Lottie animationData={mascotAnimation} loop={true} />
          </div>

          <div className="col-lg-7">
            <div className="section-heading text-center mb-4">
              <h6 className="text-uppercase">Contact Us</h6>
              <h2 className="fw-bold">Make A Reservation</h2>
            </div>

            {submitted ? (
              <div className="success-animation text-center">
                <Lottie
                  animationData={successAnimation}
                  loop={false}
                  autoplay
                />
                <h4 className="mt-3 text-success">Reservation Confirmed!</h4>
              </div>
            ) : (
              <form onSubmit={handleReservationSubmit} className="glass-form">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="datetime-local"
                      name="date"
                      className="form-control time-picker-glass"
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <textarea
                      name="message"
                      rows="4"
                      className="form-control"
                      placeholder="Message (optional)"
                    ></textarea>
                  </div>
                  <div className="col-12 text-center">
                    <button
                      className="btn btn-custom"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Make A Reservation"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
