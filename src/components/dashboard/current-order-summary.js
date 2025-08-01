import { Box, Tab, Tabs, Typography, styled } from "@mui/material";
import { useState } from "react";
import BasicTable from "./basic-table";
import { useTheme } from "../../context/theme/themeContext";

const CurrentOrderSummary = ({ orderSummary }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('total');
  console.log({orderSummary});
  const summaryData = [
    {
      title: "Total",
      value: orderSummary.totalData,
      tabValue: 'total',
    },
    {
      title: "Pending", 
      value: orderSummary.pendingOrders,
      tabValue: 'pending',
    },
    {
      title: "Completed",
      value: orderSummary.completedOrders,
      tabValue: 'completed',
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getFilteredOrders = () => {
    if (!orderSummary?.result) return [];
    
    switch (activeTab) {
      case 'total':
        return orderSummary.result;
      case 'pending':
        return orderSummary.result.filter(order => order.status === 'pending');
      case 'completed':
        return orderSummary.result.filter(order => order.status === 'completed');
      default:
        return orderSummary.result;
    }
  };

  const getCurrentValue = () => {
    switch (activeTab) {
      case 'total':
        return orderSummary.totalData;
      case 'pending':
        return orderSummary.pendingOrders;
      case 'completed':
        return orderSummary.completedOrders;
      default:
        return orderSummary.totalData;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme === "light" ? "white" : "#03141F",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0px 2px 8px 0px #0000001A",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <DashBoardTitleText mode={theme}>Current Order Summary</DashBoardTitleText>
        <DashBoardDescriptionText mode={theme}>
          Displays real-time updates on placed, pending, and completed orders.
        </DashBoardDescriptionText>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="order status tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              minWidth: 'auto',
              padding: '8px 16px',
            }
          }}
        >
          {summaryData.map((item) => (
            <Tab 
              key={item.tabValue} 
              value={item.tabValue} 
              label={`${item.title} (${item.value || 0})`}
            />
          ))}
        </Tabs>

        {/* Table */}
        <Box sx={{ marginTop: "10px" }}>
          {orderSummary && <BasicTable orders={getFilteredOrders()} />}
        </Box>
      </Box>
    </Box>
  );
};

const DashBoardTitleText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 700,
  fontSize: "15px",
  lineHeight: "111.00000000000001%",
  letterSpacing: "0%",
  color: mode === "light" ? "#212121" : "white",
}));

const DashBoardDescriptionText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "12px",
  color: mode === "light" ? "#212121" : "white",
}));

const CurrentSummarySubText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: 14,
  marginTop: "10px",
  padding: 0,
  letterSpacing: 0,
  color: mode === "light" ? "#212121" : "white",
}));

const SummaryWidgetBox = styled(Box)(({ mode }) => ({
  display: "flex",
  width: "100%",
  height: "100%",
  gap: "10px",
  paddingTop: 14,
  paddingRight: 20,
  paddingBottom: 14,
  paddingLeft: 20,
  borderRadius: 12,
  boxShadow: "0px 1px 6px 0px #00000024",
  textAlign: "center",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: mode === "light" ? "white" : "#7A7A7A",
}));

export default CurrentOrderSummary;
