import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  styled,
  LinearProgress,
  Select,
  MenuItem,
  Button,
  Grid2,
} from "@mui/material";
import CurrentOrderSummary from "./current-order-summary";
import BookingSummary from "./booking-summary";
import { useTheme } from "../../context/theme/themeContext";
import { useOrder } from "../../context/order/orderContext";
import { useInvoice } from "../../context/invoice/invoiceContext";
import { useInventory } from "../../context/inventory/inventoryContext";

const BookingsDashboard = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("monthly");
  const { orderSummary, fetchOrderSummary } = useOrder();
  const { invoices, fetchInvoices } = useInvoice();
  const { lowInventory, fetchLowInventory } = useInventory();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchOrderSummary();
    fetchInvoices();
    fetchLowInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("lowInventory", lowInventory);
  console.log("invoices", invoices);
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

  return (
    <Box
      paddingTop={{ xs: 0, md: 2 }}
      paddingBottom={0}
      className="flex flex-column bg-[#F8FBFF] h-auto min-h-screen w-full max-w-full"
    >
      <Box
        paddingTop={{ xs: 0, md: 2 }}
        paddingX={{ xs: 0, sm: 3 }}
        spacing={{ xs: 1, sm: 1.5, md: 2 }}
        display="flex"
        flexDirection={{ xs: "column", lg: "row" }}
        gap={{ xs: 2, lg: 3 }}
      >
        {/* <Grid2 item xs={12} md={6} lg={6} width="100%">
         
          {lowInventory && lowInventory.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme === "light" ? "white" : "#03141F",
                borderRadius: "8px",
                padding: { xs: "10px", sm: "15px", md: "20px" },
                boxShadow: "0px 2px 8px 0px #0000001A",
                textAlign: "start",
                gap: { xs: "15px", sm: "20px", md: "30px" },
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <DashBoardTitleText mode={theme}>
                  Low Inventories
                </DashBoardTitleText>
                <DashBoardDescriptionText mode={theme}>
                  Low inventory alerts on the dashboard to notify vendors of
                  stock shortages in real time.
                </DashBoardDescriptionText>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", lg: "row", xl: "column" },
                  gap: "10px",
                  width: "100%",
                  flexWrap: { xs: "nowrap", lg: "wrap", xl: "nowrap" },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#E3E7FF",
                    borderRadius: "8px",
                    padding: { xs: "12px", sm: "15px", md: "17px" },
                    height: { xs: "auto", md: "180px" },
                    width: { xs: "100%", lg: "32%", xl: "100%" },
                    minWidth: { xs: "100%", md: "auto" },
                    flexGrow: 1,
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
                      <DashBoardTitleInventoryText mode={theme}>
                        {lowInventory[0]?.percentageLeft || "N/A"}%
                      </DashBoardTitleInventoryText>
                      <DashBoardTitleInventoryText mode={theme}>
                        {lowInventory[0]?.product?.name || "N/A"}{" "}
                      </DashBoardTitleInventoryText>
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
                        {lowInventory[0]?.quantity || "N/A"} left from yesterday
                      </span>
                      <CustomLinearProgress
                        color="#909ADE"
                        variant="determinate"
                        value={lowInventory[0]?.percentageLeft || 0}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    backgroundColor: "#FFFFD0",
                    borderRadius: "8px",
                    padding: { xs: "12px", sm: "15px", md: "17px" },
                    height: { xs: "auto", md: "180px" },
                    width: { xs: "100%", lg: "32%", xl: "100%" },
                    minWidth: { xs: "100%", md: "auto" },
                    flexGrow: 1,
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
                      <DashBoardTitleInventoryText mode={theme}>
                        {lowInventory[1]?.percentageLeft || "N/A"}%
                      </DashBoardTitleInventoryText>
                      <DashBoardTitleInventoryText mode={theme}>
                        {lowInventory[1]?.product?.name || "N/A"}
                      </DashBoardTitleInventoryText>
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
                        {lowInventory[1]?.quantity || "N/A"} left from yesterday
                      </span>
                      <CustomLinearProgress
                        color="#D1D185"
                        variant="determinate"
                        value={lowInventory[1]?.percentageLeft || 0}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    backgroundColor: "#E0F1E0",
                    borderRadius: "8px",
                    padding: { xs: "12px", sm: "15px", md: "17px" },
                    height: { xs: "auto", md: "180px" },
                    width: { xs: "100%", lg: "50%", xl: "100%" },
                    minWidth: { xs: "100%", md: "auto" },
                    flexGrow: 1,
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
                      <DashBoardTitleInventoryText mode={theme}>
                        {lowInventory[2]?.percentageLeft || "N/A"}%
                      </DashBoardTitleInventoryText>
                      <DashBoardTitleInventoryText mode={theme}>
                        {lowInventory[2]?.product?.name || "N/A"}
                      </DashBoardTitleInventoryText>
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
                        {lowInventory[2]?.quantity || "N/A"} left from yesterday
                      </span>
                      <CustomLinearProgress
                        color="#A2D4A2"
                        variant="determinate"
                        value={lowInventory[2]?.percentageLeft || 0}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme === "light" ? "white" : "#03141F",
                borderRadius: "8px",
                padding: { xs: "15px", md: "20px" },
                boxShadow: "0px 2px 8px 0px #0000001A",
                textAlign: "start",
                gap: { xs: "15px", md: "30px" },
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DashBoardTitleText mode={theme}>
                No Available Inventories
              </DashBoardTitleText>
              <DashBoardDescriptionText mode={theme}>
                No low inventory alerts found. Please check back later.
              </DashBoardDescriptionText>
              <Link to="/admin/inventory-management">
                <Button
                  variant="contained"
                  startIcon={<AddBoxIcon />}
                  sx={{
                    bgcolor: "#0387d9",
                    color: "#ffffff",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "12px",
                    ":hover": {
                      bgcolor: "rgba(3, 135, 217, 0.9)",
                    },
                  }}
                  mode={theme}
                >
                  Add Inventory
                </Button>
              </Link>
            </Box>
          )}
        </Grid2> */}
        <Box width={{ xs: "100%", lg: "55%" }}>
          {/* Current Order Summary */}
          {orderSummary && <CurrentOrderSummary orderSummary={orderSummary} />}
        </Box>

        <Grid2 item xs={12} md={6} lg={6} width="100%">
          {/* Financial Summary */}
          {invoices && (
            <Box
              sx={{
                backgroundColor: theme === "light" ? "white" : "#03141F",
                borderRadius: "8px",
                padding: { xs: "15px", md: "20px" },
                boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)",
                textAlign: "start",
                gap: { xs: "15px", md: "30px" },
                height: "100%",
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
                <DashBoardTitleText mode={theme}>
                  Financial Summary
                </DashBoardTitleText>
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
                {invoices && invoices.length > 0 ? (
                  invoices.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        justifyContent: "space-between",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #EFEFEF",
                        backgroundColor:
                          theme === "light" ? "white" : "#03141F",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <FinancialSummaryDescriptionText mode={theme}>
                          Invoice {item.invoiceId}
                        </FinancialSummaryDescriptionText>
                        <FinancialSummaryDescriptionText mode={theme}>
                          Amount: ${parseFloat(item.amount || 0).toFixed(2)} -
                          Due:{" "}
                          {(() => {
                            try {
                              return item.dueDate
                                ? new Date(item.dueDate)
                                    .toISOString()
                                    .split("T")[0]
                                : "N/A";
                            } catch (error) {
                              console.warn(
                                "Invalid date format for invoice:",
                                item.invoiceId,
                                error
                              );
                              return "Invalid Date";
                            }
                          })()}
                        </FinancialSummaryDescriptionText>
                      </Box>

                      <Box>
                        <FinancialSummaryButton mode={theme}>
                          <ViewButtonText mode={theme}>View</ViewButtonText>
                        </FinancialSummaryButton>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                      color: theme === "light" ? "#666" : "#ccc",
                    }}
                  >
                    <Typography variant="body2">
                      No invoices available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Grid2>
      </Box>

      <Box
        paddingX={{ xs: 0, sm: 3 }}
        paddingTop={{ xs: 1, sm: 2, md: 3 }}
        display="flex"
        flexDirection={{ xs: "column", lg: "row" }}
        gap={{ xs: 2, lg: 3 }}
      >
        

        <Grid2 item xs={12} md={6} lg={6} width="100%">
          {/* Booking Summary */}
          <BookingSummary />
        </Grid2>
      </Box>
    </Box>
  );
};

export const DashBoardTitleText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 700,
  fontSize: { xs: "14px", sm: "15px" },
  lineHeight: "111.00000000000001%",
  letterSpacing: "0%",
  color: mode === "light" ? "#212121" : "white",
  "@media (max-width: 600px)": {
    fontSize: "14px",
  },
}));

export const DashBoardTitleInventoryText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 700,
  fontSize: "15px",
  lineHeight: "111.00000000000001%",
  letterSpacing: "0%",
  color: "#212121",
}));

export const DashBoardDescriptionText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "12px",
  color: mode === "light" ? "#212121" : "white",
}));

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

export const FinancialSummaryDescriptionText = styled(Typography)(
  ({ mode }) => ({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 400,
    fontSize: "12px",
    color: mode === "light" ? "#212121" : "white",
  })
);

const ViewButtonText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0%",
  color: "#565656",
});

export default BookingsDashboard;
