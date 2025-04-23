import {
  Box,
  Typography,
  Button,
  styled,
  Menu,
  MenuItem,
  InputBase,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "../../../../context/theme/themeContext";

const Section2FinancialManagement = ({
  setPage,
  setLimit,
  setTransactionStatus,
  setSearch,
  transactionStatus,
}) => {
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));

  const [selectedButton, setSelectedButton] = useState("");
  const buttons = ["Pending Invoices", "Completed Payments", "Failed Payments"];
  const options = ["all", "pending", "completed", "failed"];
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState("");
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (option) => {
    if (option === "all") {
      setTransactionStatus("");
    } else {
      setTransactionStatus(option);
    }

    handleClose();
  };

  const handleButtonClick = (option) => {
    setSelectedButton(option);
    if (option === "Pending Invoices") {
      setTransactionStatus("pending");
    } else if (option === "Completed Payments") {
      setTransactionStatus("completed");
    } else if (option === "Failed Payments") {
      setTransactionStatus("failed");
    }
    handleClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        padding: isMobile
          ? "10px"
          : isTablet
          ? "15px 20px"
          : "0px 20px 0px 20px",
        gap: isMobile ? "15px" : "0px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          backgroundColor: theme === "light" ? "#FFFFFF" : "#7F7F7F",
          paddingX: isMobile ? "2px" : "4px",
          paddingY: "2px",
          borderRadius: "8px",
          gap: isMobile ? "5px" : isTablet ? "8px" : "10px",
          width: isMobile ? "100%" : "auto",
        }}
      >
        {buttons.map((option, index) => (
          <Button
            key={index}
            active={selectedButton === option ? "true" : undefined}
            onClick={() => handleButtonClick(option)}
            sx={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 600,
              fontSize: isMobile ? "11px" : isTablet ? "11px" : "12px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
              verticalAlign: "middle",
              textTransform: "none",
              color:
                theme === "light"
                  ? selectedButton === option
                    ? "#FFFFFF"
                    : "#212121"
                  : selectedButton === option
                  ? "white"
                  : "#212121",
              padding: isMobile ? "8px" : isTablet ? "9px" : "10px",
              margin: "0px",
              backgroundColor:
                selectedButton === option
                  ? "#0387D9"
                  : theme === "light"
                  ? "#FFFFFF"
                  : "#7F7F7F",
              borderRadius: "8px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            {option}
          </Button>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "flex-start" : "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: isMobile ? "10px" : isTablet ? "8px" : "10px",
          width: isMobile ? "100%" : "auto",
        }}
      >
        <Box sx={{ width: isMobile ? "100%" : "auto" }}>
          <Button
            onClick={handleClick}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 6px",
              width: isMobile ? "100%" : "150px",
              backgroundColor: theme === "light" ? "#FFFFFF" : "#7F7F7F",
              borderRadius: "8px",
              border: "1px solid #d5d5d5",
              boxShadow: "none",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#c5c5c5",
                boxShadow: "none",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FilterListIcon
                sx={{
                  color: theme === "light" ? "#000000" : "white",
                  fontSize: isMobile ? "15px" : "17px",
                }}
              />
              <Typography
                sx={{
                  color: theme === "light" ? "#9b9b9b" : "white",
                  fontWeight: 400,
                  fontSize: isMobile ? "12px" : "13px",
                }}
              >
                {transactionStatus || "Select Filter"}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon
              sx={{
                color: theme === "light" ? "#000000" : "white",
                fontSize: isMobile ? "15px" : "17px",
              }}
            />
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: anchorEl?.offsetWidth,
                borderRadius: "8px",
                marginTop: "4px",
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                backgroundColor: theme === "light" ? "#F6F6F6" : "#7F7F7F",
              },
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleSelect(option)}
                sx={{
                  padding: "8px 16px",
                  color: theme === "light" ? "#212121" : "white",
                  fontSize: isMobile ? "12px" : "inherit",
                  "&:hover": {
                    backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
                    color: theme === "light" ? "#212121" : "white",
                  },
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Box
          sx={{
            width: isMobile ? "100%" : isTablet ? "250px" : "310px",
            mx: isMobile ? "0" : "auto",
          }}
        >
          <Box
            component="div"
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <InputBase
              placeholder="Search Transactions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                width: "100%",
                height: "30px",
                borderRadius: "25px",
                border: "1px solid #d5d5d5",
                backgroundColor: theme === "light" ? "#ffffff" : "#7F7F7F",
                "& .MuiInputBase-input": {
                  color: theme === "light" ? "#212121" : "white",
                  fontSize: isMobile ? "12px" : "13px",
                  fontWeight: 400,
                  "&::placeholder": {
                    color: theme === "light" ? "#9b9b9b" : "white",
                    opacity: 1,
                  },
                },
                pl: "0px",
                pr: "16px",
                "&:focus-within": {
                  outline: "none",
                  boxShadow: "0 0 0 1px #d5d5d5",
                },
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ ml: "16px", mr: "4px" }}>
                  <SearchIcon
                    sx={{
                      color: theme === "light" ? "#212121" : "white",
                      fontSize: isMobile ? "15px" : "17px",
                    }}
                  />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Section2FinancialManagement;
