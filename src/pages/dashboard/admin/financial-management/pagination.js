import { Box, Typography, Select, MenuItem, IconButton } from "@mui/material"
import {
  KeyboardArrowDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material"


const Pagination = ({
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  const handleItemsPerPageChange = (event) => {
    onItemsPerPageChange?.(event.target.value)
  }

  const handlePageChange = (event) => {
    onPageChange?.(event.target.value)
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "8px 16px",
        color: "#5e6366",
        fontSize: "14px",
      }}
    >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* Items Per Page Dropdown */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          IconComponent={ChevronDownIcon}
          size="small"
          sx={{
            width: "64px",
            height: "28px",
            backgroundColor: "#5E636614",
            border: "1px solid #b3b3b3",
            borderRadius: "4px",
            color: "#5e6366",
            "& .MuiSelect-select": {
              padding: "4px 8px",
              paddingRight: "24px !important",
            },
            "& .MuiSvgIcon-root": {
              color: "#6c6c6c",
              right: "2px",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                border: "1px solid #b3b3b3",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              },
            },
          }}
        >
          {[5, 10, 20, 50, 100].map((value) => (
            <MenuItem key={value} value={value} sx={{ backgroundColor: "#5E636614" }}>
              {value}
            </MenuItem>
          ))}
        </Select>
        <Typography sx={{ color: "#B3B3B3", fontSize: "14px" }}>Items Per Page</Typography>
      </Box>

      {/* Items Range Display */}
      <Typography sx={{ color: "#5e6366", fontSize: "14px" }}>
        {startItem}-{endItem} Of {totalItems} Items
      </Typography>
      </Box>
      {/* Page Selection */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Select
          value={currentPage}
          onChange={handlePageChange}
          IconComponent={ChevronDownIcon}
          size="small"
          sx={{
            width: "64px",
            height: "28px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #b3b3b3",
            borderRadius: "4px",
            color: "#5e6366",
            "& .MuiSelect-select": {
              padding: "4px 8px",
              paddingRight: "24px !important",
            },
            "& .MuiSvgIcon-root": {
              color: "#6c6c6c",
              right: "2px",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: "200px",
                border: "1px solid #b3b3b3",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              },
            },
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <MenuItem key={page} value={page} sx={{ backgroundColor: "#5E636614" }}>
              {page}
            </MenuItem>
          ))}
        </Select>
        <Typography sx={{ color: "#84878a", fontSize: "14px" }}>Of {totalPages} Pages</Typography>

        {/* Navigation Arrows */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <IconButton
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            sx={{
              padding: "4px",
              color: "#5e6366",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
              "&.Mui-disabled": {
                opacity: 0.5,
              },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: "17px" }} />
          </IconButton>
          <IconButton
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            sx={{
              padding: "4px",
              color: "#5e6366",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
              "&.Mui-disabled": {
                opacity: 0.5,
              },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: "17px" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default Pagination;
