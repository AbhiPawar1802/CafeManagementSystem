import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from './pages/customer/Dashboard';
import ForgotPassword from './pages/customer/ForgotPassword';
import CustomerRegister from './pages/auth/CustomerRegister';
import AdminRegister from './pages/auth/AdminRegister';
import AdminDashboard from './pages/admin/Admindashboard';
import CartPage from './pages/customer/CartPage';
import PaymentPage from './pages/customer/PaymentPage';
import OfferPage from './components/OfferPage';
import FavoritesPage from './components/FavoritesPage';
import LoginPage from './pages/auth/LoginPage';
import ProfilePage from './components/Profile';

import { CartProvider } from './components/CartContext';
import LoadingOverlay from './components/LoadingOverlay';
import ProductManagement from './components/ProductSection';
import ChefManagement from './components/ChefManagement';
import OrderManagement from './components/OrderManagement';
import AdminReservation from './components/AdminReservation';
import ManageCustomer from './components/ManageCustomer';
import ManageAdmin from './components/ManageAdmin';

import AdminLayout from './components/AdminLayout';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');

  const isAuthenticated = !!token;
  const isAdmin = role === 'ADMIN';

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <CartProvider>
      {loading && <LoadingOverlay />}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              isAdmin ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/customer/dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Customer Routes */}
        <Route
          path="/customer/dashboard"
          element={isAuthenticated && !isAdmin ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/customer/cart"
          element={isAuthenticated && !isAdmin ? <CartPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/customer/payment"
          element={isAuthenticated && !isAdmin ? <PaymentPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/customer/offers"
          element={isAuthenticated && !isAdmin ? <OfferPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/customer/favorite"
          element={isAuthenticated && !isAdmin ? <FavoritesPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/customer/profile"
          element={isAuthenticated && !isAdmin ? <ProfilePage /> : <Navigate to="/login" />}
        />


        {isAuthenticated && isAdmin ? (
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="product" element={<ProductManagement />} />
            <Route path="chef" element={<ChefManagement />} />
            <Route path="order" element={<OrderManagement />} />
            <Route path="reservation" element={<AdminReservation />} />
            <Route path="customer" element={<ManageCustomer />} />
            <Route path="manageadmin" element={<ManageAdmin />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </CartProvider>
  );
};

export default App;
