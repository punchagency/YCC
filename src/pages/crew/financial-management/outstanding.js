import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  DialogActions,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  AccountBalanceWallet,
  CheckCircle,
  Schedule
} from "@mui/icons-material";

const Outstanding = ({financeData, fetchData, setFinanceData}) => {
  // New expense modal state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "Exterior",
    amount: "",
    date: null,
    description: "",
  });

  // Categories for dropdown
  const expenseCategories = [
    "Rent",
    "Utilities",
    "Groceries",
    "Food",
    "Fuels",
    "Health",
    "Office",
    "Education",
    "Others",
  ];

  // Handle expense form input changes
  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date change specifically
  const handleDateChange = (e) => {
    setNewExpense((prev) => ({
      ...prev,
      date: e.value,
    }));
  };

  // Handle saving the expense
  const handleSaveExpense = () => {
    // Here you would typically save the expense data
    console.log("Saving expense:", newExpense);
    setShowExpenseModal(false);
    // Reset form
    setNewExpense({
      category: "Exterior",
      amount: "",
      date: null,
      description: "",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const cards = [
    {
      title: "Outstanding Invoices",
      amount: "$4,000",
      icon: <AccountBalanceWallet sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: '#fff3e0'
    },
    {
      title: "Completed Payments",
      amount: "$4,000",
      icon: <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: '#e8f5e8'
    },
    {
      title: "Upcoming Expenses",
      amount: "$4,000",
      icon: <Schedule sx={{ fontSize: 40, color: '#2196f3' }} />,
      color: '#e3f2fd'
    }
  ];

  return (
    <>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${card.color} 0%, #ffffff 100%)`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: 3,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'transparent',
                        width: 60,
                        height: 60
                      }}
                    >
                      {card.icon}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          fontWeight: 500,
                          mb: 0.5
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: '#333',
                          fontSize: { xs: '1.5rem', md: '2rem' }
                        }}
                      >
                        {card.amount}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontSize: '1.25rem',
            fontWeight: 600,
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          Add New Expense
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              select
              label="Category"
              name="category"
              value={newExpense.category}
              onChange={handleExpenseChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            >
              <MenuItem value="Exterior">Exterior</MenuItem>
              {expenseCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Amount"
              name="amount"
              value={newExpense.amount}
              onChange={handleExpenseChange}
              placeholder="$45.00"
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <TextField
              label="Description"
              name="description"
              value={newExpense.description}
              onChange={handleExpenseChange}
              placeholder="Lunch With Client"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setShowExpenseModal(false)}
            variant="outlined"
            color="error"
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: isMobile ? 'auto' : 120
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveExpense}
            variant="contained"
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#0387D9',
              minWidth: isMobile ? 'auto' : 120,
              '&:hover': {
                bgcolor: '#0277BD'
              }
            }}
          >
            Save Expense
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Outstanding;
