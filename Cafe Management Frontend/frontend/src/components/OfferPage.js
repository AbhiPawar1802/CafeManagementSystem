import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import confetti from "canvas-confetti"; 
import "./OfferPage.css";

// Helper for countdown timer
const getTimeLeft = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry - now;
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const OfferPage = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setOffers((prevOffers) =>
        prevOffers.map((offer) => {
          if (!offer.expiryDate) return offer;
          const timeLeft = getTimeLeft(offer.expiryDate);
          return { ...offer, timeLeft };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8082/offer/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const offersWithTimeLeft = response.data.map((offer) => ({
        ...offer,
        timeLeft: offer.expiryDate ? getTimeLeft(offer.expiryDate) : null,
      }));

      setOffers(offersWithTimeLeft);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
      toast.error("Something went wrong while fetching offers!");
    }
  };


  const triggerConfetti = () => {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  };

  const isUrgent = (offer) => {
    if (!offer.timeLeft) return false;
    const regex = /(?:(\d+)d)? ?(?:(\d+)h)? ?(?:(\d+)m)? ?(\d+)s/;
    const match = offer.timeLeft.match(regex);
    if (!match) return false;

    const [, days, hours, minutes, seconds] = match.map((v) => parseInt(v) || 0);
    const totalSeconds = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;

    return totalSeconds <= 60;
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Promo code copied!");
    triggerConfetti();
  };

  return (
    <div className="offer-page-coupon container py-5">
      <h2 className="text-center fw-bold mb-5 text-gradient">🔥 Hot Deals & Exclusive Offers</h2>

      {offers.length === 0 ? (
        <p className="text-center text-muted fs-5">No current offers available.</p>
      ) : (
        <div className="row g-4">
          {offers.map((offer) => (
            <div className="col-md-6 col-lg-4" key={offer.id}>
              {renderOfferCard(offer, handleCopyCode, isUrgent)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderOfferCard = (offer, handleCopyCode, isUrgent) => {
  const expired = offer.timeLeft === null;

  return (
    <div className={`coupon-card ${expired ? "expired" : ""}`}>
      <span className="discount-badge">{offer.discountPercent}% OFF</span>
      <div className="coupon-header">
        <h5 className="fw-bold mb-2">{offer.title} 🎉</h5>
      </div>

      <p className="coupon-description">{offer.description}</p>

      {offer.expiryDate && (
        <p
          className={`countdown-timer ${expired ? "text-danger" : "text-success"} ${
            isUrgent(offer) ? "urgent" : ""
          }`}
        >
          {expired ? "Offer Expired" : `Expires in: ${offer.timeLeft}`}
        </p>
      )}

      {offer.code && !expired && (
        <div className="coupon-code-box promo-box d-flex align-items-center justify-content-between mt-3">
          <span className="code-text">
            Code: <span className="actual-code">{offer.code}</span>
          </span>
          <button 
            className="btn-copy" 
            onClick={() => handleCopyCode(offer.code)}
            aria-label={`Copy promo code ${offer.code}`}
            title="Copy promo code"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default OfferPage;
 