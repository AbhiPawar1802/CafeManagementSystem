import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import editIcon from "../assets/images/edit.png";
import deleteIcon from "../assets/images/delete.png";

const BASE_URL = "http://localhost:8082";

const ManageCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/customer/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch (err) {
      toast.error("Failed to fetch customers");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`${BASE_URL}/customer/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Customer deleted");
      fetchCustomers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomerId(customer.id);
    setFormData(customer);
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/customer/update`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Customer updated");
      setEditingCustomerId(null);
      fetchCustomers();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F3ECE1",
        minHeight: "100vh",
        padding: "2rem 1rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#3E2C20",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          marginBottom: "2rem",
          fontWeight: 700,
          fontSize: 28,
          textAlign: "center",
          width: "100%",
          maxWidth: 1080,
        }}
      >
        Manage Customers
      </h2>

      <div
        style={{
          width: "100%",
          maxWidth: 1080,
          maxHeight: "75vh",
          overflowY: "auto",
          paddingRight: 12,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
          border: "1.5px solid #b1a67c",
          borderRadius: 16,
          backgroundColor: "rgba(215, 196, 163, 0.85)",
          boxShadow: "0 8px 24px rgba(90, 62, 43, 0.15)",
        }}
      >
        {customers.length === 0 ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: "4rem",
              fontSize: 18,
              color: "#A78C7F",
            }}
          >
            No customers found.
          </div>
        ) : (
          customers.map((customer) => {
            const isEditing = editingCustomerId === customer.id;

            return (
              <div
                key={customer.id}
                style={{
                  background: "linear-gradient(145deg, #e4d9bc, #cbbf96)",
                  borderRadius: 16,
                  boxShadow:
                    "0 4px 8px rgba(90, 62, 43, 0.12), 0 8px 15px rgba(90, 62, 43, 0.18)",
                  width: 320,
                  padding: "1.5rem 1.8rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "default",
                  margin: "12px 0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 20px rgba(90, 62, 43, 0.25), 0 18px 35px rgba(90, 62, 43, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(90, 62, 43, 0.12), 0 8px 15px rgba(90, 62, 43, 0.18)";
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "700",
                    fontSize: 17,
                    borderBottom: "1.5px solid #b1a67c",
                    paddingBottom: 8,
                    marginBottom: 10,
                    color: "#3E2C20",
                    letterSpacing: "0.02em",
                  }}
                >
                  <span>Customer #{customer.id}</span>
                </div>

                {isEditing ? (
                  <>
                    <input
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{
                        borderRadius: 8,
                        borderColor: "#b1a67c",
                        fontWeight: "600",
                        color: "#3E2C20",
                        padding: "6px 12px",
                      }}
                    />
                    <input
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{
                        marginTop: 10,
                        borderRadius: 8,
                        borderColor: "#b1a67c",
                        fontWeight: "600",
                        color: "#3E2C20",
                        padding: "6px 12px",
                      }}
                    />
                    <input
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{
                        marginTop: 10,
                        borderRadius: 8,
                        borderColor: "#b1a67c",
                        fontWeight: "600",
                        color: "#3E2C20",
                        padding: "6px 12px",
                      }}
                    />
                    <div
                      style={{
                        marginTop: 14,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        onClick={handleUpdate}
                        className="btn btn-success"
                        style={{ fontWeight: 600 }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCustomerId(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#3E2C20" }}>
                      <div>
                        <strong>Name:</strong> {customer.name || "—"}
                      </div>
                      <div>
                        <strong>Email:</strong> {customer.email || "—"}
                      </div>
                      <div>
                        <strong>Phone:</strong> {customer.phone || "—"}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 14,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 16,
                      }}
                    >
                      <button
                        onClick={() => handleEdit(customer)}
                        title="Edit Customer"
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.firstChild.style.filter = "brightness(0.8)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.firstChild.style.filter = "none";
                        }}
                      >
                        <img
                          src={editIcon}
                          alt="Edit"
                          style={{ width: 26, height: 26, display: "block" }}
                        />
                      </button>

                      <button
                        onClick={() => handleDelete(customer.id)}
                        title="Delete Customer"
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.firstChild.style.filter = "brightness(0.8)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.firstChild.style.filter = "none";
                        }}
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          style={{ width: 26, height: 26, display: "block" }}
                        />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageCustomer;
