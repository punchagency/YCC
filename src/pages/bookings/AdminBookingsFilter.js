import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const bookingFilters = [
  { key: "all", label: "All Bookings", icon: "pi pi-list", color: "#6b7280" },
  { key: "pending", label: "Pending", icon: "pi pi-clock", color: "#D97706" },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: "pi pi-check-circle",
    color: "#0387D9",
  },
  {
    key: "completed",
    label: "Completed",
    icon: "pi pi-check-circle",
    color: "#059669",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    icon: "pi pi-times-circle",
    color: "#b42318",
  },
];

const AdminBookingsFilter = ({
  onSearch,
  onFilterChange,
  currentStatus = "all",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState(currentStatus);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setActiveFilter(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    };
    if (filterDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterDropdownOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
  };

  const handleFilterSelect = (key) => {
    setActiveFilter(key);
    setFilterDropdownOpen(false);
    const filterCriteria = key === "all" ? {} : { status: key };
    if (onFilterChange) onFilterChange(filterCriteria);
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#ffffff",
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        boxShadow:
          "0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 1px rgba(0, 0, 0, 0.03)",
        border: "1px solid #e2e8f0",
        mb: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <form
        onSubmit={handleSearchSubmit}
        style={{ width: "100%", marginBottom: "3px" }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by booking id, crew name, or provider..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#6b7280" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "transparent",
              fontSize: { xs: 14, md: 16 },
              paddingRight: 0,
              "& fieldset": {
                border: "1.5px solid #e2e8f0",
                borderRadius: "8px",
                transition: "border-color 0.2s, box-shadow 0.2s",
              },
              "&:hover fieldset": { borderColor: "#b6c2d6" },
              "&.Mui-focused fieldset": {
                borderColor: "#0387D9",
                borderWidth: "2.5px",
                boxShadow: "0 0 0 2px #0387D933",
              },
            },
            input: {
              background: "transparent",
              border: "none",
              boxShadow: "none",
              padding: "10px 0 10px 0",
            },
          }}
        />
      </form>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 1, sm: 2 },
          width: "100%",
        }}
      >
        <Box
          sx={{
            fontWeight: 600,
            color: "#374151",
            fontSize: { xs: 14, md: 16 },
            minWidth: "fit-content",
            display: "flex",
            alignItems: "center",
          }}
        >
          <i
            className="pi pi-filter"
            style={{ fontSize: 15, color: "#6b7280" }}
          />
          <span style={{ marginLeft: 8, fontSize: 15 }}>Filter Bookings</span>
        </Box>
        <Box
          sx={{ position: "relative", width: { xs: "100%", sm: "auto" } }}
          ref={dropdownRef}
        >
          <button
            type="button"
            className="filter-dropdown-button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              minWidth: 180,
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "100%",
            }}
            onClick={() => setFilterDropdownOpen((open) => !open)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <i
                className={
                  bookingFilters.find((f) => f.key === activeFilter)?.icon
                }
                style={{
                  color: bookingFilters.find((f) => f.key === activeFilter)
                    ?.color,
                }}
              />
              <span>
                {bookingFilters.find((f) => f.key === activeFilter)?.label ||
                  "Select..."}
              </span>
            </div>
            <i
              className={`pi pi-chevron-down filter-dropdown-chevron ${
                filterDropdownOpen ? "rotate-180" : ""
              }`}
              style={{
                fontSize: 12,
                color: "#6b7280",
                transform: filterDropdownOpen
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            />
          </button>
          {filterDropdownOpen && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                boxShadow:
                  "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)",
                zIndex: 1200,
                mt: 0.5,
                p: 1,
                minWidth: "100%",
              }}
            >
              {bookingFilters.map((filter) => (
                <Box
                  key={filter.key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    color: activeFilter === filter.key ? "#1d4ed8" : "#374151",
                    fontWeight: activeFilter === filter.key ? 600 : 500,
                    backgroundColor:
                      activeFilter === filter.key ? "#eff6ff" : "transparent",
                    fontSize: "13px",
                    "&:hover": { backgroundColor: "#f8fafc" },
                  }}
                  onClick={() => handleFilterSelect(filter.key)}
                >
                  <i
                    className={filter.icon}
                    style={{
                      color: filter.color || "#6b7280",
                      fontSize: "13px",
                    }}
                  />
                  <span>{filter.label}</span>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminBookingsFilter;
