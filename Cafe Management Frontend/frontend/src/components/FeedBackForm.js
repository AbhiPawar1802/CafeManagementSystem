import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    experience: "",
    orderCorrect: false,
    orderComments: "",
    serviceQuality: "",
    deliveryTime: "",
    additionalComments: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeedback((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", feedback);
    alert("Thank you for your feedback!");
    setFeedback({
      experience: "",
      orderCorrect: false,
      orderComments: "",
      serviceQuality: "",
      deliveryTime: "",
      additionalComments: "",
    });
  };

  return (
    <div className="container my-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4 text-center">📝 Feedback Form</h3>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-white">

        {/* Overall Experience */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Overall Experience</label>
          <select
            className="form-select"
            name="experience"
            value={feedback.experience}
            onChange={handleChange}
            required
          >
            <option value="">Choose rating</option>
            <option value="1">⭐ Very Bad</option>
            <option value="2">⭐⭐ Bad</option>
            <option value="3">⭐⭐⭐ Average</option>
            <option value="4">⭐⭐⭐⭐ Good</option>
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
          </select>
        </div>

        {/* Order Accuracy */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="orderCorrect"
            name="orderCorrect"
            checked={feedback.orderCorrect}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="orderCorrect">
            Was your order correct?
          </label>
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            name="orderComments"
            rows="2"
            placeholder="What could be improved? (optional)"
            value={feedback.orderComments}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Service Quality */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Service Quality</label>
          <select
            className="form-select"
            name="serviceQuality"
            value={feedback.serviceQuality}
            onChange={handleChange}
            required
          >
            <option value="">Select one</option>
            <option value="very bad">😡 Very Bad</option>
            <option value="bad">😟 Bad</option>
            <option value="average">😐 Average</option>
            <option value="good">🙂 Good</option>
            <option value="excellent">😁 Excellent</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Delivery Time</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="deliveryTime"
              value="fast"
              checked={feedback.deliveryTime === "fast"}
              onChange={handleChange}
              id="fast"
            />
            <label className="form-check-label" htmlFor="fast">Fast</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="deliveryTime"
              value="on time"
              checked={feedback.deliveryTime === "on time"}
              onChange={handleChange}
              id="onTime"
            />
            <label className="form-check-label" htmlFor="onTime">On time</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="deliveryTime"
              value="late"
              checked={feedback.deliveryTime === "late"}
              onChange={handleChange}
              id="late"
            />
            <label className="form-check-label" htmlFor="late">Slightly Late</label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Additional Comments</label>
          <textarea
            className="form-control"
            name="additionalComments"
            rows="3"
            placeholder="Share any other thoughts..."
            value={feedback.additionalComments}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">Submit Feedback</button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
