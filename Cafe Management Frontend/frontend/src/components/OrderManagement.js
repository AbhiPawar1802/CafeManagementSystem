import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import deleteIcon from "../assets/images/delete.png";
import downloadIcon from "../assets/images/download.png";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8082/order/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error("Failed to fetch orders");
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:8082/order/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Order deleted successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order", error);
      toast.error("Could not delete order.");
    }
  };

  const togglePaymentStatus = async (
    orderId,
    currentStatus,
    transactionId,
    paymentMode
  ) => {
    const newStatus = currentStatus === "Success" ? "Not Paid" : "Success";
    try {
      const response = await axios.post(
        "http://localhost:8082/order/updatePaymentStatus",
        {
          orderId,
          paymentStatus: newStatus,
          transactionId: transactionId || `TXN-${Date.now()}`,
          paymentMode: paymentMode || "UPI",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data?.message || "Payment status updated");
      fetchOrders();
    } catch (error) {
      console.error("Failed to update payment status", error);
      toast.error("Failed to update payment status.");
    }
  };

  const downloadBill = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/order/download-bill/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `order_${orderId}_bill.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Bill downloaded successfully!");
    } catch (error) {
      console.error("Error downloading bill", error);
      toast.error("Failed to download bill.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div
      className="container-fluid py-4 px-3"
      style={{
        backgroundColor: "#F3ECE1",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#3E2C20",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3
        className="w-100 text-center fw-bold"
        style={{ color: "#3E2C20", marginBottom: "1.8rem" }}
      >
        Order Management
      </h3>
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
          backgroundColor: "rgba(231, 223, 197, 0.8)",
          boxShadow: "0 8px 24px rgba(90, 62, 43, 0.15)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="hide-scrollbar"
      >
        <style>
          {`
            .hide-scrollbar::-webkit-scrollbar {
              width: 0px;
              background: transparent;
            }
          `}
        </style>

        {orders.length === 0 ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: "4rem",
              fontSize: 18,
              color: "#A78C7F",
            }}
          >
            No orders found
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
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
                <span>Order #{order.id}</span>
                <span
                  style={{ fontWeight: "500", fontSize: 13, color: "#5a4b3a" }}
                >
                  {new Date(order.orderDate).toLocaleDateString()}
                </span>
              </div>

              {/* Customer Info */}
              <div style={{ fontSize: 14, color: "#3E2C20", fontWeight: "500" }}>
                <div>
                  <strong>Customer:</strong> {order.customerName}
                </div>
                <div>
                  <strong>Contact:</strong> {order.contactNumber}
                </div>
                <div>
                  <strong>Email:</strong> {order.email}
                </div>
              </div>

              {/* Payment & Status */}
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "1.5px solid #b1a67c",
                  fontSize: 14,
                  color: "#3E2C20",
                  fontWeight: "500",
                }}
              >
                <div>
                  <strong>Amount:</strong> ₹{order.totalAmount}{" "}
                  <span
                    style={{
                      color: "#7a6b4f",
                      fontWeight: "400",
                      fontSize: 12,
                    }}
                  >
                    (Tax: ₹{order.tax}, Service: ₹{order.serviceCharge})
                  </span>
                </div>
                <div>
                  <strong>Payment Mode:</strong> {order.paymentMode || "—"}
                </div>
                <div>
                  <strong>Transaction ID:</strong> {order.transactionId || "—"}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 14,
                      fontWeight: "600",
                      fontSize: 13,
                      backgroundColor:
                        order.status === "Pending Payment"
                          ? "#fff3cd"
                          : order.status === "Confirmed"
                          ? "#d4edda"
                          : "#e2e3e5",
                      color:
                        order.status === "Pending Payment"
                          ? "#664d03"
                          : order.status === "Confirmed"
                          ? "#155724"
                          : "#6c757d",
                      display: "inline-block",
                      minWidth: 100,
                      textAlign: "center",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Payment Toggle */}
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <input
                  type="checkbox"
                  checked={order.paymentStatus === "Success"}
                  onChange={() =>
                    togglePaymentStatus(
                      order.id,
                      order.paymentStatus,
                      order.transactionId,
                      order.paymentMode
                    )
                  }
                  style={{
                    cursor: "pointer",
                    width: 22,
                    height: 22,
                    accentColor:
                      order.paymentStatus === "Success"
                        ? "#5C8A64"
                        : "#A15544",
                    borderRadius: 4,
                  }}
                  title={
                    order.paymentStatus === "Success"
                      ? "Mark as Not Paid"
                      : "Mark as Paid"
                  }
                />
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#3E2C20",
                    letterSpacing: "0.03em",
                  }}
                >
                  {order.paymentStatus === "Success" ? "Paid" : "Not Paid"}
                </label>
              </div>

              {/* Icon Actions - bottom-right */}
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 20,
                }}
              >
                <button
                  onClick={() => downloadBill(order.id)}
                  title="Download Bill"
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <img
                    src={downloadIcon}
                    alt="Download"
                    style={{
                      width: 28,
                      height: 28,
                      transition: "transform 0.3s ease",
                      filter:
                        "invert(38%) sepia(15%) saturate(800%) hue-rotate(20deg) brightness(95%) contrast(90%)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </button>

                <button
                  onClick={() => deleteOrder(order.id)}
                  title="Delete Order"
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    style={{
                      width: 28,
                      height: 28,
                      transition: "transform 0.3s ease",
                      filter:
                        "invert(30%) sepia(54%) saturate(1500%) hue-rotate(340deg) brightness(90%) contrast(100%)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
