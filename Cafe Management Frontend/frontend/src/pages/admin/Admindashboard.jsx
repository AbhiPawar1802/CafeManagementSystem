import React from "react";

import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";
import ProductSection from "../../components/ProductSection";
import ChefManagement from "../../components/ChefManagement";
import OrderManagement from "../../components/OrderManagement";
import AdminOffer from "../../components/AdminOfferPage";
import AdminReservation from "../../components/AdminReservation";

const Admindashboard = () => {
  return (
    <>
      <AdminHeader />

      <div style={{ marginTop: "60px" }}>
        <ChefManagement />
        <ProductSection />
        <OrderManagement />
        <AdminOffer />
        <AdminReservation />
      </div>

      <AdminFooter />
    </>
  );
};

export default Admindashboard;
