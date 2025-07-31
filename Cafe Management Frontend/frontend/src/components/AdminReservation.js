import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import deleteIcon from "../assets/images/delete.png";

const BASE_URL = "http://localhost:8082";

const colors = {
  background: "#F3ECE1",
  cardBg: "#D7C4A3",
  primaryAccent: "#8B6D5C",
  borderStroke: "#5A3E2B",
  headingText: "#3E2C20",
  mutedText: "#A78C7F",
  highlightAccent: "#734F42",
  buttonHover: "#734F42",
  deleteIconTint:
    "invert(23%) sepia(43%) saturate(2970%) hue-rotate(346deg) brightness(93%) contrast(88%)",
};

const AdminReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reservation/get`, config);
      setReservations(response.data);
    } catch (error) {
      toast.error("Failed to fetch reservations");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;

    try {
      await axios.delete(`${BASE_URL}/reservation/delete/${id}`, config);
      toast.success("Reservation deleted successfully!");
      fetchReservations();
    } catch (error) {
      toast.error("Failed to delete reservation");
      console.error(error);
    }
  };

  const handleAccept = async (res) => {
    const id = res.id;
    setLoadingIds((prev) => [...prev, id]);

    try {
      if (res.status !== "Accepted") {
        await axios.post(`${BASE_URL}/reservation/accept/${id}`, {}, config);
        toast.success("Reservation accepted and SMS sent!");
        fetchReservations();
      }
    } catch (error) {
      toast.error("Failed to accept reservation");
      console.error(error);
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        color: colors.headingText,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          padding: 30,
          backgroundColor: colors.cardBg,
          borderRadius: 20,
          border: `1px solid ${colors.borderStroke}`,
          boxShadow: `0 8px 32px ${colors.borderStroke}26`,
          color: colors.headingText,
          backdropFilter: "blur(10px) saturate(180%)",
          WebkitBackdropFilter: "blur(10px) saturate(180%)",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            marginBottom: 24,
            textAlign: "center",
            color: colors.headingText,
            fontWeight: 700,
          }}
        >
          Reservation Management
        </h2>

        {reservations.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
              color: colors.mutedText,
              fontSize: 16,
              marginTop: 30,
            }}
          >
            No reservations found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",  // remove gaps between rows
                color: colors.headingText,
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: colors.highlightAccent,
                    userSelect: "none",
                  }}
                >
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Date",
                    "Message",
                    "Status",
                    "Accept",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      style={{
                        padding: "14px 20px",
                        color: colors.background,
                        fontWeight: 700,
                        fontSize: 15,
                        textAlign: "left",
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => {
                  const isLoading = loadingIds.includes(res.id);
                  return (
                    <tr
                      key={res.id}
                      style={{
                        backgroundColor: colors.background,
                        borderBottom: `1px solid ${colors.borderStroke}`,
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = colors.primaryAccent + "22")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = colors.background)
                      }
                    >
                      <td style={tdStyle}>{res.name}</td>
                      <td style={tdStyle}>{res.email}</td>
                      <td style={tdStyle}>{res.phone}</td>
                      <td style={tdStyle}>{res.date}</td>
                      <td
                        style={{
                          ...tdStyle,
                          maxWidth: 250,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "default",
                        }}
                        title={res.message}
                      >
                        {res.message}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "6px 14px",
                            borderRadius: 14,
                            backgroundColor:
                              res.status === "Accepted"
                                ? colors.primaryAccent
                                : res.status === "Pending"
                                ? colors.highlightAccent
                                : colors.mutedText,
                            color: colors.background,
                            fontWeight: 600,
                            fontSize: 14,
                            userSelect: "none",
                            display: "inline-block",
                            minWidth: 80,
                            textAlign: "center",
                          }}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <label className="switch" title={isLoading ? "Processing..." : res.status === "Accepted" ? "Already Accepted" : "Click to Accept"}>
                          <input
                            type="checkbox"
                            checked={res.status === "Accepted"}
                            onChange={() => handleAccept(res)}
                            disabled={res.status === "Accepted" || isLoading}
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <button
                          onClick={() => handleDelete(res.id)}
                          disabled={isLoading}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            padding: 0,
                            filter: colors.deleteIconTint,
                            transition: "filter 0.3s ease",
                          }}
                          title="Delete Reservation"
                          onMouseEnter={(e) => (e.currentTarget.style.filter = colors.buttonHover)}
                          onMouseLeave={(e) => (e.currentTarget.style.filter = colors.deleteIconTint)}
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete"
                            style={{ width: 22, height: 22 }}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 46px;
          height: 24px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: ${colors.primaryAccent};
        }
        input:checked + .slider:before {
          transform: translateX(22px);
        }
        input:disabled + .slider {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

const tdStyle = {
  padding: "14px 20px",
  color: colors.headingText,
  fontWeight: 400,
};

export default AdminReservation;
