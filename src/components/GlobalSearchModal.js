import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import searchIcon from "../assets/images/crew/searchLogo.png";

const GlobalSearchModal = ({ visible, onHide, initialQuery = "" }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Focus search input when modal opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        const searchInput = document.getElementById("global-search-input");
        if (searchInput) searchInput.focus();
      }, 100);

      if (initialQuery) {
        performSearch(initialQuery);
      }
    }
  }, [visible, initialQuery]);

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults({});
      return;
    }

    setLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Enhanced mock search results from ALL parts of the app
      const results = {
        dashboard: [
          {
            id: "d1",
            title: "Monthly Revenue Overview",
            description: "Financial dashboard widget",
            path: "/admin/dashboard",
          },
          {
            id: "d2",
            title: "Inventory Alerts",
            description: "Low stock items requiring attention",
            path: "/admin/dashboard?section=inventory",
          },
          {
            id: "d3",
            title: "Recent Orders Summary",
            description: "Latest order activity",
            path: "/admin/dashboard?section=orders",
          },
        ],
        inventory: [
          {
            id: "i1",
            title: "Wireless Mouse",
            description: "Electronics - 5 in stock",
            path: "/admin/inventory-management/details/i1",
          },
          {
            id: "i2",
            title: "Diesel Fuel",
            description: "Fuel - 200 gallons",
            path: "/admin/inventory-management/details/i2",
          },
          {
            id: "i3",
            title: "Engine Oil",
            description: "Maintenance - 15 units",
            path: "/admin/inventory-management/details/i3",
          },
          {
            id: "i4",
            title: "Safety Equipment",
            description: "Category - 8 different items",
            path: "/admin/inventory-management/category/safety",
          },
        ],
        orders: [
          {
            id: "o1",
            title: "Order #10234",
            description: "Status: In Progress - $1,250.00",
            path: "/admin/orders-management/details/o1",
          },
          {
            id: "o2",
            title: "Order #10235",
            description: "Status: Completed - $3,450.75",
            path: "/admin/orders-management/details/o2",
          },
          {
            id: "o3",
            title: "Order #10236",
            description: "Status: Pending - $780.50",
            path: "/admin/orders-management/details/o3",
          },
          {
            id: "o4",
            title: "Order #10237",
            description: "Status: Cancelled - $2,100.00",
            path: "/admin/orders-management/details/o4",
          },
        ],
        bookings: [
          {
            id: "b1",
            title: "Booking #HtbCz2",
            description: "DeckPro Exterior - Maintenance",
            path: "/admin/bookings-management/details/b1",
          },
          {
            id: "b2",
            title: "Booking #32_xCg",
            description: "DeckPro Exterior - Provisioning",
            path: "/admin/bookings-management/details/b2",
          },
          {
            id: "b3",
            title: "Booking #3Aa69w",
            description: "DeckPro Exterior - United States",
            path: "/admin/bookings-management/details/b3",
          },
          {
            id: "b4",
            title: "Booking #mF-gRg",
            description: "Elite Yacht Interiors - Security",
            path: "/admin/bookings-management/details/b4",
          },
        ],
        calendar: [
          {
            id: "c1",
            title: "First Bank Meeting",
            description: "Apr 14, 2025, 11:00 AM - Virtual",
            path: "/admin/calendar-management?event=c1",
          },
          {
            id: "c2",
            title: "Sample Meeting",
            description: "Apr 14, 2025, 04:12 AM - In Person",
            path: "/admin/calendar-management?event=c2",
          },
          {
            id: "c3",
            title: "Maintenance Schedule",
            description: "Apr 22, 2025, 09:00 AM - Weekly",
            path: "/admin/calendar-management?event=c3",
          },
          {
            id: "c4",
            title: "Vendor Meeting",
            description: "Apr 28, 2025, 02:30 PM - Office",
            path: "/admin/calendar-management?event=c4",
          },
        ],
        financial: [
          {
            id: "f1",
            title: "Invoice #INV-001",
            description: "Amount: $1500.75 - Due: 2025-04-10",
            path: "/admin/financial-management/invoices/f1",
          },
          {
            id: "f2",
            title: "Invoice #INV-002",
            description: "Amount: $1500.75 - Due: 2025-04-01",
            path: "/admin/financial-management/invoices/f2",
          },
          {
            id: "f3",
            title: "Invoice #INV-003",
            description: "Amount: $2300.05 - Due: 2025-05-10",
            path: "/admin/financial-management/invoices/f3",
          },
          {
            id: "f4",
            title: "Payment #PAY-001",
            description: "Amount: $1500.75 - Received: 2025-03-15",
            path: "/admin/financial-management/payments/f4",
          },
          {
            id: "f5",
            title: "Financial Report - Q1 2025",
            description: "Quarterly financial summary",
            path: "/admin/financial-management/reports/f5",
          },
        ],
        notifications: [
          {
            id: "n1",
            title: "Low Inventory Alert",
            description: "Diesel Fuel below threshold",
            path: "/admin/notifications?id=n1",
          },
          {
            id: "n2",
            title: "Payment Received",
            description: "Invoice #INV-001 has been paid",
            path: "/admin/notifications?id=n2",
          },
          {
            id: "n3",
            title: "Booking Confirmed",
            description: "Booking #HtbCz2 has been confirmed",
            path: "/admin/notifications?id=n3",
          },
          {
            id: "n4",
            title: "Maintenance Due",
            description: "Scheduled maintenance reminder",
            path: "/admin/notifications?id=n4",
          },
        ],
        reports: [
          {
            id: "r1",
            title: "Inventory Status Report",
            description: "Current stock levels and valuation",
            path: "/admin/reports/inventory/r1",
          },
          {
            id: "r2",
            title: "Financial Summary Q1 2025",
            description: "Revenue and expense breakdown",
            path: "/admin/reports/financial/r2",
          },
          {
            id: "r3",
            title: "Booking Analytics",
            description: "Service type distribution and trends",
            path: "/admin/reports/bookings/r3",
          },
          {
            id: "r4",
            title: "Vendor Performance",
            description: "Reliability and quality metrics",
            path: "/admin/reports/vendors/r4",
          },
        ],
        settings: [
          {
            id: "s1",
            title: "User Profile",
            description: "Personal information and preferences",
            path: "/admin/settings/profile",
          },
          {
            id: "s2",
            title: "Notification Settings",
            description: "Alert preferences and channels",
            path: "/admin/settings/notifications",
          },
          {
            id: "s3",
            title: "System Configuration",
            description: "Application behavior and defaults",
            path: "/admin/settings/system",
          },
          {
            id: "s4",
            title: "Security Settings",
            description: "Password and authentication options",
            path: "/admin/settings/security",
          },
        ],
      };

      // Enhanced search logic - more thorough matching
      const filteredResults = {};
      const lowerQuery = query.toLowerCase();

      Object.keys(results).forEach((category) => {
        filteredResults[category] = results[category].filter((item) => {
          // Check title
          if (item.title.toLowerCase().includes(lowerQuery)) return true;

          // Check description
          if (item.description.toLowerCase().includes(lowerQuery)) return true;

          // Check ID if it's a reference number
          if (item.id.toLowerCase().includes(lowerQuery)) return true;

          // Check path for relevant keywords
          if (item.path.toLowerCase().includes(lowerQuery)) return true;

          return false;
        });
      });

      setSearchResults(filteredResults);
      setLoading(false);
    }, 500);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const handleResultClick = (path) => {
    navigate(path);
    onHide();
  };

  const getTotalResultsCount = () => {
    return Object.values(searchResults).reduce(
      (total, categoryResults) => total + categoryResults.length,
      0
    );
  };

  // Conditional rendering for no results
  const renderNoResults = () => (
    <div
      className="no-results"
      style={{ textAlign: "center", padding: "2rem" }}
    >
      <i
        className="pi pi-search"
        style={{ fontSize: "2rem", color: "#ccc" }}
      ></i>
      <p>No results found for "{searchQuery}"</p>
      <p style={{ fontSize: "0.9rem", color: "#666" }}>
        Try different keywords or check for typos
      </p>
    </div>
  );

  // Render loading skeletons
  const renderSkeletons = () => (
    <div className="search-skeletons">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Skeleton
            width="40px"
            height="40px"
            className="mr-2"
            style={{ borderRadius: "4px" }}
          />
          <div style={{ flex: 1 }}>
            <Skeleton width="70%" height="1rem" className="mb-2" />
            <Skeleton width="50%" height="0.8rem" />
          </div>
        </div>
      ))}
    </div>
  );

  // Render category tabs
  const renderCategoryTabs = () => {
    const categories = {
      all: "All Results",
      dashboard: "Dashboard",
      inventory: "Inventory",
      orders: "Orders",
      bookings: "Bookings",
      calendar: "Calendar",
      financial: "Financial",
      notifications: "Notifications",
      reports: "Reports",
      settings: "Settings",
    };

    return (
      <div
        className="category-tabs"
        style={{
          display: "flex",
          overflowX: "auto",
          borderBottom: "1px solid #e4e7ec",
          marginBottom: "1rem",
        }}
      >
        {Object.entries(categories).map(([key, label]) => (
          <div
            key={key}
            className={`tab ${activeCategory === key ? "active" : ""}`}
            onClick={() => setActiveCategory(key)}
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom:
                activeCategory === key ? "2px solid #0387D9" : "none",
              color: activeCategory === key ? "#0387D9" : "#495057",
              fontWeight: activeCategory === key ? "600" : "400",
              whiteSpace: "nowrap",
            }}
          >
            {label}
            {key !== "all" && searchResults[key] && (
              <span
                className="count"
                style={{
                  marginLeft: "0.5rem",
                  backgroundColor: "#f0f5ff",
                  color: "#0387D9",
                  padding: "0.1rem 0.5rem",
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                }}
              >
                {searchResults[key]?.length || 0}
              </span>
            )}
            {key === "all" && (
              <span
                className="count"
                style={{
                  marginLeft: "0.5rem",
                  backgroundColor: "#f0f5ff",
                  color: "#0387D9",
                  padding: "0.1rem 0.5rem",
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                }}
              >
                {getTotalResultsCount()}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render results by category
  const renderResultsByCategory = () => {
    // If active category is 'all', show all categories
    // Otherwise, only show the active category
    const categoriesToShow =
      activeCategory === "all" ? Object.keys(searchResults) : [activeCategory];

    return categoriesToShow.map((category) => {
      const results = searchResults[category] || [];
      if (results.length === 0) return null;

      return (
        <div key={category} className="result-category">
          {activeCategory === "all" && (
            <div
              className="category-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <h3 style={{ fontSize: "1rem", margin: 0 }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <Button
                label="View All"
                className="p-button-text p-button-sm"
                onClick={() => navigate(`/admin/${category}-management`)}
              />
            </div>
          )}

          <div className="results">
            {results.map((result) => (
              <div
                key={result.id}
                className="result-item"
                onClick={() => handleResultClick(result.path)}
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                  cursor: "pointer",
                  backgroundColor: "#f8f9fa",
                  transition: "all 0.2s ease",
                  ":hover": {
                    backgroundColor: "#f0f5ff",
                  },
                }}
              >
                <div
                  className="result-title"
                  style={{ fontWeight: "500", marginBottom: "0.25rem" }}
                >
                  {result.title}
                </div>
                <div
                  className="result-description"
                  style={{ color: "#6c757d", fontSize: "0.9rem" }}
                >
                  {result.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Search Across App"
      style={{ width: "90vw", maxWidth: "700px" }}
      breakpoints={{ "960px": "90vw", "640px": "95vw" }}
      draggable={false}
      resizable={false}
      className="global-search-modal"
    >
      <div className="search-container">
        <div
          className="search-input-wrapper"
          style={{ position: "relative", marginBottom: "1rem" }}
        >
          <i
            className="pi pi-search"
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6c757d",
            }}
          ></i>
          <InputText
            id="global-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for anything..."
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              fontSize: "1rem",
            }}
          />
          {searchQuery && (
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-text"
              onClick={() => {
                setSearchQuery("");
                setSearchResults({});
              }}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          )}
        </div>

        {searchQuery && getTotalResultsCount() > 0 && renderCategoryTabs()}

        <div
          className="search-results-container"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {loading && renderSkeletons()}

          {!loading &&
            searchQuery &&
            getTotalResultsCount() === 0 &&
            renderNoResults()}

          {!loading &&
            searchQuery &&
            getTotalResultsCount() > 0 &&
            renderResultsByCategory()}

          {!searchQuery && (
            <div
              className="empty-state"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <img
                src={searchIcon}
                alt="Search"
                style={{
                  width: "48px",
                  height: "48px",
                  marginBottom: "1rem",
                  opacity: 0.5,
                }}
              />
              <p>Type to search across bookings, inventory, orders, and more</p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default GlobalSearchModal;
