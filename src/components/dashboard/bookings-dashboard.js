import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  styled,
  LinearProgress,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import CurrentOrderSummary from "./current-order-summary";
import BookingSummary from "./booking-summary";


const Dashboard1 = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("monthly");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const menuItems = [
    {
      label: "Monthly",
      value: "monthly",
    },
    {
      label: "Yearly",
      value: "yearly",
    },
    {
      label: "Weekly",
      value: "weekly",
    },
  ];

  const financialSummaryData = [
    {
      invoiceNumber: "INV-006",
      amount: "$4,200",
      dueDate: "2025-08-05",
    },
    {
      invoiceNumber: "INV-007",
      amount: "$3,500",
      dueDate: "2025-08-10",
    },  
    {
      invoiceNumber: "INV-008",
      amount: "$2,800",
      dueDate: "2025-08-15",
    }]
    
    
  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F8FBFF",
        padding: "20px",
        gap: "20px",
      }}
    >
      <Grid  container  spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          {/* Low Inventories */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0px 2px 8px 0px #0000001A",
              textAlign: "start",
              gap: "30px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <DashBoardTitleText>Low Inventories</DashBoardTitleText>
              <DashBoardDescriptionText>
                Low inventory alerts on the dashboard to notify vendors of stock
                shortages in real time.
              </DashBoardDescriptionText>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#E3E7FF",
                  borderRadius: "8px",
                  padding: "17px",
                  height: "180px",
                  width: "275px",
                  alignContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    textAlign: "start",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <DashBoardTitleText>-8%</DashBoardTitleText>
                    <DashBoardTitleText>Engine Oil</DashBoardTitleText>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "12px" }}>
                      {" "}
                      -5% from yesterday
                    </span>
                    <CustomLinearProgress
                      color="#909ADE"
                      variant="determinate"
                      value={50}
                    />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: "#FFFFD0",
                  borderRadius: "8px",
                  padding: "17px",
                  height: "180px",
                  width: "275px",
                  alignContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    textAlign: "start",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <DashBoardTitleText>-13%</DashBoardTitleText>
                    <DashBoardTitleText>Fuel</DashBoardTitleText>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "12px" }}>
                      {" "}
                      -13% from yesterday
                    </span>
                    <CustomLinearProgress
                      color="#D1D185"
                      variant="determinate"
                      value={50}
                    />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: "#E0F1E0",
                  borderRadius: "8px",
                  padding: "17px",
                  height: "180px",
                  width: "275px",
                  alignContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    textAlign: "start",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <DashBoardTitleText>-25%</DashBoardTitleText>
                    <DashBoardTitleText>Diesel</DashBoardTitleText>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "12px" }}>
                      {" "}
                      -25% from yesterday
                    </span>
                    <CustomLinearProgress
                      color="#A2D4A2"
                      variant="determinate"
                      value={25}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} lg={6} >
          {/* Financial Summary */}
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)",
              textAlign: "start",
              gap: "30px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                justifyContent: "space-between",
              }}
            >
              <DashBoardTitleText>Financial Summary</DashBoardTitleText>
              <CustomSelect
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                variant="outlined"
              >
                {menuItems.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "10px",
              }}
            > 
              {financialSummaryData.map((item, index) => (
                <Box key={index} sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderRadius: "8px",
                border: "1px solid #EFEFEF",
              }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <FinancialSummaryDescriptionText>Invoice {item.invoiceNumber}</FinancialSummaryDescriptionText>
                  <FinancialSummaryDescriptionText>
                  Amount: {item.amount} - Due: {item.dueDate}
                  </FinancialSummaryDescriptionText>
                </Box>

                <Box>
                  <FinancialSummaryButton><ViewButtonText>View</ViewButtonText></FinancialSummaryButton>
                </Box>
              </Box>
              ))}

              
              
            </Box>
          </Box>
        </Grid>
      </Grid>



      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          {/* Current Order Summary */}   
            <CurrentOrderSummary />
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          {/* Booking Summary */}
          <BookingSummary />
        </Grid>
        
        
      </Grid>
    </Box>
  );
};

export const DashBoardTitleText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 700,
  fontSize: "15px",
  lineHeight: "111.00000000000001%",
  letterSpacing: "0%",
  color: "#212121",
});

export const DashBoardDescriptionText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "12px",
});

const CustomLinearProgress = styled(LinearProgress)(({ theme, color }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: "white",
  "& .MuiLinearProgress-bar": {
    backgroundColor: color,
  },
}));

const CustomSelect = styled(Select)({
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "10px",
  width: "fit-content",
  height: "29px",
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "10px",
  lineHeight: "150%",
  letterSpacing: "0%",
});

const FinancialSummaryButton = styled(Button)({
  backgroundColor: "#EFEFEF",
  color: "#565656",
  borderRadius: "8px",
  padding: "10px",
  textTransform: "none",
  fontSize: "10px",
  fontWeight: 400,
  fontFamily: "Plus Jakarta Sans",
  lineHeight: "150%",
  letterSpacing: "0%",
  
});

export const FinancialSummaryDescriptionText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "12px",
  color: "#212121",
});

const ViewButtonText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0%",
  color: "#565656",
});


export default Dashboard1;
