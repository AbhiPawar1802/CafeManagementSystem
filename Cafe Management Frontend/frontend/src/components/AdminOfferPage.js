import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import deleteIcon from "../assets/images/delete.png"; // ✅ Make sure path is correct

const AdminOfferPage = () => {
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountPercent: "",
    minOrderAmount: "",
    code: "",
    expiryDate: "",
  });

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchOffers = async () => {
    try {
      const response = await axios.get("http://localhost:8082/offer/get", axiosConfig);
      setOffers(response.data);
    } catch (error) {
      toast.error("Failed to fetch offers");
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8082/offer/add", formData, axiosConfig);
      toast.success("Offer added successfully");
      setFormData({
        title: "",
        description: "",
        discountPercent: "",
        minOrderAmount: "",
        code: "",
        expiryDate: "",
      });
      fetchOffers();
    } catch (error) {
      toast.error("Failed to add offer");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await axios.delete(`http://localhost:8082/offer/delete/${id}`, axiosConfig);
      toast.success("Offer deleted");
      fetchOffers();
    } catch (error) {
      toast.error("Failed to delete offer");
    }
  };

  return (
    <>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #F3ECE1;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #3E2C20;
        }

        tbody tr:hover {
          background-color: #8B6D5C20;
        }
      `}</style>

      <div
        className="container mt-4 p-4"
        style={{
          minHeight: "100vh",
          color: "#3E2C20",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h2 className="text-center fw-bold" style={{ color: "#3E2C20" }}>
          Manage Offers
        </h2>

        <form
          className="mb-5 p-4 mx-auto"
          onSubmit={handleAddOffer}
          style={{
            maxWidth: "960px",
            backgroundColor: "#D7C4A3",
            borderRadius: 20,
            border: "1px solid #5A3E2B",
            boxShadow: "0 4px 15px rgba(90, 62, 43, 0.2)",
            color: "#3E2C20",
            width: "100%",
          }}
        >
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Offer Title"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                name="description"
                className="form-control"
                placeholder="Offer Description"
                value={formData.description}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div className="col-md-2">
              <input
                type="number"
                name="discountPercent"
                className="form-control"
                placeholder="Discount %"
                value={formData.discountPercent}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div className="col-md-2">
              <input
                type="number"
                name="minOrderAmount"
                className="form-control"
                placeholder="Min Order ₹"
                value={formData.minOrderAmount}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="code"
                className="form-control"
                placeholder="Offer Code"
                value={formData.code}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div className="col-md-3">
              <input
                type="date"
                name="expiryDate"
                className="form-control"
                placeholder="Expiry Date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div className="col-md-3">
              <button
                type="submit"
                className="btn w-100"
                style={addButtonStyle}
              >
                Add Offer
              </button>
            </div>
          </div>
        </form>

        <div
          style={{
            width: "100%",
            maxWidth: 1200,
            borderRadius: 20,
            overflowX: "auto",
            backgroundColor: "#D7C4A3",
            border: "1px solid #5A3E2B",
            boxShadow: "0 8px 32px rgba(90, 62, 43, 0.15)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "#3E2C20",
              minWidth: 800,
            }}
          >
            <thead
              style={{
                backgroundColor: "#5A3E2B",
                color: "#F3ECE1",
                fontWeight: "600",
              }}
            >
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Discount</th>
                <th style={thStyle}>Min Order</th>
                <th style={thStyle}>Code</th>
                <th style={thStyle}>Expires</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ color: "#A78C7F", textAlign: "center", padding: 20 }}>
                    No offers found
                  </td>
                </tr>
              ) : (
                offers.map((offer, index) => (
                  <tr
                    key={offer.id}
                    style={{
                      borderBottom: "1px solid #5A3E2B",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{offer.title}</td>
                    <td
                      style={{
                        ...tdStyle,
                        maxWidth: 250,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={offer.description}
                    >
                      {offer.description}
                    </td>
                    <td style={tdStyle}>{offer.discountPercent}%</td>
                    <td style={tdStyle}>₹{offer.minOrderAmount}</td>
                    <td style={tdStyle}>{offer.code}</td>
                    <td style={tdStyle}>{offer.expiryDate}</td>
                    <td style={{ ...tdStyle, textAlign: "center", verticalAlign: "middle" }}>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        style={deleteButtonStyle}
                        title="Delete Offer"
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          style={{
                            width: 20,
                            height: 20,
                            filter:
                              "invert(23%) sepia(43%) saturate(2970%) hue-rotate(346deg) brightness(93%) contrast(88%)",
                          }}
                        />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const inputStyle = {
  borderRadius: "0.6rem",
  border: "1px solid #5A3E2B",
  backgroundColor: "#F3ECE1",
  color: "#3E2C20",
};

const addButtonStyle = {
  backgroundColor: "#8B6D5C",
  color: "#F3ECE1",
  fontWeight: "bold",
  borderRadius: "0.6rem",
  transition: "background-color 0.3s ease",
  cursor: "pointer",
};

const thStyle = {
  padding: "14px",
  textAlign: "left",
  fontWeight: "600",
  color: "#F3ECE1",
  letterSpacing: 0.5,
};

const tdStyle = {
  padding: "14px",
  color: "#3E2C20",
  fontWeight: 400,
};

const deleteButtonStyle = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

export default AdminOfferPage;
