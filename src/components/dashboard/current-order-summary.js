import { Box, Typography, styled } from "@mui/material";
import BasicTable from "./basic-table";
const CurrentOrderSummary = () => {
  const summaryData = [
    {
      title: "Total Orders",
      value: 523,
    },
    {
      title: "Pending Orders",
      value: 20,
    },
    {
      title: "Completed Orders",
      value: 620,
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
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
        <DashBoardTitleText>Current Order Summary</DashBoardTitleText>
        <DashBoardDescriptionText>
          Displays real-time updates on placed, pending, and completed orders.
        </DashBoardDescriptionText>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "20px" }}>
          {summaryData.map((item, index) => (
            <SummaryWidgetBox>
                <Box>
                    <DashBoardTitleText>{item.value}</DashBoardTitleText>
                    <CurrentSummarySubText>{item.title}</CurrentSummarySubText>
                </Box>
            </SummaryWidgetBox>
          ))}
        </Box>

          {/* Table */}
        <Box sx={{marginTop: "10px"}}>
          <BasicTable />
        </Box>
      </Box>
    </Box>
  );
};

const DashBoardTitleText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "32px",
  letterSpacing: "0%",
  color: "#212121",
});

const DashBoardDescriptionText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "12px",
});
const CurrentSummarySubText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: 14,
  marginTop: "10px",
  padding: 0,
  letterSpacing: 0,
  color: "#212121",
});

const SummaryWidgetBox = styled(Box)({
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
});


export default CurrentOrderSummary;
