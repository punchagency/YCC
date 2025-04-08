import { Box, Typography, Button, styled, Menu, MenuItem, InputBase, InputAdornment } from "@mui/material";
import { useState, useEffect } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "../../../../context/theme/themeContext";

const Section2FinancialManagement = ({setPage, setLimit, setTransactionStatus, setSearch, transactionStatus}) => {
  const { theme } = useTheme();
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
   
    if(option === "all"){
      setTransactionStatus("");
    }else{
      setTransactionStatus(option);
    }

    handleClose();
  };

  const handleButtonClick = (option) => {
    setSelectedButton(option);
    if(option === "Pending Invoices"){
      setTransactionStatus("pending");
    }else if(option === "Completed Payments"){
      setTransactionStatus("completed");
    }else if(option === "Failed Payments"){
      setTransactionStatus("failed");
    }
    handleClose();
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0px 20px 0px 20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme === "light" ? "#FFFFFF" : "#7F7F7F",
          paddingX: "4px",
          paddingY: "2px",
          borderRadius: "8px",
          gap: "10px",
        }}
      >
        {buttons.map((option, index) => (
          <CustomButton
            key={index}
            active={selectedButton === option}
            onClick={() => handleButtonClick(option)}
            mode={theme}
          >
            {option}
          </CustomButton>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box>
          <FilterButton onClick={handleClick} mode={theme}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FilterListIcon sx={{ color: theme === "light" ? "#000000" : "white", fontSize: "17px" }} />
              <Typography
                sx={{ color: theme === "light" ? "#9b9b9b" : "white", fontWeight: 400, fontSize: "13px" }}
              >
                {transactionStatus || "Select Filter"}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon
              sx={{ color: theme === "light" ? "#000000" : "white", fontSize: "17px" }}
            />
          </FilterButton>

          <FilterMenu anchorEl={anchorEl} open={open} onClose={handleClose} mode={theme}>
            {options.map((option) => (
              <FilterMenuItem
                key={option}
                onClick={() => handleSelect(option)}
                mode={theme}
              >
                {option}
              </FilterMenuItem>
            ))}
          </FilterMenu>
        </Box>

        <Box
          sx={{
            width: "310px",
        mx: "auto",
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
        <CustomInputBase
          placeholder="Search Transactions"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          mode={theme}
          startAdornment={
            <InputAdornment position="start" sx={{ ml: "16px", mr: "4px" }}>
              <SearchIcon sx={{ color: theme === "light" ? "#212121" : "white", fontSize: "17px" }} />
            </InputAdornment>
          }
         
        />
      </Box>
      </Box>
    </Box>
    </Box>
  );
};

export const CustomButton = styled(Button)(({ active, mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "12px",
  lineHeight: "100%",
  letterSpacing: "0%",
  textAlign: "center",
  verticalAlign: "middle",
  textTransform: "none",
  color: mode === "light" ? active ? "#FFFFFF" : "#212121" : active ? "white" : "#212121",
  padding: "10px",
  margin: "0px",
  backgroundColor: active ? "#0387D9" : mode === "light" ? "#FFFFFF" : "#7F7F7F",
  borderRadius: "8px",
}));

export const FilterButton = styled(Button)(({ active, mode }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "4px 6px ",
  width: "150px",
  backgroundColor: mode === "light" ? "#FFFFFF" : "#7F7F7F",
  borderRadius: "8px",
  border: "1px solid #d5d5d5",
  boxShadow: "none",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#c5c5c5",
    boxShadow: "none",
  },
}));

export const FilterMenu = styled(Menu)(({ anchorEl, mode }) => ({
  "& .MuiPaper-root": {
    width: anchorEl?.offsetWidth,
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    backgroundColor: mode === "light" ? "#F6F6F6" : "#7F7F7F",
  },
}));

export const FilterMenuItem = styled(MenuItem)(({ active, mode }) => ({
  padding: "8px 16px",
  color: mode === "light" ? "#212121" : "white",
  "&:hover": {
    backgroundColor: mode === "light" ? "#FFFFFF" : "#03141F",
    color: mode === "light" ? "#212121" : "white",
  },
}));

export const CustomInputBase = styled(InputBase)(({ active, mode }) => ({
    width: "100%",
    height: "30px",
    borderRadius: "25px",
    border: "1px solid #d5d5d5",
    backgroundColor: mode === "light" ? "#ffffff" : "#7F7F7F",
    "& .MuiInputBase-input": {
      color: mode === "light" ? "#212121" : "white",
      fontSize: "13px",
      fontWeight: 400,
      "&::placeholder": {
        color: mode === "light" ? "#9b9b9b" : "white",
        opacity: 1,
      },
    },
    pl: "0px",
    pr: "16px",
    "&:focus-within": {
      outline: "none",
      boxShadow: "0 0 0 1px #d5d5d5",
    }
}));
export default Section2FinancialManagement;
