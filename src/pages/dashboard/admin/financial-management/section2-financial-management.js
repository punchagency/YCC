import { Box, Typography, Button, styled, Menu, MenuItem, InputBase, InputAdornment } from "@mui/material";
import { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";

const Section2FinancialManagement = () => {
  const [selectedButton, setSelectedButton] = useState("Pending Invoices");
  const buttons = ["Pending Invoices", "Completed Payments", "Upcoming Events"];
  const options = ["All", "Pending", "Completed", "Upcoming"];
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    setSelected(option);
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
          backgroundColor: "#FFFFFF",
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
            onClick={() => setSelectedButton(option)}
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
          <FilterButton onClick={handleClick}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FilterListIcon sx={{ color: "#000000", fontSize: "17px" }} />
              <Typography
                sx={{ color: "#9b9b9b", fontWeight: 400, fontSize: "13px" }}
              >
                {selected || "Select Filter"}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon
              sx={{ color: "#000000", fontSize: "17px" }}
            />
          </FilterButton>

          <FilterMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {options.map((option) => (
              <FilterMenuItem
                key={option}
                onClick={() => handleSelect(option)}>
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
          startAdornment={
            <InputAdornment position="start" sx={{ ml: "16px", mr: "4px" }}>
              <SearchIcon sx={{ color: "#212121", fontSize: "17px" }} />
            </InputAdornment>
          }
         
        />
      </Box>
      </Box>
    </Box>
    </Box>
  );
};

export const CustomButton = styled(Button)(({ active }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "12px",
  lineHeight: "100%",
  letterSpacing: "0%",
  textAlign: "center",
  verticalAlign: "middle",
  textTransform: "none",
  color: active ? "#FFFFFF" : "#212121",
  padding: "10px",
  margin: "0px",
  backgroundColor: active ? "#0387D9" : "#FFFFFF",
  borderRadius: "8px",
}));

export const FilterButton = styled(Button)(({ active }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "4px 6px ",
  width: "150px",
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  border: "1px solid #d5d5d5",
  boxShadow: "none",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#c5c5c5",
    boxShadow: "none",
  },
}));

export const FilterMenu = styled(Menu)(({ anchorEl }) => ({
  "& .MuiPaper-root": {
    width: anchorEl?.offsetWidth,
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#F6F6F6",
  },
}));

export const FilterMenuItem = styled(MenuItem)(({ active }) => ({
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "#FFFFFF",
  },
}));

export const CustomInputBase = styled(InputBase)(({ active }) => ({
    width: "100%",
    height: "30px",
    borderRadius: "25px",
    border: "1px solid #d5d5d5",
    backgroundColor: "#ffffff",
    "& .MuiInputBase-input": {
      color: "#212121",
      fontSize: "13px",
      fontWeight: 400,
      "&::placeholder": {
        color: "#9b9b9b",
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
