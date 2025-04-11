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
const AdminLayout = ({ role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
