import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import deleteIcon from "../assets/images/delete.png";
import editIcon from "../assets/images/edit.png";

const BASE_URL = "http://localhost:8082";

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loadingIds, setLoadingIds] = useState([]);

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/get`, config);
      setAdmins(res.data);
    } catch (error) {
      toast.error("Failed to fetch admins");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    setLoadingIds((prev) => [...prev, id]);
    try {
      await axios.delete(`${BASE_URL}/user/delete/${id}`, config);
      toast.success("Admin deleted successfully!");
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to delete admin");
      console.error(error);
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
    }
  };

  const handleEdit = (admin) => {
    setEditingAdminId(admin.id);
    setFormData(admin);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    setLoadingIds((prev) => [...prev, editingAdminId]);
    try {
      await axios.post(`${BASE_URL}/user/update`, formData, config);
      toast.success("Admin updated successfully!");
      setEditingAdminId(null);
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to update admin");
      console.error(error);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== editingAdminId));
    }
  };

  const handleApprove = async (email, newRole) => {
    setLoadingIds((prev) => [...prev, email]);
    try {
      await axios.put(
        `${BASE_URL}/user/approve-admin`,
        { email, role: newRole },
        config
      );
      toast.success(
        newRole === "admin" ? "User promoted to Admin" : "User demoted"
      );
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to update role");
      console.error(error);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== email));
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F3ECE1",
        minHeight: "100vh",
        padding: "3rem 1.5rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#3E2C20",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          marginBottom: "2.5rem",
          fontWeight: 700,
          fontSize: 32,
          color: "#3E2C20",
          letterSpacing: "0.05em",
        }}
      >
        Manage Admins
      </h2>

      <div
        style={{
          maxWidth: 1080,
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: "28px",
          justifyContent: "center",
          overflowY: "auto",
          maxHeight: "75vh",
          paddingRight: 12,
        }}
      >
        <style>
          {`
            .switch {
              position: relative;
              display: inline-block;
              width: 54px;
              height: 28px;
            }
            .switch input {
              opacity: 0;
              width: 0;
              height: 0;
            }
            .slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: #d6cbb3;
              transition: 0.4s;
              border-radius: 34px;
              box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
            }
            .slider:before {
              position: absolute;
              content: "";
              height: 22px;
              width: 22px;
              left: 3px;
              bottom: 3px;
              background-color: white;
              transition: 0.4s;
              border-radius: 50%;
              box-shadow: 0 1px 3px rgba(0,0,0,0.15);
            }
            input:checked + .slider {
              background-color: #5C8A64;
              box-shadow: 0 0 8px #5C8A64;
            }
            input:checked + .slider:before {
              transform: translateX(26px);
            }
            .card-button {
              background-color: transparent;
              border: none;
              cursor: pointer;
              padding: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: filter 0.25s ease;
              filter: brightness(0.7);
            }
            .card-button:hover {
              filter: brightness(1);
            }
          `}
        </style>

        {admins.length === 0 ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: "6rem",
              fontSize: 20,
              color: "#A78C7F",
            }}
          >
            No admins found.
          </div>
        ) : (
          admins.map((admin) => {
            const isLoading =
              loadingIds.includes(admin.id) || loadingIds.includes(admin.email);
            const isEditing = editingAdminId === admin.id;
            const isApproved = admin.role === "admin";

            return (
              <div
                key={admin.id}
                style={{
                  background:
                    "linear-gradient(145deg, #e4d9bc, #cbbf96)",
                  borderRadius: 16,
                  boxShadow:
                    "0 4px 8px rgba(90, 62, 43, 0.12), 0 8px 15px rgba(90, 62, 43, 0.18)",
                  width: 320,
                  padding: "1.8rem 1.8rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "default",
                  marginBottom: 16,
                  border: "1.5px solid #b1a67c",
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
                  <span>ID #{admin.id}</span>
                  <span
                    style={{
                      fontWeight: "500",
                      fontSize: 13,
                      color: "#5a4b3a",
                      fontStyle: "italic",
                    }}
                  >
                    {admin.status || "Active"}
                  </span>
                </div>

                {isEditing ? (
                  <>
                    <input
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={isLoading}
                      style={{
                        borderColor: "#b1a67c",
                        fontWeight: "600",
                        color: "#3E2C20",
                        padding: "10px 14px",
                        borderRadius: 12,
                        boxShadow:
                          "inset 0 1px 3px rgba(0,0,0,0.12)",
                        fontSize: 16,
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      placeholder="Name"
                    />
                    <input
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={isLoading}
                      style={{
                        borderColor: "#b1a67c",
                        fontWeight: "600",
                        color: "#3E2C20",
                        padding: "10px 14px",
                        borderRadius: 12,
                        boxShadow:
                          "inset 0 1px 3px rgba(0,0,0,0.12)",
                        fontSize: 16,
                        marginTop: 14,
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      placeholder="Email"
                    />
                    <input
                      name="contactNumber"
                      value={formData.contactNumber || ""}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={isLoading}
                      style={{
                        borderColor: "#b1a67c",
                        fontWeight: "600",
                        color: "#3E2C20",
                        padding: "10px 14px",
                        borderRadius: 12,
                        boxShadow:
                          "inset 0 1px 3px rgba(0,0,0,0.12)",
                        fontSize: 16,
                        marginTop: 14,
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      placeholder="Contact Number"
                    />
                    <input
                      name="status"
                      value={formData.status || ""}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={isLoading}
                      style={{
                        borderColor: "#b1a67c",
                        fontWeight: "600",
                        color: "#3E2C20",
                        padding: "10px 14px",
                        borderRadius: 12,
                        boxShadow:
                          "inset 0 1px 3px rgba(0,0,0,0.12)",
                        fontSize: 16,
                        marginTop: 14,
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      placeholder="Status"
                    />

                    <div
                      style={{
                        marginTop: 24,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 18,
                      }}
                    >
                      <button
                        onClick={handleUpdate}
                        disabled={isLoading}
                        style={{
                          backgroundColor: "#5C8A64",
                          color: "white",
                          fontWeight: 700,
                          padding: "10px 22px",
                          borderRadius: 12,
                          border: "none",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          boxShadow:
                            "0 4px 12px rgba(92, 138, 100, 0.6)",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#4a6f50")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#5C8A64")
                        }
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAdminId(null)}
                        disabled={isLoading}
                        style={{
                          padding: "10px 22px",
                          borderRadius: 12,
                          border: "2px solid #b1a67c",
                          backgroundColor: "transparent",
                          color: "#5a4b3a",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          fontWeight: 600,
                          transition: "background-color 0.3s ease, color 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#b1a67c";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#5a4b3a";
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#3E2C20",
                        lineHeight: 1.5,
                        userSelect: "none",
                      }}
                    >
                      <p>
                        <strong>Name:</strong> {admin.name || "—"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        <a
                          href={`mailto:${admin.email}`}
                          style={{
                            color: "#5C8A64",
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                        >
                          {admin.email || "—"}
                        </a>
                      </p>
                      <p>
                        <strong>Contact:</strong>{" "}
                        <a
                          href={`tel:${admin.contactNumber}`}
                          style={{
                            color: "#5C8A64",
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                        >
                          {admin.contactNumber || "—"}
                        </a>
                      </p>
                      <p>
                        <strong>Status:</strong> {admin.status || "Active"}
                      </p>
                    </div>

                    {/* Bottom row */}
                    <div
                      style={{
                        marginTop: 22,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {/* Switch */}
                      <label className="switch" title="Toggle Admin Role">
                        <input
                          type="checkbox"
                          checked={isApproved}
                          disabled={isLoading}
                          onChange={() =>
                            handleApprove(
                              admin.email,
                              isApproved ? "user" : "admin"
                            )
                          }
                        />
                        <span className="slider"></span>
                      </label>

                      {/* Buttons */}
                      <div style={{ display: "flex", gap: 18 }}>
                        <button
                          onClick={() => handleEdit(admin)}
                          disabled={isLoading}
                          className="card-button"
                          title="Edit Admin"
                        >
                          <img
                            src={editIcon}
                            alt="Edit"
                            style={{ width: 22, height: 22 }}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          disabled={isLoading}
                          className="card-button"
                          title="Delete Admin"
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete"
                            style={{ width: 22, height: 22 }}
                          />
                        </button>
                      </div>
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

export default ManageAdmin;
