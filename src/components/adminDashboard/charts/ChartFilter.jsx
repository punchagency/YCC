import React from "react";
import { Box, FormControl, Select, MenuItem, Typography } from "@mui/material";
import { FilterList as FilterIcon } from "@mui/icons-material";

/**
 * ChartFilter Component
 * Reusable filter component for chart time ranges
 *
 * @param {Object} props - Component props
 * @param {number} props.selectedDays - Currently selected number of days
 * @param {Function} props.onFilterChange - Callback when filter changes
 * @param {string} props.label - Filter label (optional)
 * @returns {JSX.Element} ChartFilter component
 */
const ChartFilter = ({
  selectedDays = 30,
  onFilterChange,
  label = "Time Range",
}) => {
  // Predefined time range options
  const timeRangeOptions = [
    { value: 7, label: "Last 7 Days" },
    { value: 30, label: "Last 30 Days" },
    { value: 90, label: "Last 3 Months" },
    { value: 180, label: "Last 6 Months" },
  ];

  /**
   * Handle filter change
   * @param {Object} event - Change event
   */
  const handleChange = (event) => {
    const newDays = event.target.value;
    onFilterChange(newDays);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: { xs: 0, sm: 2 },
        flexDirection: { xs: "row", sm: "row" },
        flexWrap: { xs: "nowrap", sm: "nowrap" },
      }}
    >
      <FilterIcon sx={{ color: "primary.main", fontSize: 18 }} />
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: 500,
          minWidth: "fit-content",
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
        }}
      >
        {label}:
      </Typography>
      <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 140 } }}>
        <Select
          value={selectedDays}
          onChange={handleChange}
          displayEmpty
          sx={{
            "& .MuiSelect-select": {
              py: 0.5,
              px: { xs: 1, sm: 1.5 },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              fontWeight: 500,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.12)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
              borderWidth: "1px",
            },
          }}
        >
          {timeRangeOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                py: 0.5,
                px: { xs: 1, sm: 1.5 },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ChartFilter;
