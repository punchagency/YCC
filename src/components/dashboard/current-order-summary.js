import { Box, Tab, Tabs, Typography, styled } from "@mui/material";
import React, { useState } from "react";
import BasicTable from "./basic-table";
import { useTheme } from "../../context/theme/themeContext";
import { useOrder } from "../../context/order/orderContext";

const CurrentOrderSummary = ({ orderSummary, fetchOrderSummary }) => {
  const { theme } = useTheme();
  const { orderSummaryLoading } = useOrder();
  const [activeTab, setActiveTab] = useState('total');

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

  React.useEffect(()=>{
    if(activeTab === 'total'){
      fetchOrderSummary();
    }else{
      fetchOrderSummary(activeTab === 'pending' ? 'pending' : 'delivered');
    }
  }, [activeTab]);

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
          <BasicTable orders={orderSummary?.result} loading={orderSummaryLoading} />
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
