import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // ❤️ icons

const BASE_URL = "http://localhost:8082";

const MenuItem = ({ item, quantity, onAdd, onIncrease, onDecrease }) => {
  const imageUrl = item.imageUrl || "assets/images/default.png";

  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const addToFavorite = async () => {
    if (loadingFavorite) return;
    setLoadingFavorite(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to add to favorites.");
        setLoadingFavorite(false);
        return;
      }

      await axios.post(
        `${BASE_URL}/product/add-favorite`,
        { productId: item.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFavorite(true);
      toast.success(`${item.name} added to favorites! ❤️`, {
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to add favorite:", error);
      toast.error("Failed to add to favorite, please try again.", {
        position: "top-right",
      });
    }

    setLoadingFavorite(false);
  };

  return (
    <div className="menu-items shadow rounded p-3 bg-white h-100 position-relative">
      <div className="position-relative">
        <img
          src={imageUrl}
          alt={item.name}
          className="img-fluid rounded mb-3"
          style={{ height: "220px", objectFit: "cover", width: "100%" }}
        />

        {/* Favorite Icon */}
        <div
          onClick={addToFavorite}
          title={isFavorite ? "Added to Favorites" : "Add to Favorite"}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "4px",
            zIndex: 10,
            cursor: loadingFavorite ? "wait" : "pointer",
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "6px",
            // boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease-in-out",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isFavorite ? (
            <FaHeart size={28} color="red" />
          ) : (
            <FaRegHeart size={28} color="black" />
          )}
        </div>
      </div>

      {/* Add to Cart or Quantity Controls */}
      {quantity === 0 ? (
        <button
          className="btn btn-outline-success position-absolute"
          onClick={onAdd}
          aria-label={`Add ${item.name} to cart`}
          style={{
            top: "208px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "130px",
            height: "54px",
            fontWeight: "600",
            backgroundColor: "white",
            color: "#198754",
            borderColor: "#198754",
            zIndex: 5,
          }}
        >
          Add
        </button>
      ) : (
        <div
          className="d-flex position-absolute"
          style={{
            top: "208px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            borderRadius: ".375rem",
            padding: "4px 12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            alignItems: "center",
            gap: "8px",
            height: "54px",
            zIndex: 5,
          }}
        >
          <button
            className="btn btn-outline-danger"
            onClick={onDecrease}
            style={{
              width: "40px",
              height: "40px",
              padding: 0,
              fontSize: "1.25rem",
              fontWeight: "600",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            −
          </button>
          <span
            className="fw-bold text-dark"
            style={{
              minWidth: "30px",
              textAlign: "center",
              fontSize: "1.2rem",
            }}
          >
            {quantity}
          </span>
          <button
            className="btn btn-outline-success"
            onClick={onIncrease}
            style={{
              width: "40px",
              height: "40px",
              padding: 0,
              fontSize: "1.25rem",
              fontWeight: "600",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>
        </div>
      )}

      <div className="menu-content text-center mt-3 pt-2">
        <h4 className="fw-bold">
          {item.name} <span className="text-warning">₹{item.price}</span>
        </h4>
        <p className="text-muted">{item.description}</p>
      </div>
    </div>
  );
};

export default MenuItem;
