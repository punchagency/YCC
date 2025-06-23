import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/header";
import LeftMenu from "../components/menu";
import { useState } from "react";
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
import "../styles/layout.css";
import { useMediaQuery } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";

const AdminLayout = ({ role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const muiTheme = useMuiTheme();

  // iPad Pro detection (1024 x 1366) - use mobile nav, no left panel
  const isIpadPro = useMediaQuery(
    "(min-width: 1024px) and (max-width: 1024px) and (min-height: 1366px)"
  );

  // General tablet detection (excluding Nest Hub)
  const isTablet = useMediaQuery(
    "(min-width:600px) and (max-width:1200px) and (max-height:1365px)"
  );

  // Nest Hub detection (1024 x 600) - keep left panel
  const isNestHub = useMediaQuery(
    "(min-width: 1024px) and (max-width: 1024px) and (max-height: 600px)"
  );

  // Hide left panel for tablets except Nest Hub
  const shouldHideLeftPanel = (isTablet || isIpadPro) && !isNestHub;

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
                          <main className="flex page relative wrapper">
                            {!shouldHideLeftPanel && (
                              <LeftMenu
                                role={role}
                                isCollapsed={isCollapsed}
                                setIsCollapsed={setIsCollapsed}
                              />
                            )}
                            <div className="w-full right-panel-component overflow-x-hidden">
                              <AdminHeader
                                isCollapsed={isCollapsed}
                                setIsCollapsed={setIsCollapsed}
                                role={role}
                                isMobileView={isIpadPro} // Pass this prop to AdminHeader to show mobile nav on iPad Pro
                              />
                              <Outlet />

                              <ChatbotDashboard />
                            </div>
                          </main>
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

export default AdminLayout;
