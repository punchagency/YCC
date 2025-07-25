import React, { useState } from "react";
import { Outlet } from "react-router-dom";
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
import "../styles/layout.css";
import { useMediaQuery } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import DashboardTitleBar from "../components/dashboard/title-bar";
import { useUser } from "../context/userContext";

const AdminLayout = ({ role }) => {
  const { user } = useUser();

  // Get role name from object or string
  let userRole = user?.role;
  if (typeof userRole === "object" && userRole.name) {
    userRole = userRole.name;
  }

  // Determine the actual role to use
  const actualRole = role || userRole;
  const normalizedRole = (actualRole || "").toString().toLowerCase();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [backArrow, setBackArrow] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const muiTheme = useMuiTheme();

  // iPad Pro detection (1024 x 1366) - use mobile nav, no left panel
  const isIpadPro = useMediaQuery(
    "(min-width: 1024px) and (max-width: 1024px) and (min-height: 1366px)"
  );

  // General tablet detection (excluding Nest Hub and 1024-1200px range)
  const isTablet = useMediaQuery(
    "(min-width:600px) and (max-width:1023px) and (max-height:1365px)"
  );

  // Nest Hub detection (1024 x 600) - keep left panel
  const isNestHub = useMediaQuery(
    "(min-width: 1024px) and (max-width: 1024px) and (max-height: 600px)"
  );

  // Hide left panel for tablets except Nest Hub and 1024-1200px range
  const shouldHideLeftPanel = (isTablet || isIpadPro) && !isNestHub;

  // Custom setPageTitle function that also handles backArrow and section tracking
  const handleSetPageTitle = (title, options = {}) => {
    setPageTitle(title);

    // Determine current section based on title
    let newSection = "";
    if (title === "Dashboard") {
      newSection = "dashboard";
    } else if (title.includes("Booking") || title.includes("booking")) {
      newSection = "booking";
    } else if (title.includes("Order") || title.includes("order")) {
      newSection = "order";
    } else if (title.includes("Report") || title.includes("report")) {
      newSection = "report";
    } else if (title.includes("Setting") || title.includes("setting")) {
      newSection = "setting";
    } else if (
      title.includes("Notification") ||
      title.includes("notification")
    ) {
      newSection = "notification";
    } else if (title.includes("Inventory") || title.includes("inventory")) {
      newSection = "inventory";
    } else if (title.includes("Financial") || title.includes("financial")) {
      newSection = "financial";
    } else if (title.includes("Calendar") || title.includes("calendar")) {
      newSection = "calendar";
    } else if (title.includes("Document") || title.includes("document")) {
      newSection = "document";
    } else if (title.includes("Training") || title.includes("training")) {
      newSection = "training";
    } else if (title.includes("Legal") || title.includes("legal")) {
      newSection = "legal";
    } else if (
      title.includes("Accommodation") ||
      title.includes("accommodation")
    ) {
      newSection = "accommodation";
    } else if (title.includes("Crew") || title.includes("crew")) {
      newSection = "crew";
    } else {
      newSection = "other";
    }

    // Show back button by default, but hide it on dashboard pages
    const isDashboardPage = title === "Dashboard";
    setBackArrow(
      options.backArrow !== undefined ? options.backArrow : !isDashboardPage
    );

    // Store the previous section before updating
    const previousSection = currentSection;
    setCurrentSection(newSection);

    // Store navigation info for smart back button
    if (
      previousSection &&
      previousSection !== newSection &&
      previousSection !== "dashboard"
    ) {
      // Store that we navigated from a different section
      sessionStorage.setItem("navigatedFromSection", previousSection);
      sessionStorage.setItem("shouldGoToDashboard", "true");
    } else if (newSection === "dashboard") {
      // Clear navigation info when on dashboard
      sessionStorage.removeItem("navigatedFromSection");
      sessionStorage.removeItem("shouldGoToDashboard");
    }
  };

  // Determine if we should show the create booking button
  const shouldShowCreateBookingButton = pageTitle === "Bookings";

  // Determine if we should show the create order button
  const shouldShowCreateOrderButton =
    pageTitle === "Orders" && normalizedRole === "crew_member";

  // Determine if we should show the create inventory button
  const shouldShowCreateInventoryButton = pageTitle === "Inventory";

  // Create Booking button (using existing style and logic)
  const createBookingButton = (
    <button
      onClick={() => {
        // Trigger the existing modal in the booking pages
        const event = new CustomEvent("openCreateBookingModal");
        window.dispatchEvent(event);
      }}
      style={{
        backgroundColor: "#0387D9",
        color: "white",
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "background 0.2s, transform 0.2s",
        outline: "none",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#026bb3";
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#0387D9";
        e.currentTarget.style.transform = "scale(1)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "2px solid #026bb3";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Create Booking
    </button>
  );

  // Create Order button (similar style to booking button)
  const createOrderButton = (
    <button
      onClick={() => {
        // Trigger the existing modal in the order pages
        const event = new CustomEvent("openCreateOrderModal");
        window.dispatchEvent(event);
      }}
      style={{
        backgroundColor: "#0387D9",
        color: "white",
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "background 0.2s, transform 0.2s",
        outline: "none",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#026bb3";
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#0387D9";
        e.currentTarget.style.transform = "scale(1)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "2px solid #026bb3";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Create Order
    </button>
  );

  // Add Import from CSV button for Inventory page
  const importCSVButton = (
    <button
      onClick={() => {
        // Trigger the import CSV modal in the inventory pages
        const event = new CustomEvent("openImportInventoryCSVModal");
        window.dispatchEvent(event);
      }}
      style={{
        backgroundColor: "#fff",
        color: "#0387D9",
        padding: "8px 16px",
        borderRadius: "8px",
        border: "1px solid #0387D9",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "background 0.2s, transform 0.2s",
        outline: "none",
        marginLeft: "8px",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#e6f4fd";
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#fff";
        e.currentTarget.style.transform = "scale(1)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "2px solid #026bb3";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0387D9"
        strokeWidth="2"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          fill="#e6f4fd"
          stroke="#0387D9"
        />
        <path d="M8 12h8M12 8v8" stroke="#0387D9" strokeWidth="2" />
      </svg>
      Import from CSV
    </button>
  );

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
                                role={actualRole}
                                isCollapsed={isCollapsed}
                                setIsCollapsed={setIsCollapsed}
                              />
                            )}
                            <div className="w-full right-panel-component overflow-x-hidden">
                              {/* Fixed top bar */}
                              <div
                                style={{
                                  position: "fixed",
                                  top: 0,
                                  left: shouldHideLeftPanel ? 0 : 280,
                                  right: 0,
                                  zIndex: 1100,
                                  width: shouldHideLeftPanel
                                    ? "100%"
                                    : "calc(100% - 280px)",
                                }}
                              >
                                <AdminHeader
                                  isCollapsed={isCollapsed}
                                  setIsCollapsed={setIsCollapsed}
                                  role={role}
                                  isMobileView={isIpadPro}
                                />
                                {/* Only one title bar, dynamic title from context */}
                                <DashboardTitleBar
                                  title={pageTitle}
                                  backArrow={backArrow}
                                  button={
                                    shouldShowCreateBookingButton ? (
                                      createBookingButton
                                    ) : shouldShowCreateOrderButton ? (
                                      createOrderButton
                                    ) : shouldShowCreateInventoryButton ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <button
                                          onClick={() => {
                                            // Trigger the existing modal in the inventory pages
                                            const event = new CustomEvent(
                                              "openCreateInventoryModal"
                                            );
                                            window.dispatchEvent(event);
                                          }}
                                          style={{
                                            backgroundColor: "#0387D9",
                                            color: "white",
                                            padding: "8px 16px",
                                            borderRadius: "8px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            fontSize: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            transition:
                                              "background 0.2s, transform 0.2s",
                                            outline: "none",
                                          }}
                                          onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                              "#026bb3";
                                            e.currentTarget.style.transform =
                                              "scale(1.02)";
                                          }}
                                          onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                              "#0387D9";
                                            e.currentTarget.style.transform =
                                              "scale(1)";
                                          }}
                                          onFocus={(e) => {
                                            e.currentTarget.style.outline =
                                              "2px solid #026bb3";
                                          }}
                                          onBlur={(e) => {
                                            e.currentTarget.style.outline =
                                              "none";
                                          }}
                                        >
                                          <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          >
                                            <line
                                              x1="12"
                                              y1="5"
                                              x2="12"
                                              y2="19"
                                            ></line>
                                            <line
                                              x1="5"
                                              y1="12"
                                              x2="19"
                                              y2="12"
                                            ></line>
                                          </svg>
                                          Add New Product
                                        </button>
                                        {importCSVButton}
                                      </div>
                                    ) : null
                                  }
                                />
                              </div>
                              {/* Main content starts below the fixed bars */}
                              <div
                                style={{
                                  marginTop: "8rem",
                                  height: "calc(100vh - 8rem)",
                                  maxHeight: "calc(100vh - 8rem)",
                                  overflowY: "auto",
                                  overflowX: "hidden",
                                  WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS
                                  minHeight: "0", // Ensure flex child can shrink
                                  position: "relative", // Ensure proper positioning
                                  paddingBottom: "2rem", // Add bottom padding to ensure content is visible
                                }}
                              >
                                <Outlet
                                  context={{
                                    pageTitle,
                                    setPageTitle: handleSetPageTitle,
                                  }}
                                />
                              </div>
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
