import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/header";
import LeftMenu from "../components/menu";
import { useState } from "react";
import ChatbotDashboard from "../components/chatbot/chatbot-dashboard";
import { DashboardAIProvider } from "../context/AIAssistant/dashboardAIContext";
const Layout = ({ role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <DashboardAIProvider>
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
    </DashboardAIProvider>
  );
};

export default Layout;
