import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Lottie from "lottie-react";
import confirmAnimation from "../../assets/images/confirm.json";


import plusIcon from '../../assets/images/plus.png';
import scanIcon from '../../assets/images/scan.png';
import cardIcon from '../../assets/images/card.png';
import cashIcon from '../../assets/images/cash.png';
import bankIcon from '../../assets/images/bank.png';
import purseIcon from '../../assets/images/purse.png';
<link
  href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Exo+2:wght@700&family=Pacifico&display=swap"
  rel="stylesheet"
/>

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderDetails = location.state?.orderDetails;
  const itemCount = orderDetails?.itemCount || 0;

  const [paymentMode, setPaymentMode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);


  const UPI_ID = "abhipawar762-2@okhdfcbank";

  if (!orderDetails) {
    return <div className="text-center mt-5 text-danger">Error: No order details found.</div>;
  }

  const totalAmount = orderDetails?.total ?? 0;
  const formattedTotal = totalAmount.toFixed(2);
  const upiPaymentUrl = `upi://pay?pa=${UPI_ID}&pn=YourCafeName&am=${formattedTotal}&cu=INR&tn=Order+Payment`;

  const openModal = (mode) => {
    setPaymentMode(mode);
    setTransactionId('');
    setMessage('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const validateForm = () => {
    if (!paymentMode) {
      alert('Please select a payment method');
      return false;
    }

    if (
      !orderDetails.customerName ||
      !orderDetails.contactNumber ||
      !orderDetails.email
    ) {
      alert('Incomplete customer details. Please check your order information.');
      return false;
    }
    if (paymentMode === 'UPI ID' && !transactionId.trim()) {
      alert('Please enter the transaction ID after completing payment.');
      return false;
    }
    if (
      (paymentMode === 'Card' || paymentMode === 'Netbanking' || paymentMode === 'Wallets') &&
      !transactionId.trim()
    ) {
      setTransactionId('TXN' + Math.floor(100000 + Math.random() * 900000));
    }

    return true;
  };

  const handleConfirmPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    const payload = {
      customerName: orderDetails.customerName,
      contactNumber: orderDetails.contactNumber,
      email: orderDetails.email,
      totalAmount: Number(totalAmount.toFixed(2)),
      tax: Number((orderDetails.gst ?? 0).toFixed(2)),
      serviceCharge: Number((orderDetails.serviceCharge ?? 0).toFixed(2)),
      paymentMode,
      paymentStatus: paymentMode === 'Pay on Delivery' ? 'Pending' : 'Success',
      transactionId: transactionId.trim() || '',
    };

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8082/order/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Order placed successfully!');
        setShowSuccessAnimation(true);
        setTimeout(() => {
          navigate('/customer/dashboard');
          setShowSuccessAnimation(false);
        }, 4000);
      } else {
        setMessage(data.message || 'Failed to place order.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const PaymentOption = ({ icon, label, onClick, active }) => (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        padding: 15,
        boxShadow: '0 0 8px rgba(0,0,0,0.1)',
        borderRadius: 8,
        backgroundColor: active ? '#cce5ff' : 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        userSelect: 'none',
      }}
    >
      <img src={icon} alt={`${label} icon`} style={{ width: 28, height: 28, objectFit: 'contain' }} />
      <span style={{ fontWeight: '600' }}>{label}</span>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#e9ecee', minHeight: '100vh', padding: 20 }}>
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 style={{ fontWeight: 'bold' }}>Payment Options</h3>
          <span style={{ fontSize: '1rem' }}>To pay: ₹{formattedTotal}</span>
        </div>

        <div
          className="alert alert-success d-flex justify-content-between align-items-center rounded shadow-sm"
          role="alert"
        >
          <span>Save up to ₹40 more with payment offers</span>
          <span style={{ fontWeight: 'bold' }}>→</span>
        </div>

        <div className="card shadow p-4 mt-3" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="d-flex justify-content-start mb-3">
            <button className="btn btn-light" onClick={() => navigate('/customer/cart')}>
              ← Back to Cart
            </button>
          </div>

          <div className="mb-3 fw-semibold">
            Items: {itemCount} | Total: ₹{formattedTotal}
          </div>

          <div className="card p-3 mb-3" style={{ backgroundColor: '#e9ecee' }}>
            <h5 className="mb-4">Select Payment Method</h5>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                justifyContent: 'space-between',
              }}
            >

              <h6
                className="fw-bold"
                style={{
                  fontSize: '0.95rem',
                  color: '#000',
                  marginTop: '4px',
                  fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 700,
                }}
              >
                Scan QR to Pay
              </h6>

              <div
                onClick={() => openModal('UPI QR')}
                style={{
                  cursor: 'pointer',
                  padding: 15,
                  boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                  borderRadius: 8,
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  userSelect: 'none',
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <img
                    src={scanIcon}
                    alt="Qr scan icon"
                    style={{
                      width: 28,
                      height: 28,
                      objectFit: 'contain',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#FF5F1F',
                      fontSize: '1rem',
                      lineHeight: 1.2,
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    UPI QR Code
                  </span>
                  <small
                    style={{
                      color: '#28282B',
                      fontSize: '0.8rem',
                      lineHeight: 1.7,
                      fontWeight: 700,
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    Scan to Pay
                  </small>
                </div>
              </div>

              <h6
                className="fw-bold"
                style={{
                  fontSize: '0.95rem',
                  color: '#000',
                  marginTop: '4px',
                  fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 700,
                }}
              >
                Pay by any UPI ID
              </h6>

              <div
                onClick={() => openModal('UPI ID')}
                style={{
                  cursor: 'pointer',
                  padding: 15,
                  boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                  borderRadius: 8,
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  userSelect: 'none',
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <img
                    src={plusIcon}
                    alt="UPI ID icon"
                    style={{
                      width: 28,
                      height: 28,
                      objectFit: 'contain',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#FF5F1F',
                      fontSize: '1rem',
                      lineHeight: 1.2,
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    Add New UPI ID
                  </span>
                  <small
                    style={{
                      color: '#28282B',
                      fontSize: '0.8rem',
                      lineHeight: 1.7,
                      fontWeight: 700,
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    You need to have a registered UPI ID
                  </small>
                </div>
              </div>

              
              <h6
                className="fw-bold"
                style={{
                  fontSize: '0.95rem',
                  color: '#000',
                  marginTop: '4px',
                  fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 700,
                }}
              >
                Credit & Debit Cards
              </h6>

              <div
                onClick={() => openModal('Card')}
                style={{
                  cursor: 'pointer',
                  padding: 15,
                  boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                  borderRadius: 8,
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  userSelect: 'none',
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <img
                    src={cardIcon}
                    alt="card icon"
                    style={{
                      width: 32,
                      height: 32,
                      objectFit: 'contain',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#FF5F1F',
                      fontSize: '1rem',
                      lineHeight: 1.2,
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    Add New Card
                  </span>
                  <small
                    style={{
                      color: '#28282B',
                      fontSize: '0.8rem',
                      lineHeight: 1.7,
                      fontWeight: 700,
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    Save and Pay via Cards
                  </small>
                </div>
              </div>

              
              <h6
                className="fw-bold"
                style={{
                  fontSize: '0.95rem',
                  color: '#000',             // Black color
                  marginTop: '12px',         // Close to card (adjust as needed)
                  marginBottom: '6px',
                  fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 700,
                }}
              >
                More Payment Options
              </h6>

              {/* More Payment Options Card */}
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  overflow: 'hidden',
                  userSelect: 'none',
                  backgroundColor: '#fff',
                }}
              >
                {/* Wallets */}
                <div
                  onClick={() => openModal('Wallets')}
                  style={{
                    padding: '15px 20px',
                    backgroundColor:'white',
                    cursor: 'pointer',
                    borderBottom: '1px dotted #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <img src={purseIcon} alt="Wallets icon" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontFamily: "'Exo 2', sans-serif",
                        color: '#FF5F1F',
                        fontSize: '1rem',
                        lineHeight: 1.2,
                      }}
                    >
                      Wallets
                    </span>
                    <small
                      style={{
                        color: '#28282B',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        fontFamily: "'Exo 2', sans-serif",
                        lineHeight: 1.5,
                      }}
                    >
                      PhonePe, Amazon Pay & more
                    </small>
                  </div>
                </div>

                {/* Netbanking */}
                <div
                  onClick={() => openModal('Netbanking')}
                  style={{
                    padding: '15px 20px',
                    backgroundColor:'white',
                    cursor: 'pointer',
                    borderBottom: '1px dotted #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <img src={bankIcon} alt="Netbanking icon" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontFamily: "'Exo 2', sans-serif",
                        color: '#FF5F1F',
                        fontSize: '1rem',
                        lineHeight: 1.2,
                      }}
                    >
                      Netbanking
                    </span>
                    <small
                      style={{
                        color: '#28282B',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        fontFamily: "'Exo 2', sans-serif",
                        lineHeight: 1.5,
                      }}
                    >
                      Select from a list of banks
                    </small>
                  </div>
                </div>

                {/* Pay on Delivery */}
                <div
                  onClick={() => openModal('Pay on Delivery')}
                  style={{
                    padding: '15px 20px',
                    backgroundColor:'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <img src={cashIcon} alt="Pay on Delivery icon" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontFamily: "'Exo 2', sans-serif",
                        color: '#FF5F1F',
                        fontSize: '1rem',
                        lineHeight: 1.2,
                      }}
                    >
                      Pay on Delivery
                    </span>
                    <small
                      style={{
                        color: '#28282B',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        fontFamily: "'Exo 2', sans-serif",
                        lineHeight: 1.5,
                      }}
                    >
                      Pay in cash or pay online
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {modalOpen && (
            <div
              className="modal-backdrop"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1050,
              }}
              onClick={closeModal}
            >
              <div
                className="modal-content p-4"
                style={{ backgroundColor: 'white', borderRadius: 8, width: '90%', maxWidth: 450 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>{paymentMode} Payment</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={closeModal}>
                    X
                  </button>
                </div> */}

                {paymentMode === 'UPI QR' && (
                  <div style={{ padding: '1rem 0', textAlign: 'center' }}>
                    <QRCodeSVG
                      value={upiPaymentUrl}
                      size={220}
                      style={{
                        border: '4px solid #FF5F1F',
                        borderRadius: 12,
                        padding: 8,
                        backgroundColor: '#fff',
                        boxShadow: '0 6px 18px rgba(255, 95, 31, 0.35)',
                        transition: 'box-shadow 0.3s ease',
                      }}
                    />
                    <p
                      style={{
                        marginTop: 24,
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        color: '#222',
                        fontFamily: "'Exo 2', sans-serif",
                        letterSpacing: '0.03em',
                      }}
                    >
                      Scan this QR code with your UPI app to pay ₹{formattedTotal}
                    </p>
                    <p
                      style={{
                        marginTop: 8,
                        fontSize: '0.9rem',
                        color: '#444',
                        fontWeight: '500',
                      }}
                    >
                      UPI ID: <strong>{UPI_ID}</strong>
                    </p>
                  </div>
                )}

                {paymentMode === 'UPI ID' && (
                  <div>
                    <h6
                      style={{
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        color: '#222',
                        fontFamily: "'Exo 2', sans-serif",
                        letterSpacing: '0.03em',
                      }}
                    >
                      Add New UPI ID
                    </h6>

                    <p
                      style={{
                        marginBottom: '1rem',
                        fontSize: '0.85rem',
                        color: '#444',
                        fontWeight: '500',
                      }}
                    >
                      To pay ₹{formattedTotal}
                    </p>

                    <hr
                      style={{
                        border: 'none',
                        borderTop: '1.5px solid #ddd',
                        marginBottom: '1.8rem',
                      }}
                    />

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your UPI ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      style={{
                        padding: '14px 18px',
                        fontSize: '1.05rem',
                        borderRadius: '8px',
                        border: '1.8px solid #bbb',
                        marginBottom: '1.2rem',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'border-color 0.3s ease',
                      }}
                      onFocus={e => e.target.style.borderColor = '#FF5F1F'}
                      onBlur={e => e.target.style.borderColor = '#bbb'}
                    />
                    <div className="form-check" style={{ userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="saveUpiIdCheckbox"
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="saveUpiIdCheckbox"
                        style={{ cursor: 'pointer', color: '#555', fontWeight: '500', fontSize: '0.9rem' }}
                      >
                        Save UPI ID for future use
                      </label>
                    </div>
                  </div>
                )}

                {paymentMode === 'Card' && (
                  <div>
                    <h6
                      style={{
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        color: '#000000',
                        fontSize: '1.1rem',
                      }}
                    >
                      Add New Card
                    </h6>
                    <p
                      style={{
                        marginBottom: '0.3rem',
                        fontSize: '0.85rem',
                        color: '#555',
                      }}
                    >
                      To pay ₹{formattedTotal}
                    </p>
                    <hr style={{ borderTop: '1px solid #000', marginBottom: '1.5rem' }} />

                    {/* Section 1: Card Number */}
                    <div className="mb-3">
                      <input
                        type="text"
                        id="cardNumber"
                        className="form-control"
                        placeholder="Card Number"
                        style={{
                          padding: '12px 15px',
                          fontSize: '1rem',
                          borderRadius: '6px',
                          border: '1.5px solid #ccc',
                          color: '#333',
                        }}
                      />
                    </div>

                    {/* Section 2 & 3 side by side */}
                    <div className="d-flex gap-3 mb-3">
                      {/* Valid Through */}
                      <input
                        type="text"
                        id="validThrough"
                        className="form-control"
                        placeholder="Valid Through (MM/YY)"
                        style={{
                          padding: '12px 15px',
                          fontSize: '1rem',
                          borderRadius: '6px',
                          border: '1.5px solid #ccc',
                          color: '#333',
                          flex: 1,
                        }}
                      />

                      {/* Name on Card */}
                      <input
                        type="text"
                        id="nameOnCard"
                        className="form-control"
                        placeholder="Name on Card"
                        style={{
                          padding: '12px 15px',
                          fontSize: '1rem',
                          borderRadius: '6px',
                          border: '1.5px solid #ccc',
                          color: '#333',
                          flex: 1,
                        }}
                      />
                    </div>

                    {/* Section 4: Card Nickname */}
                    <div className="mb-3">
                      <input
                        type="text"
                        id="cardNickname"
                        className="form-control"
                        placeholder="Card Nickname (for easy identification)"
                        style={{
                          padding: '12px 15px',
                          fontSize: '1rem',
                          borderRadius: '6px',
                          border: '1.5px solid #ccc',
                          color: '#333',
                        }}
                      />
                    </div>

                    {/* Checkbox: Secure this card */}
                    <div className="form-check" style={{ marginTop: '0.8rem' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="secureCardCheckbox"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="secureCardCheckbox"
                        style={{ fontWeight: '500', color: '#333' }}
                      >
                        Secure this card
                      </label>
                    </div>
                  </div>
                )}

                {paymentMode === 'Wallets' && (
                  <div>
                    {/* Header */}
                    <h6
                      style={{
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        color: '#000000',
                        fontSize: '1.1rem',
                      }}
                    >
                      Select Wallet
                    </h6>

                    {/* Price info */}
                    <p
                      style={{
                        marginBottom: '0.3rem',
                        fontSize: '0.85rem',
                        color: '#555',
                      }}
                    >
                      To pay ₹{formattedTotal}
                    </p>

                    {/* Underline */}
                    <hr
                      style={{
                        borderTop: '1px solid #000',
                        marginBottom: '1.5rem',
                      }}
                    />

                    {/* Wallet Cards */}
                    {[
                      { name: 'Google Pay', img: 'google-pay.png' },
                      { name: 'PhonePe', img: 'phonepe.png' },
                      { name: 'Amazon Pay', img: 'amazon-pay.png' },
                    ].map((wallet, index) => (
                      <div
                        key={wallet.name}
                        className="d-flex align-items-center mb-3"
                        style={{
                          border: '1.5px solid #ccc',
                          borderRadius: '12px',
                          padding: '15px',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                          cursor: 'pointer',
                          transition: 'transform 0.1s ease-in-out',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <img
                          src={require(`../../assets/images/${wallet.img}`)}
                          alt={wallet.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            marginRight: '15px',
                            objectFit: 'contain',
                          }}
                        />
                        <div
                          style={{
                            fontSize: '1rem',
                            fontWeight: '500',
                            color: '#333',
                          }}
                        >
                          {wallet.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {paymentMode === 'Netbanking' && (
                  <div
                    style={{
                      maxHeight: '400px',
                      overflowY: 'auto',
                      paddingRight: '10px',
                      fontFamily: "'Exo 2', sans-serif",
                      backgroundColor: '#fff',
                    }}
                  >
                    {/* Header */}
                    <h6
                      className="fw-bold"
                      style={{
                        fontSize: '0.95rem',
                        color: '#000',
                        marginTop: '4px',
                        marginBottom: '1rem',
                        fontWeight: 700,
                      }}
                    >
                      Netbanking Payment
                    </h6>

                    {/* Price Info */}
                    <p
                      style={{
                        marginBottom: '1rem',
                        fontSize: '0.85rem',
                        color: '#555',
                        fontWeight: 600,
                      }}
                    >
                      To pay ₹{formattedTotal}
                    </p>

                    <hr style={{ borderTop: '1px solid #000', marginBottom: '1.5rem' }} />

                    {/* Popular Banks Card */}
                    <div
                      style={{
                        boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                        borderRadius: 8,
                        backgroundColor: 'white',
                        padding: 15,
                        marginBottom: '1.5rem',
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 700,
                          color: '#333',
                          marginBottom: '1rem',
                          fontSize: '1rem',
                        }}
                      >
                        Popular Banks
                      </p>
                      <div
                        className="d-flex flex-wrap gap-3"
                        style={{ userSelect: 'none' }}
                      >
                        {['SBI', 'HDFC', 'ICICI', 'Axis'].map((bank) => (
                          <div
                            key={bank}
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                              borderRadius: 8,
                              padding: '12px 20px',
                              flex: '1 1 40%',
                              minWidth: 150,
                              cursor: 'pointer',
                              fontWeight: 700,
                              color: '#FF5F1F',
                              fontSize: '1rem',
                              transition: 'background-color 0.2s ease',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = '#FFF0E6')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = 'white')
                            }
                          >
                            {bank}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All Banks Card */}
                    <div
                      style={{
                        boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                        borderRadius: 8,
                        backgroundColor: 'white',
                        padding: 15,
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 700,
                          color: '#333',
                          marginBottom: '1rem',
                          fontSize: '1rem',
                        }}
                      >
                        All Banks
                      </p>
                      <div
                        className="d-flex flex-wrap gap-3"
                        style={{ userSelect: 'none' }}
                      >
                        {[
                          'State Bank of India',
                          'HDFC Bank',
                          'ICICI Bank',
                          'Axis Bank',
                          'Punjab National Bank',
                          'Canara Bank',
                          'Bank of Baroda',
                          'Yes Bank',
                          'Kotak Mahindra Bank',
                          'IDFC First Bank',
                          'Union Bank of India',
                          'IndusInd Bank',
                          'Indian Bank',
                          'Central Bank of India',
                          'UCO Bank',
                        ].map((bank) => (
                          <div
                            key={bank}
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                              borderRadius: 8,
                              padding: '12px 20px',
                              flex: '1 1 45%',
                              minWidth: 180,
                              cursor: 'pointer',
                              fontWeight: 700,
                              color: '#FF5F1F',
                              fontSize: '1rem',
                              transition: 'background-color 0.2s ease',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = '#FFF0E6')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = 'white')
                            }
                          >
                            {bank}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMode === 'Pay on Delivery' && (
                  <div style={{ fontFamily: "'Exo 2', sans-serif", maxWidth: '400px' }}>
                    {/* Heading */}
                    <h6
                      style={{
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        color: '#000',
                        marginBottom: '0.2rem',
                      }}
                    >
                      Pay on Delivery
                    </h6>

                    {/* To pay amount with full-width underline */}
                    <div
                      style={{
                        borderBottom: '1px solid #000',
                        paddingBottom: '0.25rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <p
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          color: '#555',
                          margin: 0,
                        }}
                      >
                        To pay ₹{formattedTotal}
                      </p>
                    </div>

                    {/* Payment option card */}
                    <div
                      style={{
                        border: '1.5px solid #ccc',
                        borderRadius: '12px',
                        padding: '15px',
                        marginBottom: '1.5rem',
                        backgroundColor: '#fff',
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: '#333',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Pay on Delivery (cash/upi)
                      </p>
                      <small
                        style={{
                          color: '#333',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                        }}
                      >
                        Pay in cash or ask for QR code
                      </small>
                    </div>
                  </div>
                )}
                <div
                  className="mt-4"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                  }}
                >
                  <button
                    className="btn btn-secondary"
                    onClick={closeModal}
                    style={{ minWidth: '120px' }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn"
                    onClick={closeModal}
                    disabled={loading}
                    style={{
                      backgroundColor: '#FF5F1F',
                      color: 'white',
                      fontWeight: '600',
                      minWidth: '120px',
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {transactionId && paymentMode !== 'UPI QR' && (
            <div className="mt-3">
              <strong>Transaction ID:</strong> {transactionId}
            </div>
          )}

          <button
            className="btn btn-success w-100 mt-4"
            onClick={handleConfirmPayment}
            disabled={loading || showSuccessAnimation}
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>

          {message && !showSuccessAnimation && (
            <div className="alert alert-info mt-3 text-center">
              {message}
            </div>
          )}

          {showSuccessAnimation && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Lottie
                animationData={confirmAnimation}
                loop={false}
                style={{ width: 300, height: 300 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
