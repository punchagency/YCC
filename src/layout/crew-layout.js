import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../components/header";
import LeftMenu from "../components/menu";
import ChatbotDashboard from "../components/chatbot/chatbot-dashboard";
import { DashboardAIProvider } from "../context/AIAssistant/dashboardAIContext";
import { BookingProvider } from "../context/booking/bookingContext";
import { ServiceProvider } from "../context/service/serviceContext";
import { ToastProvider } from "../context/toast/toastContext";
import { ThemeProvider } from "../context/theme/themeContext";
import { TransactionProvider } from "../context/transaction/transactionContext";
import { OrderProvider } from "../context/order/orderContext";
import { InvoiceProvider } from "../context/invoice/invoiceContext";
import { InventoryProvider } from "../context/inventory/inventoryContext";
import { CalendarProvider } from "../context/calendar/calendarContext";
import { SupplierProvider } from "../context/supplier/supplierContext";

const MainContentHeader = ({ title }) => {
  return (
    <div className="main-content-header">
      <div className="main-content-header-left">
        <h2>{title}</h2>
      </div>
      <div className="main-content-header-right">
        {/* Add any header actions here */}
      </div>
    </div>
  );
};

const CrewLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    const route = path.split('/').pop();
    
    // Convert route to title case and replace hyphens with spaces
    return route
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Calculate sidebar width for margin
  const sidebarWidth = isCollapsed ? 80 : 250;

  return (
    <ThemeProvider>
      <ToastProvider>
        <SupplierProvider>
          <TransactionProvider>
            <DashboardAIProvider>
              <InventoryProvider>
                <OrderProvider>
                  <InvoiceProvider>
                    <BookingProvider>
                      <ServiceProvider>
                        <CalendarProvider>
                          <div className="wrapper">
                            {/* Sidebar */}
                            <LeftMenu
                              role="crew_member"
                              isCollapsed={isCollapsed}
                              setIsCollapsed={setIsCollapsed}
                            />
                            {/* Main Content Area (to the right of sidebar) */}
                            <div
                              className="right-panel-component"
                              style={{ marginLeft: sidebarWidth }}
                            >
                              {/* Top Bar (inside main content only) */}
                              <AdminHeader
                                isCollapsed={isCollapsed}
                                setIsCollapsed={setIsCollapsed}
                                role="crew_member"
                              />
                              {/* Main Content Header */}
                              <MainContentHeader title={getPageTitle()} />
                              {/* Page Content */}
                              <div className="main-content">
                                <Outlet />
                              </div>
                              {/* Chatbot */}
                              <ChatbotDashboard />
                            </div>
                          </div>
                        </CalendarProvider>
                      </ServiceProvider>
                    </BookingProvider>
                  </InvoiceProvider>
                </OrderProvider>
              </InventoryProvider>
            </DashboardAIProvider>
          </TransactionProvider>
        </SupplierProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default CrewLayout;
