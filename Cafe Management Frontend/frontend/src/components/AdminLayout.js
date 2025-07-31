import React from "react";
import AdminHeader from "./AdminHeader";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />
      <main style={{ paddingTop: "60px",}}>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
