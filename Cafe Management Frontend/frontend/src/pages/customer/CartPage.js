import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../components/CartContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/images/klassy-logo.png";
import profileIcon from "../../assets/images/profile.png";
import leftArrow from "../../assets/images/left.png";

const glassCardStyle = {
  background: "rgba(255, 255, 255, 0.15)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  cursor: "default",
};

const animatedCardStyle = {
  ...glassCardStyle,
  animation: "fadeInUp 0.6s ease forwards",
};

const fadeInUpKeyframes = `
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

const CartPage = () => {
  const {
    cartItems,
    addToCart,
    decreaseFromCart,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);
  const [customer, setCustomer] = useState({});
  const [billing, setBilling] = useState({
    subtotal: 0,
    gst: 0,
    serviceCharge: 0,
    total: 0,
  });
  const [tipAmount, setTipAmount] = useState(0);
  const [showTipModal, setShowTipModal] = useState(false);
  const [offers, setOffers] = useState([]);
  const [selectedOfferCode, setSelectedOfferCode] = useState(null);
  const [pendingSelectedOfferCode, setPendingSelectedOfferCode] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoCodeError, setPromoCodeError] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zip: "",
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = fadeInUpKeyframes;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8082/customer/profile", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        setCustomer(res.data);
      })
      .catch((err) => {
        console.error("Error fetching customer:", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8082/offer/get", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        setOffers(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching offers:", err);
      });
  }, []);

  useEffect(() => {
    const cartArray = Object.values(cartItems)
      .filter((item) => item && item.product && item.product.id)
      .map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
    if (cartArray.length > 0) {
      axios
        .post("http://localhost:8082/order/calculate", cartArray, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((res) => {
          setBilling(res.data);
        })
        .catch((err) => {
          console.error("Error calculating billing:", err);
        });
    } else {
      setBilling({
        subtotal: 0,
        gst: 0,
        serviceCharge: 0,
        total: 0,
      });
    }
  }, [cartItems]);

  useEffect(() => {
    if (selectedOfferCode && billing.subtotal > 0) {
      const offer = offers.find((o) => o.code === selectedOfferCode);
      if (offer) {
        if (billing.subtotal >= offer.minOrderAmount) {
          const discount = (billing.subtotal * offer.discountPercent) / 100;
          setDiscountAmount(discount);
          setPromoCodeError("");
        } else {
          setDiscountAmount(0);
          setPromoCodeError(`Offer requires minimum order ₹${offer.minOrderAmount}`);
          setSelectedOfferCode(null);
        }
      } else {
        setDiscountAmount(0);
        setSelectedOfferCode(null);
      }
    } else {
      setDiscountAmount(0);
    }
  }, [selectedOfferCode, billing.subtotal, offers]);

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:8082/offer/validate",
        { code: promoCodeInput.trim().toUpperCase(), subtotal: billing.subtotal },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      if (res.data.valid) {
        setSelectedOfferCode(promoCodeInput.trim().toUpperCase());
        setDiscountAmount((billing.subtotal * res.data.discountPercent) / 100);
        setPromoCodeError("");
        toast.success(`Promo code ${promoCodeInput} applied!`);
        setShowOfferPopup(false);
        setPendingSelectedOfferCode(null);
        setPromoCodeInput("");
      } else {
        setPromoCodeError(res.data.message || "Invalid promo code");
        toast.error(res.data.message || "Invalid promo code");
      }
    } catch (error) {
      setPromoCodeError("Error validating promo code");
      toast.error("Error validating promo code");
      console.error(error);
    }
  };

  const handlePlaceOrder = async () => {
    if (Object.keys(cartItems).length === 0) {
      toast.warning("Cart is empty!");
      return;
    }
    if (!address.street || !address.city || !address.zip) {
      toast.warning("Please fill in delivery address details.");
      return;
    }
    const totalItemsCount = Object.values(cartItems).reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const finalTotal = billing.total + tipAmount - discountAmount;
    if (finalTotal < 0) {
      toast.error("Discount exceeds total amount. Please check offers.");
      return;
    }

    const requestMap = {
      customerName: customer.name,
      contactNumber: customer.contactNumber,
      email: customer.email,
      totalAmount: finalTotal,
      tax: billing.gst,
      serviceCharge: billing.serviceCharge,
      tipAmount,
      discountAmount,
      appliedOfferCode: selectedOfferCode,
      deliveryAddress: address,
      items: Object.values(cartItems).map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
    };
    try {
      setIsPlacingOrder(true);
      const res = await axios.post("http://localhost:8082/order/place", requestMap, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      toast.success(res.data.message || "Order placed! Proceed to payment.");
      clearCart();
      setOrderId(res.data.orderId);
      navigate("/customer/payment", {
        state: {
          orderDetails: {
            customerName: customer.name,
            contactNumber: customer.contactNumber,
            email: customer.email,
            subtotal: billing.subtotal,
            gst: billing.gst,
            serviceCharge: billing.serviceCharge,
            tipAmount,
            discountAmount,
            appliedOfferCode: selectedOfferCode,
            total: finalTotal,
            itemCount: totalItemsCount,
            deliveryAddress: address,
          },
        },
      });
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("Order failed. Try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const ordersPlaced = customer.orderCount ? customer.orderCount % 7 : 0;

  const handleAddTip = (amount) => {
    setTipAmount(amount);
    setShowTipModal(false);
  };

  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:8082/order/status/${orderId}`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        setOrderStatus(res.data.status);
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "			#3E2723",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <header
        style={{
          background: "rgba(15, 23, 42, 0.75)",
          padding: "12px 24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          position: "sticky",
          top: 20,
          zIndex: 1000,
          marginBottom: 20,
          marginInline: "auto",
          maxWidth: 1200,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#f1f5f9",
        }}
      >
        {/* Left: Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <img src={logo} alt="Cafe Logo" height="40" />
          <h5 style={{ margin: 0, fontWeight: 700, color: "#f1f5f9" }}>
            Secure Checkout
          </h5>
        </div>

        {/* Right: Help + Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <span
            style={{
              cursor: "default",
              userSelect: "none",
              fontWeight: 500,
              fontSize: 14,
              color: "#cbd5e1",
            }}
          >
            ❓ Help
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: 600,
              color: "#fff",
              userSelect: "none",
            }}
          >
            <img
              src={profileIcon}
              alt="Profile"
              width={32}
              height={32}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #334155",
              }}
            />
            <span>{customer.name || "Loading..."}</span>
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: 1200,
          margin: "auto",
          padding: "24px 20px",
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div
          style={{
            flex: "1 1 60%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              ...glassCardStyle,
              padding: 24,
              background: "rgba(20, 20, 20, 0.7)",
              borderRadius: 16,
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
              color: "#e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <h5
                style={{
                  margin: 0,
                  fontWeight: 700,
                  userSelect: "none",
                  fontSize: 18,
                  color: "#f1f5f9", 
                }}
                aria-label="Customer details"
              >
                👤 Customer Details
              </h5>

              <div
                role="button"
                aria-label="Go back to dashboard"
                onClick={() => navigate("/customer/dashboard")}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate("/customer/dashboard");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "30px",
                  border: "1.5px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                  color: "#e2e8f0",
                  fontWeight: 600,
                  cursor: "pointer",
                  userSelect: "none",
                  fontSize: 14,
                }}
              >
                <img
                  src={leftArrow}
                  alt="Back"
                  style={{
                    width: 16,
                    height: 16,
                    objectFit: "contain",
                    filter: "invert(0.8)",
                  }}
                />
                <span>Back</span>
              </div>
            </div>

            <p>
              <strong style={{ color: "#f1f5f9" }}>Name:</strong> {customer.name || "Loading..."}
            </p>
            <p>
              <strong style={{ color: "#f1f5f9" }}>Email:</strong> {customer.email || "Loading..."}
            </p>
            <p>
              <strong style={{ color: "#f1f5f9" }}>Contact:</strong> {customer.contactNumber || "Loading..."}
            </p>
          </div>



          <div
            style={{
              ...glassCardStyle,
              padding: 24,
              background: "rgba(20, 20, 20, 0.7)",
              borderRadius: 16,
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            <h5
              style={{
                marginBottom: 18,
                fontWeight: 700,
                fontSize: 18,
                color: "#e2e8f0",
              }}
            >
              🛒 Cart Items
            </h5>

            {Object.values(cartItems).length === 0 ? (
              <p style={{ color: "#cbd5e1" }}>Your cart is empty.</p>
            ) : (
              Object.values(cartItems).map(({ product, quantity }) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 15,
                    gap: 15,
                    padding: 12,
                    borderRadius: 10,
                    cursor: "default",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1.5px solid rgba(255, 255, 255, 0.15)",
                    userSelect: "none",
                  }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 8,
                      flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)", 
                    }}
                  />
                  <div
                    style={{
                      flexGrow: 1,
                      marginLeft: 10,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      color: "#e2e8f0",
                    }}
                  >
                    <h6
                      style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 600,
                        userSelect: "none",
                        color: "#f1f5f9",
                      }}
                    >
                      {product.name}
                    </h6>
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 5,
                          border: "1.5px solid rgba(255,255,255,0.3)",
                          borderRadius: 6,
                          padding: "2px 6px",
                          alignItems: "center",
                          background: "rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <button
                          aria-label={`Decrease quantity of ${product.name}`}
                          onClick={() => decreaseFromCart(product.id)}
                          style={{
                            border: "none",
                            backgroundColor: "#ff6b6b",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 16,
                            cursor: "pointer",
                            borderRadius: 4,
                            padding: "2px 10px",
                            userSelect: "none",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#e03e3e")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ff6b6b")
                          }
                        >
                          −
                        </button>
                        <button
                          disabled
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            padding: "2px 12px",
                            fontWeight: "600",
                            fontSize: 16,
                            cursor: "default",
                            userSelect: "none",
                            color: "#e2e8f0",
                          }}
                        >
                          {quantity}
                        </button>
                        <button
                          aria-label={`Increase quantity of ${product.name}`}
                          onClick={() => addToCart(product)}
                          style={{
                            border: "none",
                            backgroundColor: "#51cf66",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 16,
                            cursor: "pointer",
                            borderRadius: 4,
                            padding: "2px 10px",
                            userSelect: "none",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#2f9e3f")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#51cf66")
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        aria-label={`Remove ${product.name} from cart`}
                        onClick={() => removeFromCart(product.id)}
                        style={{
                          border: "none",
                          backgroundColor: "#6c757d",
                          color: "#fff",
                          fontWeight: "600",
                          padding: "6px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          userSelect: "none",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#495057")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#6c757d")
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      minWidth: 80,
                      textAlign: "right",
                      fontWeight: 600,
                      fontSize: 16,
                      userSelect: "none",
                      color: "#e2e8f0",
                    }}
                  >
                    ₹{(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ 
            ...glassCardStyle,
            padding: 24,
            background: "rgba(20, 20, 20, 0.7)",
            borderRadius: 16,
            backdropFilter: "blur(18px) saturate(180%)",
            WebkitBackdropFilter: "blur(18px) saturate(180%)",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",

          }}>

            <h5 
              style={{
                marginBottom: 18,
                fontWeight: 700,
                fontSize: 18,
                color: "#e2e8f0",
              }}>
              📦 Delivery Address
            </h5>

            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                marginBottom: 14,
                borderRadius: 8,
                border: "1.5px solid rgba(255,255,255,0.3)",
                background: "rgba(255, 255, 255, 0.15)",
                color: "#e2e8f0",
                fontSize: 15,
                outline: "none",
              }}
              aria-label="Street Address"
            />
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                marginBottom: 14,
                borderRadius: 8,
                border: "1.5px solid rgba(255,255,255,0.3)",
                background: "rgba(255, 255, 255, 0.15)",
                color: "#e2e8f0",
                fontSize: 15,
                outline: "none",
              }}
              aria-label="City"
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                marginBottom: 20,
                borderRadius: 8,
                border: "1.5px solid rgba(255,255,255,0.3)",
                background: "rgba(255, 255, 255, 0.15)",
                color: "#e2e8f0",
                fontSize: 15,
                outline: "none",
              }}
              aria-label="Zip Code"
            />
            <button
              onClick={() => {
                toast.success("Address added successfully! ✅", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              }}
              style={{
                width: "100%",
                padding: "10px 0",
                background: "#0ea5e9",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#0284c7")}
              onMouseLeave={(e) => (e.target.style.background = "#0ea5e9")}
            >
              ➕ Add Address
            </button>
          </div>
        </div>

        <div
          style={{
            flex: "1 1 35%",
            position: "sticky",
            top: 90,
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            
          }}
        >
          <div
            style={{
              padding: 24,
              background: "rgba(20, 20, 20, 0.7)",
              borderRadius: 16,
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              color: "#f1f5f9",
              background: "rgba(20, 20, 20, 0.7)"
            }}
            aria-label="Loyalty Program"
          >
            <h5
              style={{
                fontWeight: 700,
                marginBottom: 10,
                fontSize: 18,
                color: "#f1f5f9",
              }}
            >
              🎖️ Loyalty Program
            </h5>

            <p style={{ marginBottom: 6, fontSize: 15, color: "#e2e8f0" }}>
              Place <strong style={{ color: "#f8fafc" }}>7 orders</strong> and earn a special{" "}
              <strong style={{ color: "#f8fafc" }}>23–39% discount</strong> on the 7
              <sup>th</sup> order!
            </p>

            <p style={{ fontSize: 14, color: "#e2e8f0" }}>
              Your progress towards the next discount:
            </p>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((badge, index) => {
                const completed = index < ordersPlaced;
                return (
                  <div
                    key={index}
                    title={completed ? `Order ${badge} completed` : `Order ${badge} pending`}
                    aria-label={
                      completed
                        ? `Order ${badge} completed in loyalty program`
                        : `Order ${badge} pending in loyalty program`
                    }
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      backgroundColor: completed ? "#22c55e" : "rgba(255, 255, 255, 0.08)",
                      border: completed ? "2px solid #16a34a" : "1px solid rgba(255,255,255,0.1)",
                      color: completed ? "#fff" : "#cbd5e1",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: 16,
                      userSelect: "none",
                      transition: "background-color 0.3s ease",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {badge}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              ...glassCardStyle,
              maxHeight: 400,
              overflowY: "auto",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              background: "rgba(20, 20, 20, 0.7)",
              borderRadius: 16,
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
              color: "#e2e8f0",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            aria-label="Order Summary"
            className="order-summary-card"
          >
            <div
              style={{
                backgroundColor: "#0284c7",
                color: "#fff",
                padding: "12px 20px",
                fontWeight: "700",
                fontSize: 18,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                userSelect: "none",
              }}
            >
              🧾 Order Summary
            </div>

            <div style={{ padding: "20px" }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Subtotal:</strong> ₹{billing.subtotal.toFixed(2)}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>GST (18%):</strong> ₹{billing.gst.toFixed(2)}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Service Charge (7%):</strong> ₹{billing.serviceCharge.toFixed(2)}
              </p>

              {/* Offers Box */}
              <div
                onClick={() => setShowOfferPopup(true)}
                style={{
                  backgroundColor: "rgba(40,167,69,0.15)",
                  borderLeft: "6px solid #28a745",
                  padding: "12px 15px",
                  cursor: "pointer",
                  borderRadius: 8,
                  userSelect: "none",
                  marginBottom: 12,
                }}
                role="button"
                tabIndex={0}
                aria-label="View available offers"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setShowOfferPopup(true);
                }}
              >
                <strong style={{ color: "#28a745" }}>🎁 Available Offers</strong>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: "#28a745",
                    opacity: 0.9,
                  }}
                >
                  Click to view and apply offers
                </p>
              </div>

              {selectedOfferCode && discountAmount > 0 && (
                <p
                  style={{
                    color: "#22c55e",
                    fontWeight: "600",
                    marginBottom: 12,
                  }}
                  title={`Discount: ₹${discountAmount.toFixed(2)} (${offers.find((o) => o.code === selectedOfferCode)?.discountPercent}% off)`}
                >
                  ✅ {selectedOfferCode} applied — Discount: -₹ {discountAmount.toFixed(2)}
                </p>
              )}

              {promoCodeError && (
                <p
                  style={{
                    color: "#ef4444",
                    fontWeight: "600",
                    marginBottom: 12,
                  }}
                >
                  ⚠️ {promoCodeError}
                </p>
              )}

              {/* Promo Code Input */}
              <div style={{ marginBottom: 12 }}>
                <label htmlFor="promoCodeInput" style={{ fontWeight: "600", color: "#e2e8f0" }}>
                  Have a promo code?
                </label>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <input
                    id="promoCodeInput"
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    style={{
                      flexGrow: 1,
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "#e2e8f0",
                      fontSize: 15,
                      textTransform: "uppercase",
                      outline: "none",
                    }}
                    aria-label="Promo code input"
                  />
                  <button
                    onClick={handleApplyPromoCode}
                    disabled={!promoCodeInput.trim()}
                    style={{
                      backgroundColor: promoCodeInput.trim() ? "#0ea5e9" : "#6c757d",
                      border: "none",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: 6,
                      cursor: promoCodeInput.trim() ? "pointer" : "not-allowed",
                      fontWeight: "600",
                      transition: "background-color 0.3s ease",
                    }}
                    aria-disabled={!promoCodeInput.trim()}
                    aria-label="Apply promo code"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <p style={{ marginBottom: 12, userSelect: "none" }}>
                <strong>Tip:</strong> ₹{tipAmount.toFixed(2)}{" "}
                <button
                  onClick={() => setShowTipModal(true)}
                  style={{
                    border: "1.5px solid #0d6efd",
                    backgroundColor: "transparent",
                    color: "#0d6efd",
                    padding: "5px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: "600",
                    userSelect: "none",
                  }}
                  aria-label="Add tip"
                >
                  Add Tip
                </button>
              </p>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #ccc",
                  margin: "15px 0",
                }}
              />

              {/* Total */}
              <p
                style={{
                  fontWeight: "700",
                  fontSize: 22,
                  marginBottom: 15,
                  userSelect: "none",
                }}
                aria-live="polite"
              >
                Total: ₹{(billing.total + tipAmount - discountAmount).toFixed(2)}
              </p>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  backgroundColor: isPlacingOrder ? "#6c757d" : "#198754",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 18,
                  border: "none",
                  borderRadius: 8,
                  cursor: isPlacingOrder ? "not-allowed" : "pointer",
                  userSelect: "none",
                  transition: "background-color 0.3s ease",
                }}
                aria-disabled={isPlacingOrder}
                aria-label="Place order"
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>

              {/* Order Status */}
              {orderStatus && (
                <p
                  style={{
                    marginTop: 15,
                    fontWeight: "600",
                    userSelect: "none",
                    color:
                      orderStatus.toLowerCase() === "delivered"
                        ? "#198754"
                        : orderStatus.toLowerCase() === "pending"
                        ? "#ffc107"
                        : "#dc3545",
                  }}
                  aria-live="polite"
                >
                  <strong>Order Status:</strong> {orderStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Offers Modal */}
      {showOfferPopup && (
        <div
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={() => setShowOfferPopup(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              maxHeight: "80vh",
              width: 400,
              overflowY: "auto",
              boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <h5 style={{ margin: 0, fontWeight: 700 }}>Available Offers</h5>
              <button
                onClick={() => setShowOfferPopup(false)}
                aria-label="Close offer popup"
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                  fontWeight: "700",
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              {offers.length === 0 ? (
                <p>No offers available at the moment.</p>
              ) : (
                offers.map((offer) => {
                  const isDisabled = billing.subtotal < offer.minOrderAmount;
                  const isSelected = selectedOfferCode === offer.code;
                  return (
                    <div
                      key={offer.code}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedOfferCode(offer.code);
                          setPromoCodeError("");
                          setShowOfferPopup(false);
                        } else {
                          setPromoCodeError(
                            `Offer requires minimum order ₹${offer.minOrderAmount}`
                          );
                          toast.warning(
                            `Offer requires minimum order ₹${offer.minOrderAmount}`
                          );
                        }
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          if (!isDisabled) {
                            setSelectedOfferCode(offer.code);
                            setPromoCodeError("");
                            setShowOfferPopup(false);
                          } else {
                            setPromoCodeError(
                              `Offer requires minimum order ₹${offer.minOrderAmount}`
                            );
                            toast.warning(
                              `Offer requires minimum order ₹${offer.minOrderAmount}`
                            );
                          }
                        }
                      }}
                      role="button"
                      aria-disabled={isDisabled}
                      aria-pressed={isSelected}
                      style={{
                        padding: 15,
                        borderRadius: 10,
                        backgroundColor: isSelected
                          ? "#0d6efd"
                          : isDisabled
                          ? "#f8d7da"
                          : "#d1e7dd",
                        color: isSelected
                          ? "#fff"
                          : isDisabled
                          ? "#842029"
                          : "#0f5132",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        userSelect: "none",
                        boxShadow: isSelected
                          ? "0 0 12px #0d6efdaa"
                          : "none",
                        transition: "background-color 0.3s ease, color 0.3s ease",
                        outline: "none",
                      }}
                    >
                      <strong>{offer.code}</strong> — {offer.description} (
                      {offer.discountPercent}% off)
                      <br />
                      <small>
                        Min order: ₹{offer.minOrderAmount} | Valid till:{" "}
                        {new Date(offer.expiryDate).toLocaleDateString()}
                      </small>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tip Modal */}
      {showTipModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tipModalLabel"
          tabIndex={-1}
          onClick={() => setShowTipModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              width: 320,
              boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: 15,
            }}
          >
            <h5
              id="tipModalLabel"
              style={{ margin: 0, fontWeight: 700, userSelect: "none" }}
            >
              Add a Tip
            </h5>
            {[0, 10, 20, 30, 50].map((tip) => (
              <button
                key={tip}
                onClick={() => handleAddTip(tip)}
                style={{
                  padding: "10px 0",
                  fontWeight: tipAmount === tip ? "700" : "600",
                  fontSize: 16,
                  borderRadius: 8,
                  border: tipAmount === tip ? "2px solid #198754" : "1.5px solid #ccc",
                  backgroundColor: tipAmount === tip ? "#d1e7dd" : "transparent",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "all 0.3s ease",
                }}
                aria-pressed={tipAmount === tip}
                aria-label={`Add tip ₹${tip}`}
              >
                ₹{tip}
              </button>
            ))}
            <button
              onClick={() => setShowTipModal(false)}
              style={{
                marginTop: 10,
                padding: "10px 0",
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 8,
                border: "none",
                backgroundColor: "#dc3545",
                color: "#fff",
                cursor: "pointer",
                userSelect: "none",
                transition: "background-color 0.3s ease",
              }}
              aria-label="Close tip modal"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CartPage;
