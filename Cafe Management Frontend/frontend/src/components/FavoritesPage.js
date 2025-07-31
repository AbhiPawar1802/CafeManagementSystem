import React, { useEffect, useState } from "react";
import axios from "axios";
import defaultImage from "../assets/images/default.jpg";

const BASE_URL = "http://localhost:8082";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/product/favorite`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/product/remove-favorite`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavorites((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Failed to remove from favorite.");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-5 fs-5 fw-semibold text-secondary">
        Loading favorites...
      </p>
    );

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <h2
        className="mb-5 fw-bold text-center"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: "900",
          fontSize: "2.8rem",
          color: "#2c3e50",
          letterSpacing: "1.2px",
          textShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        Your Favorite Products
      </h2>

      {favorites.length === 0 ? (
        <p
          className="text-center text-muted fs-5 mt-5"
          style={{ fontStyle: "italic" }}
        >
          No favorite products found.
        </p>
      ) : (
        <ul
          className="list-group"
          style={{
            padding: 0,
            listStyle: "none",
          }}
        >
          {favorites.map((item) => (
            <li
              key={item.id}
              className="d-flex align-items-center justify-content-between mb-4 shadow-lg"
              style={{
                borderRadius: "16px",
                background:
                  "linear-gradient(145deg, #ffffff, #e6e9f0)",
                boxShadow:
                  "9px 9px 16px #bec8d2, -9px -9px 16px #ffffff",
                padding: "20px 25px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "12px 12px 20px #a8b3c5, -12px -12px 20px #ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "9px 9px 16px #bec8d2, -9px -9px 16px #ffffff";
              }}
            >
              <div
                className="d-flex align-items-center gap-4"
                style={{ maxWidth: "70%" }}
              >
                <img
                  src={item.imageUrl || defaultImage}
                  alt={item.name}
                  className="rounded"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    flexShrink: 0,
                    borderRadius: "20px",
                    boxShadow:
                      "0 4px 10px rgba(0,0,0,0.12)",
                    transition: "transform 0.3s ease",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />

                <div>
                  <h4
                    className="mb-2"
                    style={{
                      fontWeight: "700",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: "#34495e",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.name}
                  </h4>
                  <p
                    className="mb-0 text-secondary"
                    style={{
                      fontSize: "0.95rem",
                      maxWidth: "320px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontStyle: "italic",
                    }}
                    title={item.description}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column align-items-end gap-3">
                <span
                  className="fs-5 fw-bold"
                  style={{
                    color: "#27ae60",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  ₹{item.price}
                </span>

                <button
                  onClick={() => removeFavorite(item.id)}
                  className="btn btn-danger btn-sm"
                  style={{
                    borderRadius: "12px",
                    fontWeight: "600",
                    padding: "8px 20px",
                    boxShadow: "0 4px 8px rgba(231, 76, 60, 0.3)",
                    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#c0392b";
                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(192, 57, 43, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#e74c3c";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(231, 76, 60, 0.3)";
                  }}
                  aria-label={`Remove ${item.name} from favorites`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritePage;
