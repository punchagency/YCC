import React, { useState, useRef, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/theme/themeContext";
import TopNav from "./TopNav";
import GlobalSearchModal from "./GlobalSearchModal";
import hamburger from "../assets/images/crew/hamburger.png";
import searchLogo from "../assets/images/crew/searchLogo.png";
import manprofile from "../assets/images/crew/manprofile.png";
import "./header.css";
import { Store, Bell, ShoppingCart } from "lucide-react";
import { useUser } from "../context/userContext";
import { useCart } from "../context/cart/cartContext";
import { checkPendingVendors } from "../services/admin/adminService";
import { getNotifications } from "../services/notification/notificationService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AdminHeader = ({ isCollapsed, setIsCollapsed, role, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { cartCount, loading: cartCountLoading } = useCart();

  // Debug: Log user data
  console.log("Header - User data:", {
    user: user,
    crewProfile: user?.crewProfile,
    profilePicture: user?.profilePicture,
    role: user?.role,
  });

  // Helper function to get role name
  const getRoleName = (roleObj) => {
    if (typeof roleObj === "string") {
      return roleObj;
    }
    if (typeof roleObj === "object" && roleObj?.name) {
      return roleObj.name;
    }
    return null;
  };

  // Determine the role
  let userRole = role;
  if (!userRole) {
    userRole = getRoleName(user?.role);
  } else {
    userRole = getRoleName(userRole);
  }

  console.log("User role:", userRole);

  // const overlayPanelRef = useRef(null);
  // const { user } = useUser(); // Get user data from context
  const [searchValue, setSearchValue] = useState("");

  // const shareMenuRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [searchValue, setSearchValue] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  //  const [role, setRole] = useState("Captain");
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState("Admin User");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExcelModal, setShowExcelModal] = useState(false);

  // Update your searchFilters state to include sorting preferences
  const [searchFilters, setSearchFilters] = useState({
    type: "all",
    status: "all",
    sortField: "relevance",
    sortDirection: "desc",
  });

  const [hasPendingVendors, setHasPendingVendors] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const checkVendors = async () => {
      if (userRole === "admin") {
        try {
          const response = await checkPendingVendors();
          if (response.status === "success") {
            setHasPendingVendors(response.data.hasPendingVendors);
          }
        } catch (error) {
          console.error("Error checking pending vendors:", error);
        }
      }
    };

    // Check immediately
    checkVendors();

    // Then check every 5 minutes
    const interval = setInterval(checkVendors, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userRole]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications();
      if (response.success) {
        const transformedData = response.data.map((item) => ({
          priority: item.priority || "Low",
          type: item.type || "General Issue",
          description: item.message || item.description,
          status: item.status || "Pending",
          createdAt: item.create_at || item.createdAt,
          _id: item._id,
        }));
        setNotifications(transformedData);
        setError(null);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  // Add refs for the new menus
  const filterMenuRef = useRef(null);
  const sortMenuRef = useRef(null);

  // Update your sort menu items
  const sortItems = [
    {
      label: "Relevance",
      command: () => {
        setSearchFilters({
          ...searchFilters,
          sortField: "relevance",
          sortDirection: "desc",
        });
        if (showSearchModal) {
          setShowSearchModal(false);
          setTimeout(() => setShowSearchModal(true), 0);
        } else {
          setShowSearchModal(true);
        }
      },
    },
    {
      label: "Date (Newest)",
      command: () => {
        setSearchFilters({
          ...searchFilters,
          sortField: "date",
          sortDirection: "desc",
        });
        setShowSearchModal(true);
      },
    },
    {
      label: "Date (Oldest)",
      command: () => {
        setSearchFilters({
          ...searchFilters,
          sortField: "date",
          sortDirection: "asc",
        });
        setShowSearchModal(true);
      },
    },
    {
      label: "Name (A-Z)",
      command: () => {
        setSearchFilters({
          ...searchFilters,
          sortField: "name",
          sortDirection: "asc",
        });
        setShowSearchModal(true);
      },
    },
    {
      label: "Name (Z-A)",
      command: () => {
        setSearchFilters({
          ...searchFilters,
          sortField: "name",
          sortDirection: "desc",
        });
        setShowSearchModal(true);
      },
    },
    {
      label: "Status",
      command: () => {
        setSearchFilters({
          ...searchFilters,
          sortField: "status",
          sortDirection: "asc",
        });
        setShowSearchModal(true);
      },
    },
    {
      label: "Price (High to Low)",
      command: () => {
        setSearchFilters({
          ...searchFilters,
          sortField: "price",
          sortDirection: "desc",
        });
        setShowSearchModal(true);
      },
    },
    {
      label: "Price (Low to High)",
      command: () => {
        setSearchFilters({
          ...searchFilters,
          sortField: "price",
          sortDirection: "asc",
        });
        setShowSearchModal(true);
      },
    },
  ];

  // Define menu items for Filter and Sort
  const filterItems = [
    {
      label: "All Items",
      command: () => {
        setSearchFilters({ ...searchFilters, type: "all" });
        if (showSearchModal) {
          // If modal is already open, this will apply the filter
          setShowSearchModal(false);
          setTimeout(() => setShowSearchModal(true), 0);
        }
      },
    },
    {
      label: "Vendors",
      command: () => {
        setSearchFilters({ ...searchFilters, type: "vendors" });
        setShowSearchModal(true);
      },
    },
    {
      label: "Orders",
      command: () => {
        setSearchFilters({ ...searchFilters, type: "orders" });
        setShowSearchModal(true);
      },
    },
    {
      label: "Bookings",
      command: () => {
        setSearchFilters({ ...searchFilters, type: "bookings" });
        setShowSearchModal(true);
      },
    },
    {
      label: "Inventory",
      command: () => {
        setSearchFilters({ ...searchFilters, type: "inventories" });
        setShowSearchModal(true);
      },
    },
  ];

  // Refs and hooks
  // const navigate = useNavigate();
  const theme = useTheme();
  const overlayPanelRef = useRef();
  const shareMenuRef = useRef();

  // Share menu items
  const shareItems = [
    {
      label: "Export as Excel",
      icon: "pi pi-file-excel",
      command: () => {
        setShowExcelModal(true);
      },
    },
  ];

  const viewAllNotifications = () => {
    if (userRole === "Captain") {
      navigate("/admin/notifications");
    } else {
      navigate("/admin/notifications");
    }
  };

  // Detect if we're on mobile
  const isMobile = window.innerWidth <= 768;

  // Detect iPad Pro specifically
  const isIpadPro = window.innerWidth === 1024 && window.innerHeight === 1366;

  const landingPages = [
    "/",
    "/resource-center",
    "/about-us",
    "/contact-us",
    "/crew",
    "/captain",
    "/exterior",
    "/interior",
    "/engineering",
    "/chef-galley",
    "/vendor-services",
  ];
  const isLandingPage = landingPages.includes(location.pathname);

  const start = (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "15px",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* First row on mobile: Hamburger + Search + Profile */}
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: "15px",
            justifyContent: "space-between",
          }}
        >
          {/* Left Group: Hamburger + Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Hamburger Menu */}
            <div
              className="hamburger-container"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <img
                src={hamburger}
                alt="menu"
                style={{ width: "24px", height: "24px" }}
              />
            </div>

            {/* Search Input */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                width: isMobile ? "auto" : "350px",
                flex: isMobile ? "none" : "none",
              }}
            >
              {isMobile ? (
                <Button
                  icon={
                    <img
                      src={searchLogo}
                      alt="search"
                      style={{ width: "24px", height: "24px" }}
                    />
                  }
                  onClick={() => setShowSearchModal(true)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "0",
                    width: "40px",
                    height: "40px",
                  }}
                />
              ) : (
                <>
                  <img
                    src={searchLogo}
                    alt="search"
                    style={{ position: "absolute", left: "10px" }}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onClick={() => setShowSearchModal(true)}
                    style={{
                      paddingLeft: "35px",
                      width: "100%",
                      height: "40px",
                      border: "1px solid #ced4da",
                      borderRadius: "30px",
                      backgroundColor: "#F5F6FA",
                      outline: "none",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Right Group: Store + Notifications + Profile */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {/* Store Icon */}
              {userRole === "admin" && (
                <button
                  onClick={() => navigate("/admin/approve")}
                  className="supplier-management-btn"
                  aria-label="Supplier and Vendor Management"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    background: "transparent",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    padding: "8px",
                    position: "relative",
                  }}
                >
                  <Store
                    style={{
                      width: "24px",
                      height: "24px",
                      color: "#0387D9",
                    }}
                  />
                  {hasPendingVendors && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "4px",
                        width: "12px",
                        height: "12px",
                        backgroundColor: "#FF4B4B",
                        borderRadius: "50%",
                        border: "2px solid #fff",
                      }}
                    />
                  )}
                </button>
              )}

              {/* Cart Icon - Only show for crew members */}
              {userRole === "crew_member" && (
                <button
                  onClick={() => navigate("/crew/cart")}
                  className="cart-btn"
                  aria-label="Shopping Cart"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    background: "transparent",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    padding: "8px",
                    position: "relative",
                  }}
                >
                  <ShoppingCart
                    style={{
                      width: "24px",
                      height: "24px",
                      color: "#0387D9",
                    }}
                  />
                  {/* Cart item count badge */}
                  {cartCountLoading ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "2px",
                        width: "16px",
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className="cart-badge-loading"
                        style={{
                          width: 14,
                          height: 14,
                          border: "2px solid #0387D9",
                          borderTop: "2px solid #fff",
                          borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    </div>
                  ) : (
                    cartCount > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "6px",
                          right: "2px",
                          minWidth: "16px",
                          height: "16px",
                          backgroundColor: "#FF4B4B",
                          borderRadius: "50%",
                          border: "2px solid #fff",
                          fontSize: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          padding: "0 4px",
                          zIndex: 2,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        }}
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </div>
                    )
                  )}
                </button>
              )}

              {/* Bell Icon */}
              <button
                className="notifications-btn"
                onClick={(event) => overlayPanelRef.current.toggle(event)}
                aria-haspopup
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  padding: "8px",
                  position: "relative",
                }}
              >
                <Bell
                  style={{
                    width: "24px",
                    height: "24px",
                    color: "#0387D9",
                  }}
                />
                {notifications.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "4px",
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#FF4B4B",
                      borderRadius: "50%",
                      border: "2px solid #fff",
                    }}
                  />
                )}
              </button>

              {/* Profile Image Only */}
              <div
                className="profile-section"
                onClick={() => {
                  // Navigate based on role
                  if (userRole === "crew_member") {
                    navigate("/crew/profile");
                  } else {
                    navigate("/admin/profile");
                  }
                }}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={
                    user?.profilePicture ||
                    user?.crewProfile?.profilePicture ||
                    manprofile
                  }
                  alt="Profile"
                  className="profile-image"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const end = (
    <>
      {/* Notification Overlay Panel */}
      <OverlayPanel
        ref={overlayPanelRef}
        className="notification-overlay"
        style={{ width: "320px", padding: "16px" }}
        hideOverlaysOnDocumentScrolling={false}
      >
        <div className="flex align-items-center justify-content-between mb-3">
          <div className="flex align-items-center">
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
              Notifications
            </h4>
          </div>
        </div>

        <div
          className="notification-list"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {notifications.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "12px 0",
                borderBottom: "1px solid #E4E7EC",
                position: "relative",
              }}
            >
              {/* Priority Dot */}
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor:
                    item.priority === "High"
                      ? "#F04438"
                      : item.priority === "Medium"
                      ? "#F79009"
                      : "#12B76A",
                  marginTop: "6px",
                  marginRight: "12px",
                }}
              />

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#344054",
                      marginBottom: "4px",
                    }}
                  >
                    {item.priority} Priority
                  </span>

                  {/* More Options Icon */}
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      padding: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <i
                      className="pi pi-ellipsis-h"
                      style={{ color: "#667085", fontSize: "16px" }}
                    />
                  </button>
                </div>

                <p
                  style={{
                    margin: "0",
                    fontSize: "14px",
                    color: "#475467",
                  }}
                >
                  {item.description}
                </p>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#667085",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {item.create_at}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <Button
          label="View All Notifications"
          className="p-button-text"
          style={{
            width: "100%",
            marginTop: "16px",
            color: "#0387D9",
            border: "1px solid #0387D9",
            borderRadius: "8px",
            padding: "8px",
            backgroundColor: "transparent",
          }}
          onClick={viewAllNotifications}
        />
      </OverlayPanel>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Store Icon - Only show on desktop */}
        {!isMobile && userRole === "admin" && (
          <button
            onClick={() => navigate("/admin/approve")}
            className="supplier-management-btn"
            aria-label="Supplier and Vendor Management"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "transparent",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "all 0.2s ease",
              padding: "8px",
              position: "relative",
            }}
          >
            <Store
              style={{
                width: "24px",
                height: "24px",
                color: "#0387D9",
              }}
            />
            {hasPendingVendors && (
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "4px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#FF4B4B",
                  borderRadius: "50%",
                  border: "2px solid #fff",
                }}
              />
            )}
          </button>
        )}

        {/* Cart Icon - Only show on desktop for crew members */}
        {!isMobile && userRole === "crew_member" && (
          <button
            onClick={() => navigate("/crew/cart")}
            className="cart-btn"
            aria-label="Shopping Cart"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "transparent",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "all 0.2s ease",
              padding: "8px",
              position: "relative",
            }}
          >
            <ShoppingCart
              style={{
                width: "24px",
                height: "24px",
                color: "#0387D9",
              }}
            />
            {/* Cart item count badge */}
            {cartCountLoading ? (
              <div
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "2px",
                  width: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="cart-badge-loading"
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid #0387D9",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 1s linear infinite",
                  }}
                />
              </div>
            ) : (
              cartCount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "2px",
                    minWidth: "16px",
                    height: "16px",
                    backgroundColor: "#FF4B4B",
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    padding: "0 4px",
                    zIndex: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </div>
              )
            )}
          </button>
        )}

        {/* Notification Bell - Only show on desktop */}
        {!isMobile && (
          <button
            className="notifications-btn"
            onClick={(event) => overlayPanelRef.current.toggle(event)}
            aria-haspopup
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "transparent",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "all 0.2s ease",
              padding: "8px",
              position: "relative",
            }}
          >
            <Bell
              style={{
                width: "24px",
                height: "24px",
                color: "#0387D9",
              }}
            />
            {notifications.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "4px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#FF4B4B",
                  borderRadius: "50%",
                  border: "2px solid #fff",
                }}
              />
            )}
          </button>
        )}
        {/* Profile Section - Only show on desktop */}
        {!isMobile && (
          <>
            <div
              className="profile-section"
              onClick={() => {
                // Navigate based on role
                if (userRole === "crew_member") {
                  navigate("/crew/profile");
                } else {
                  navigate("/admin/profile");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  user?.profilePicture ||
                  user?.crewProfile?.profilePicture ||
                  manprofile
                }
                alt="Profile"
                className="profile-image"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p>
                  {user?.crewProfile
                    ? `${user.crewProfile.firstName} ${user.crewProfile.lastName}`
                    : user?.name || userName}
                </p>
                <p>
                  {userRole
                    ? userRole.charAt(0).toUpperCase() +
                      userRole.slice(1).replace("_", " ")
                    : "Admin"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <header className="admin-header">
      {/* Back Button */}
      {window.history.length > 1 &&
        !isLandingPage &&
        !location.pathname.startsWith("/crew/") &&
        !location.pathname.startsWith("/admin/") && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#034D92",
              marginRight: 8,
            }}
            aria-label="Back"
          >
            <ArrowBackIcon />
          </button>
        )}
      <Menubar
        start={start}
        end={end}
        style={{
          padding: isMobile ? "8px" : "16px",
          flexWrap: "wrap",
          backgroundColor: "#F8FBFF",
          color: "#103B57",
          position: isMobile ? "fixed" : "relative",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          boxShadow: isMobile ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
        }}
      />
      <TopNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        role={userRole}
      />
      {isIpadPro && (
        <div
          className="ipad-pro-menu"
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            zIndex: 1001,
            cursor: "pointer",
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <img
            src={hamburger}
            alt="menu"
            style={{ width: "24px", height: "24px" }}
          />
        </div>
      )}
      <GlobalSearchModal
        visible={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        initialFilters={searchFilters}
      />
    </header>
  );
};

export default AdminHeader;
