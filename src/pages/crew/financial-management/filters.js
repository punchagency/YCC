import React, { useState } from "react";
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Stack,
  Chip
} from "@mui/material";
import {
  Search,
  FilterList,
  ExpandMore
} from "@mui/icons-material";

const SearchFilters = ({
  onFilterChange = () => {},
  activeFilter = "all",
  onInvoiceTypeChange = () => {},
  onStartDateChange = () => {},
  onEndDateChange = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterDropdown, setFilterDropdown] = useState('');

  const handleFilterClick = (event, newFilter) => {
    if (newFilter !== null) {
      onFilterChange(newFilter);
    }
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.map((filter) => (
              <Chip
                key={filter.value}
                label={filter.label}
                onClick={() => onFilterChange(filter.value)}
                variant={activeFilter === filter.value ? 'filled' : 'outlined'}
                color={activeFilter === filter.value ? 'primary' : 'default'}
                sx={{
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  height: 32
                }}
              />
            ))}
          </Box>
          <FormControl 
            size="small" 
            fullWidth
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'white'
              }
            }}
          >
            <InputLabel>Invoice Type</InputLabel>
            <Select
              value={filterDropdown}
              label="Invoice Type"
              onChange={(e) => {
                setFilterDropdown(e.target.value);
                onInvoiceTypeChange(e.target.value);
              }}
              IconComponent={ExpandMore}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="order">Order</MenuItem>
              <MenuItem value="quote">Quotation</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Start Date"
            type="date"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'white'
              }
            }}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
          <TextField
            label="End Date"
            type="date"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'white'
              }
            }}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        flexWrap: { xs: 'wrap', lg: 'nowrap' },
        gap: 2
      }}>
        <Paper
          sx={{
            p: 0.5,
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: { xs: '100%', lg: 'fit-content' },
          }}
        >
          <ToggleButtonGroup
            value={activeFilter}
            exclusive
            onChange={handleFilterClick}
            sx={{
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: 2,
                px: { xs: 1.5, md: 2 },
                py: 0.75,
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                textTransform: 'none',
                fontWeight: 500,
                color: '#666',
                '&.Mui-selected': {
                  bgcolor: '#0387D9',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#0277BD'
                  }
                },
                '&:hover': {
                  bgcolor: '#f5f5f5'
                }
              }
            }}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="pending">Pending</ToggleButton>
            <ToggleButton value="completed">Completed</ToggleButton>
            <ToggleButton value="upcoming">Upcoming</ToggleButton>
          </ToggleButtonGroup>
        </Paper>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          minWidth: { xs: '100%', lg: 'auto' }
        }}>
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: { xs: 140, md: 180 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'white'
              }
            }}
          >
            <InputLabel>Invoice Type</InputLabel>
            <Select
              value={filterDropdown}
              label="Invoice Type"
              onChange={(e) => {
                setFilterDropdown(e.target.value);
                onInvoiceTypeChange(e.target.value);
              }}
              IconComponent={ExpandMore}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="order">Order</MenuItem>
              <MenuItem value="quote">Quotation</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: { xs: 140, md: 160 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'white'
              }
            }}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
          <TextField
            label="End Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: { xs: 140, md: 160 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'white'
              }
            }}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SearchFilters;
