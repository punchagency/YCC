import React from "react";
import { Box, Typography, styled, InputBase, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import ShareIcon from "@mui/icons-material/Share";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DashboardHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "white",
        padding: "20px",
        gap: "20px",
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Search Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            maxWidth: "400px",
          }}
        >
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: "#6B7280" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Reports"
              inputProps={{ "aria-label": "search" }}
            />
          </SearchContainer>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <ActionButton>
            <FilterListIcon sx={{ fontSize: 20 }} />
            <Typography>Filter By</Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
          </ActionButton>

          <ActionButton>
            <SortIcon sx={{ fontSize: 20 }} />
            <Typography>Sort By</Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
          </ActionButton>

          <ActionButton>
            <ShareIcon sx={{ fontSize: 20 }} />
            <Typography>Share</Typography>
          </ActionButton>
        </Box>
      </Box>
    </Box>
  );
};

const SearchContainer = styled(Box)({
  position: "relative",
  borderRadius: "8px",
  backgroundColor: "#F9FAFB",
  width: "100%",
  border: "1px solid #E5E7EB",
});

const SearchIconWrapper = styled(Box)({
  padding: "0 12px",
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledInputBase = styled(InputBase)({
  color: "#111827",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: "8px 8px 8px 40px",
    fontSize: "14px",
    width: "100%",
  },
});

const ActionButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  backgroundColor: "white",
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  color: "#374151",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#F9FAFB",
  },
  "& .MuiTypography-root": {
    fontSize: "14px",
    fontWeight: 500,
  },
});

export default DashboardHeader;
