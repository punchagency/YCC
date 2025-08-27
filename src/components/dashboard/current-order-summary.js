import { Box, Tab, Tabs, Typography, styled } from "@mui/material";
import BasicTable from "./basic-table";
import { useTheme } from "../../context/theme/themeContext";

const CurrentOrderSummary = ({ orderSummary, onStatusChange, currentStatus }) => {
  const { theme } = useTheme();

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
    if (onStatusChange) {
      onStatusChange(newValue);
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
          value={currentStatus}
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
          {orderSummary && <BasicTable orders={orderSummary.result} />}
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

export default CurrentOrderSummary;
