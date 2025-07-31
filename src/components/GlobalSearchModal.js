import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { searchAll } from "../services/search/searchService";
import searchIcon from "../assets/images/crew/searchLogo.png";

const GlobalSearchModal = ({
  visible,
  onHide,
  initialQuery = "",
  initialFilters = {},
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [activeFilters, setActiveFilters] = useState({
    type: initialFilters.type || "all",
    status: initialFilters.status || "all",
  });
  const [activeSort, setActiveSort] = useState({
    field: "relevance", // Default sort is by relevance
    direction: "desc", // descending order
  });

  // Safe search execution
  const performSearch = useCallback(async (query) => {
    if (!query || query.trim() === "") {
      setSearchResults({});
      setTotalResults(0);
      return;
    }

    setLoading(true);
    try {
      const response = await searchAll(query);
      if (response.success) {
        setSearchResults(response.data);
        setTotalResults(response.totalResults);
      } else {
        console.error(response.message);
        setSearchResults({});
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({});
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced function (memoized)
  const debouncedSearch = useMemo(
    () => debounce(performSearch, 300),
    [performSearch]
  );

  // Initial query on modal open
  useEffect(() => {
    if (visible) {
      setSearchQuery(initialQuery || "");
      setActiveFilters({
        type: initialFilters.type || "all",
        status: initialFilters.status || "all",
      });

      // Set initial sort if provided
      if (initialFilters.sortField) {
        setActiveSort({
          field: initialFilters.sortField || "relevance",
          direction: initialFilters.sortDirection || "desc",
        });
      }

      if (initialQuery) {
        performSearch(initialQuery);
      }
    }
  }, [visible, initialQuery, initialFilters, performSearch]);

  // Trigger search on query change
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const applyFilters = (results) => {
    if (!results) return {};

    const filteredResults = {};

    Object.keys(results).forEach((category) => {
      if (!results[category] || !Array.isArray(results[category])) {
        filteredResults[category] = [];
        return;
      }

      let filtered = results[category];
      if (activeFilters.type !== "all" && activeFilters.type !== category) {
        filtered = [];
      } else {
        if (activeFilters.status !== "all") {
          filtered = filtered.filter(
            (item) =>
              item.status?.toLowerCase() === activeFilters.status.toLowerCase()
          );
        }
      }

      filteredResults[category] = filtered;
    });

    return filteredResults;
  };

  const countTotalFilteredResults = (filteredResults) => {
    return Object.values(filteredResults).reduce(
      (sum, items) => sum + (items ? items.length : 0),
      0
    );
  };

  const sortResults = (results) => {
    if (!results) return {};

    const sortedResults = {};

    Object.keys(results).forEach((category) => {
      if (!results[category] || !Array.isArray(results[category])) {
        sortedResults[category] = [];
        return;
      }

      // Clone the array to avoid mutating original data
      let sorted = [...results[category]];

      // Apply sorting based on active sort options
      switch (activeSort.field) {
        case "date":
          sorted.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.date || 0);
            return activeSort.direction === "asc"
              ? dateA - dateB
              : dateB - dateA;
          });
          break;

        case "name":
          sorted.sort((a, b) => {
            const nameA = (
              a.name ||
              a.title ||
              a.productName ||
              ""
            ).toLowerCase();
            const nameB = (
              b.name ||
              b.title ||
              b.productName ||
              ""
            ).toLowerCase();
            return activeSort.direction === "asc"
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          });
          break;

        case "status":
          sorted.sort((a, b) => {
            const statusA = (a.status || "").toLowerCase();
            const statusB = (b.status || "").toLowerCase();
            return activeSort.direction === "asc"
              ? statusA.localeCompare(statusB)
              : statusB.localeCompare(statusA);
          });
          break;

        case "price":
          sorted.sort((a, b) => {
            const priceA = parseFloat(a.price || 0);
            const priceB = parseFloat(b.price || 0);
            return activeSort.direction === "asc"
              ? priceA - priceB
              : priceB - priceA;
          });
          break;

        // Default case is relevance (as returned by API)
        default:
          // No sorting needed
          break;
      }

      sortedResults[category] = sorted;
    });

    return sortedResults;
  };

  const filteredSearchResults = applyFilters(searchResults);
  const sortedFilteredResults = sortResults(filteredSearchResults);
  const totalFilteredResults = countTotalFilteredResults(sortedFilteredResults);

  const handleResultClick = (item) => {
    switch (item.type) {
      case "product":
      case "inventory":
        navigate(`/admin/inventory-management`);
        break;
      case "user":
      case "vendor":
      case "service":
      case "complaint":
        navigate(`/admin/dashboard`);
        break;
      case "event":
        navigate(`/admin/calendar-management`);
        break;
      case "order":
        navigate(`/admin/orders-management`);
        break;
      case "booking":
        navigate(`/admin/bookings-management`);
        break;
      case "notification":
        navigate(`/admin/notifications`);
        break;
      default:
        break;
    }
    onHide();
  };

  const renderFilterOptions = () => (
    <div
      className="search-filters"
      style={{
        display: "flex",
        gap: "10px",
        padding: window.innerWidth <= 768 ? "8px 12px" : "8px 20px",
        borderBottom: "1px solid #eaeaea",
        backgroundColor: "#f9f9f9",
        flexWrap: "wrap",
      }}
    >
      <Dropdown
        value={activeFilters.type}
        options={[
          { label: "All Types", value: "all" },
          { label: "Products", value: "products" },
          { label: "Inventory", value: "inventories" },
          { label: "Orders", value: "orders" },
          { label: "Bookings", value: "bookings" },
          { label: "Users", value: "users" },
          { label: "Vendors", value: "vendors" },
          { label: "Events", value: "events" },
          { label: "Notifications", value: "notifications" },
          { label: "Services", value: "services" },
        ]}
        onChange={(e) => setActiveFilters({ ...activeFilters, type: e.value })}
        placeholder="Filter by Type"
        style={{ width: "160px" }}
      />

      <Dropdown
        value={activeFilters.status}
        options={[
          { label: "All Statuses", value: "all" },
          { label: "Pending", value: "pending" },
          { label: "Completed", value: "completed" },
          { label: "Delivered", value: "delivered" },
          { label: "Shipped", value: "shipped" },
          { label: "Cancelled", value: "cancelled" },
        ]}
        onChange={(e) =>
          setActiveFilters({ ...activeFilters, status: e.value })
        }
        placeholder="Filter by Status"
        style={{ width: "160px" }}
      />

      <div
        className="search-sort-options"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginLeft: "auto",
        }}
      >
        <label style={{ fontSize: "13px", color: "#666" }}>Sort by:</label>
        <Dropdown
          value={activeSort.field}
          options={[
            { label: "Relevance", value: "relevance" },
            { label: "Date", value: "date" },
            { label: "Name", value: "name" },
            { label: "Status", value: "status" },
            { label: "Price", value: "price" },
          ]}
          onChange={(e) =>
            setActiveSort({
              ...activeSort,
              field: e.value,
            })
          }
          style={{ width: "120px" }}
        />

        <Button
          icon={
            activeSort.direction === "asc"
              ? "pi pi-sort-amount-up"
              : "pi pi-sort-amount-down"
          }
          className="p-button-text p-button-sm"
          onClick={() =>
            setActiveSort({
              ...activeSort,
              direction: activeSort.direction === "asc" ? "desc" : "asc",
            })
          }
          tooltip={activeSort.direction === "asc" ? "Ascending" : "Descending"}
        />
      </div>

      {(activeFilters.type !== "all" ||
        activeFilters.status !== "all" ||
        activeSort.field !== "relevance") && (
        <Button
          icon="pi pi-times"
          label="Clear All"
          className="p-button-text p-button-sm"
          onClick={() => {
            setActiveFilters({ type: "all", status: "all" });
            setActiveSort({ field: "relevance", direction: "desc" });
          }}
        />
      )}
    </div>
  );

  const renderResultItem = (item) => (
    <div
      key={`${item.type}-${item.id}`}
      className="search-result-item"
      onClick={() => handleResultClick(item)}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        backgroundColor: "#ffffff",
        marginBottom: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#f8f9fa";
        e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.08)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#ffffff";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
      }}
    >
      <div
        className="result-icon"
        style={{
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          backgroundColor: "#f0f7ff",
          marginRight: "16px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name || "Item"}
            className="result-image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="result-icon-placeholder" style={{ fontSize: "18px" }}>
            {getIconForType(item.type)}
          </div>
        )}
      </div>
      <div className="result-content" style={{ flex: 1, minWidth: 0 }}>
        <div
          className="result-title"
          style={{
            fontWeight: "500",
            fontSize: "14px",
            color: "#333",
            marginBottom: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name ||
            item.title ||
            item.orderId ||
            item.bookingId ||
            item.type ||
            "Unnamed Item"}
        </div>
        <div
          className="result-subtitle"
          style={{
            fontSize: "13px",
            color: "#666",
            marginBottom: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.description ||
            item.email ||
            item.status ||
            item.category ||
            item.message ||
            ""}
        </div>
        <div
          className="result-type"
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: "500",
            color: "#0387d9",
            backgroundColor: "rgba(3, 135, 217, 0.08)",
            padding: "2px 8px",
            borderRadius: "12px",
          }}
        >
          {formatType(item.type)}
        </div>
      </div>
    </div>
  );

  const getIconForType = (type) => {
    switch (type) {
      case "product":
        return "🛒";
      case "user":
        return "👤";
      case "event":
        return "📅";
      case "vendor":
        return "🏪";
      case "inventory":
        return "📦";
      case "complaint":
        return "📝";
      case "order":
        return "🧾";
      case "booking":
        return "📋";
      case "notification":
        return "🔔";
      case "service":
        return "🔧";
      default:
        return "📄";
    }
  };

  const formatType = (type) => type.charAt(0).toUpperCase() + type.slice(1);

  const renderResultsSection = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div
        className="search-results-section"
        style={{
          marginBottom: "24px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          padding: "16px",
        }}
      >
        <h3
          className="section-title"
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "12px",
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
          }}
        >
          {title}{" "}
          <span style={{ color: "#666", fontSize: "14px" }}>
            ({items.length})
          </span>
        </h3>
        <div className="section-items">
          {items.map((item) => renderResultItem(item))}
        </div>
      </div>
    );
  };

  const renderLoadingSkeleton = () =>
    Array(5)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="search-result-item skeleton"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            marginBottom: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Skeleton
            shape="circle"
            width="40px"
            height="40px"
            style={{ marginRight: "16px" }}
          />
          <div className="result-content" style={{ flex: 1 }}>
            <Skeleton
              width="70%"
              height="20px"
              style={{ marginBottom: "8px" }}
            />
            <Skeleton width="50%" height="15px" />
          </div>
        </div>
      ));

  // Custom header for the dialog
  const dialogHeader = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <span
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#333",
        }}
      >
        Global Search
      </span>
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={dialogHeader}
      className="global-search-modal"
      hideOverlaysOnDocumentScrolling={false}
      style={{
        width: "80vw",
        maxWidth: "800px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
      contentStyle={{ padding: 0 }}
    >
      <div className="search-container">
        <div
          className="search-input-container"
          style={{
            position: "relative",
            padding: window.innerWidth <= 768 ? "16px 12px" : "16px 20px",
            borderBottom: "1px solid #eaeaea",
            backgroundColor: "#f9f9f9",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <i
              className="pi pi-search"
              style={{
                position: "absolute",
                left: "12px",
                color: "#0387d9",
                fontSize: "16px",
              }}
            ></i>
            <InputText
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search for anything..."
              className="search-input"
              autoFocus
              style={{
                width: "100%",
                padding: "12px 40px 12px 40px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "15px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = "0 0 0 2px rgba(3, 135, 217, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";
              }}
            />
            {searchQuery && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text clear-button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "8px",
                  backgroundColor: "transparent",
                  color: "#666",
                  width: "30px",
                  height: "30px",
                }}
              />
            )}
          </div>
        </div>

        {renderFilterOptions()}

        {(activeFilters.type !== "all" ||
          activeFilters.status !== "all" ||
          activeSort.field !== "relevance") && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: window.innerWidth <= 768 ? "10px 12px" : "10px 20px",
              backgroundColor: "#e0f0ff",
              fontSize: "13px",
            }}
          >
            <i className="pi pi-filter" style={{ marginRight: "8px" }}></i>
            <span>
              {(activeFilters.type !== "all" ||
                activeFilters.status !== "all") && (
                <span>
                  Filtered by:
                  {activeFilters.type !== "all" &&
                    ` Type (${activeFilters.type})`}
                  {activeFilters.type !== "all" &&
                    activeFilters.status !== "all" &&
                    ", "}
                  {activeFilters.status !== "all" &&
                    ` Status (${activeFilters.status})`}
                </span>
              )}

              {(activeFilters.type !== "all" ||
                activeFilters.status !== "all") &&
                activeSort.field !== "relevance" && <span> | </span>}

              {activeSort.field !== "relevance" && (
                <span>
                  Sorted by: {activeSort.field}(
                  {activeSort.direction === "asc" ? "ascending" : "descending"})
                </span>
              )}
            </span>
          </div>
        )}

        <div
          className="search-results"
          style={{
            maxHeight: "60vh",
            overflowY: "auto",
            padding: window.innerWidth <= 768 ? "16px 12px" : "20px",
            backgroundColor: "#fff",
          }}
        >
          {loading ? (
            <div className="loading-results">
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "16px",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                Searching for "{searchQuery}"...
              </div>
              {renderLoadingSkeleton()}
            </div>
          ) : totalFilteredResults > 0 ? (
            <>
              <div
                className="results-summary"
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "20px",
                  padding: "10px 15px",
                  backgroundColor: "#f0f7ff",
                  borderRadius: "8px",
                  border: "1px solid #e0f0ff",
                }}
              >
                <i
                  className="pi pi-info-circle"
                  style={{ marginRight: "8px" }}
                ></i>
                Found <strong>{totalFilteredResults}</strong>
                {totalFilteredResults !== totalResults &&
                  ` of ${totalResults}`}{" "}
                results for "<strong>{searchQuery}</strong>"
              </div>
              {renderResultsSection("Products", sortedFilteredResults.products)}
              {renderResultsSection("Users", sortedFilteredResults.users)}
              {renderResultsSection("Events", sortedFilteredResults.events)}
              {renderResultsSection("Vendors", sortedFilteredResults.vendors)}
              {renderResultsSection(
                "Inventory",
                sortedFilteredResults.inventories
              )}
              {renderResultsSection(
                "Complaints",
                sortedFilteredResults.complaints
              )}
              {renderResultsSection("Orders", sortedFilteredResults.orders)}
              {renderResultsSection("Bookings", sortedFilteredResults.bookings)}
              {renderResultsSection(
                "Notifications",
                sortedFilteredResults.notifications
              )}
              {renderResultsSection("Services", sortedFilteredResults.services)}
            </>
          ) : searchQuery ? (
            <div
              className="no-results"
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#666",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            >
              <i
                className="pi pi-search"
                style={{
                  fontSize: "32px",
                  color: "#ccc",
                  display: "block",
                  marginBottom: "16px",
                }}
              ></i>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                No results found
              </div>
              <div style={{ fontSize: "14px" }}>
                {activeFilters.type !== "all" || activeFilters.status !== "all"
                  ? "Try removing some filters or "
                  : ""}
                We couldn't find any matches for "{searchQuery}"
              </div>
            </div>
          ) : (
            <div
              className="empty-state"
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#666",
              }}
            >
              <i
                className="pi pi-search"
                style={{
                  fontSize: "32px",
                  color: "#ccc",
                  display: "block",
                  marginBottom: "16px",
                }}
              ></i>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Start searching
              </div>
              <div style={{ fontSize: "14px" }}>
                Type something to search across your data
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

// Debounce function - outside the component
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export default GlobalSearchModal;
