import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/header";
import LeftMenu from "../components/menu";
import { useState } from "react";
import ChatbotDashboard from "../components/chatbot/chatbot-dashboard";
import { DashboardAIProvider } from "../context/AIAssistant/dashboardAIContext";
import { BookingProvider } from "../context/booking/bookingContext";
const Layout = ({ role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <DashboardAIProvider>
      <BookingProvider>
        <main className="flex page relative wrapper">
          <LeftMenu
            role={role}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div className="w-full right-panel-component overflow-x-hidden">
        <AdminHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          role={role}
        />
        <Outlet />

        <ChatbotDashboard />
      </div>
    </main>
    </BookingProvider>
    </DashboardAIProvider>
  );
};

export default Layout;
