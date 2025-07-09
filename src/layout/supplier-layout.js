import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import DashboardTitleBar from "../components/dashboard/title-bar";
import LeftMenu from "../components/menu";
import AdminHeader from "../components/header";

const SupplierLayout = () => {
  const [pageTitle, setPageTitle] = useState("Dashboard");
  // Optionally, you can add backArrow logic if needed

  // Memoize setPageTitle to avoid unnecessary re-renders
  const handleSetPageTitle = useCallback((title) => {
    setPageTitle(title);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <LeftMenu />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />
        <DashboardTitleBar title={pageTitle} />
        <div style={{ flex: 1, padding: "24px 0" }}>
          <Outlet context={{ setPageTitle: handleSetPageTitle }} />
        </div>
      </div>
    </div>
  );
};

export default SupplierLayout;
