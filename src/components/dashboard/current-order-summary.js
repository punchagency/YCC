import { Box, Typography, styled } from "@mui/material";
import BasicTable from "./basic-table";
import { useTheme } from "../../context/theme/themeContext";
const CurrentOrderSummary = ({ orderSummary }) => {
  const { theme } = useTheme();
  const summaryData = [
    {
      title: "Total Orders",
      value: orderSummary.totalData,
    },
    {
      title: "Pending Orders",
      value: orderSummary.pendingOrders,
    },
    {
      title: "Completed Orders",
      value: orderSummary.completedOrders,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme === "light" ? "white" : "#03141F",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0px 2px 8px 0px #0000001A",
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
        <DashBoardTitleText mode={theme}>Current Order Summary</DashBoardTitleText>
        <DashBoardDescriptionText mode={theme}>
          Displays real-time updates on placed, pending, and completed orders.
        </DashBoardDescriptionText>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "20px" }}>
          {summaryData.map((item, index) => (
            <SummaryWidgetBox mode={theme}>
                <Box>
                    <DashBoardTitleText mode={theme}>{item.value}</DashBoardTitleText>
                    <CurrentSummarySubText mode={theme}>{item.title}</CurrentSummarySubText>
                </Box>
            </SummaryWidgetBox>
          ))}
        </Box>

          {/* Table */}
        <Box sx={{marginTop: "10px"}}>
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
