import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  styled,
  Select,
  MenuItem,
  Button,
  Grid2,
  Skeleton,
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
  const [value, setValue] = useState("all");
  const [orderSummaryStatus, setOrderSummaryStatus] = useState("total");
  const { orderSummary, loading: orderSummaryLoading, fetchOrderSummary } = useOrder();
  const { invoices, loading: invoicesLoading, fetchInvoices } = useInvoice();
  const { lowInventory, loading: inventoryLoading } = useInventory();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchOrderSummary({
      page: 1,
      limit: 5,
      status: orderSummaryStatus === "total" ? undefined : orderSummaryStatus,
      sort: {
        createdAt: -1,
      },
    });
  }, [orderSummaryStatus]);

  // Initial order data fetch on component mount
  useEffect(() => {
    fetchOrderSummary({
      page: 1,
      limit: 5,
      status: "total",
      sort: {
        createdAt: -1,
      },
    });
  }, []);

  // Separate useEffect for invoices
  useEffect(() => {
    fetchInvoices({
      page: 1,
      limit: 5,
      period: value,
    });
  }, [value]);

  // Initial invoice data fetch on component mount
  useEffect(() => {
    fetchInvoices({
      page: 1,
      limit: 5,
      period: "all",
    });
  }, []);

  const menuItems = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Monthly",
      value: "month",
    },
    {
      label: "Yearly",
      value: "year",
    },
    {
      label: "Weekly",
      value: "week",
    },
  ];

  // Skeleton component for order summary
  const OrderSummarySkeleton = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme === "light" ? "white" : "#03141F",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0px 2px 8px 0px #0000001A",
        gap: "20px",
      }}
    >
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="80%" height={16} />
      <Box sx={{ display: "flex", gap: "20px" }}>
        <Skeleton variant="text" width={80} height={32} />
        <Skeleton variant="text" width={80} height={32} />
        <Skeleton variant="text" width={80} height={32} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ display: "flex", gap: "10px" }}>
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="20%" height={20} />
          </Box>
        ))}
      </Box>
    </Box>
  );

  // Skeleton component for financial summary
  const FinancialSummarySkeleton = () => (
    <Box
      sx={{
        backgroundColor: theme === "light" ? "white" : "#03141F",
        borderRadius: "8px",
        padding: { xs: "15px", md: "20px" },
        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)",
        height: "100%",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="rectangular" width={100} height={29} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[1, 2, 3].map((item) => (
          <Box
            key={item}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              justifyContent: "space-between",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #EFEFEF",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="80%" height={16} />
            </Box>
            <Skeleton variant="rectangular" width={60} height={32} />
          </Box>
        ))}
      </Box>
    </Box>
  );

  // Empty state component for financial summary
  const FinancialSummaryEmptyState = () => (
    <Box
      sx={{
        backgroundColor: theme === "light" ? "white" : "#03141F",
        borderRadius: "8px",
        padding: { xs: "15px", md: "20px" },
        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)",
        textAlign: "start",
        height: "100%",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          justifyContent: "space-between",
          marginBottom: "20px",
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
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center",
          gap: "16px",
          flex: 1,
        }}
      >
        <Box
          sx={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: theme === "light" ? "#F5F5F5" : "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              color: theme === "light" ? "#999" : "#666",
            }}
          >
            💰
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 600,
              fontSize: "16px",
              color: theme === "light" ? "#666" : "#999",
              marginBottom: "8px",
            }}
          >
            No Invoices Available
          </Typography>
          <Typography
            sx={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 400,
              fontSize: "14px",
              color: theme === "light" ? "#999" : "#666",
              lineHeight: "1.4",
            }}
          >
            When invoices are created, they will appear here with payment details and due dates.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#F8FBFF",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        paddingTop: { xs: 0, md: 2 },
        paddingBottom: 0,
      }}
    >
      {/* Main Dashboard Grid Container */}
      <Grid2
        container
        spacing={1}
        sx={{
          width: "100%",
          margin: 0,
          paddingX: { xs: 2, sm: 3 },
          marginBottom: { xs: 2, md: 3 },
          '& > .MuiGrid2-root': {
            paddingLeft: { xs: 1, sm: 1.25, md: 1.5 },
            paddingTop: { xs: 1, sm: 1.25, md: 1.5 },
          }
        }}
      >
        {/* Current Order Summary - Takes more space on larger screens */}
        <Grid2 xs={12} md={12} lg={7} sx={{ flex: 1}} >
          {orderSummaryLoading ? (
            <OrderSummarySkeleton />
          ) : (
              <CurrentOrderSummary
                orderSummary={orderSummary}
                onStatusChange={setOrderSummaryStatus}
                currentStatus={orderSummaryStatus}
              />
            )}
        </Grid2>

        {/* Financial Summary - Complementary width */}
        <Grid2 xs={12} md={12} lg={5} sx={{ flex: 1}} >
          {invoicesLoading ? (
            <FinancialSummarySkeleton />
          ) : invoices && invoices.length > 0 ? (
            <Box
              sx={{
                backgroundColor: theme === "light" ? "white" : "#03141F",
                borderRadius: "8px",
                padding: { xs: "15px", md: "20px" },
                boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)",
                textAlign: "start",
                gap: { xs: "15px", md: "30px" },
                height: "100%",
                width: "100%",
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
                {invoices.map((item, index) => (
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
                      <FinancialSummaryButton mode={theme}
                        onClick={() => window.open(item.invoiceUrl, '_blank')}
                      >
                        <ViewButtonText mode={theme}>View</ViewButtonText>
                      </FinancialSummaryButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <FinancialSummaryEmptyState />
          )}
        </Grid2>
      </Grid2>

      {/* Bottom Row Grid Container */}
      <Grid2
        container
        spacing={1}
        sx={{
          width: "100%",
          margin: 0,
          paddingX: { xs: 2, sm: 3 },
          paddingBottom: { xs: 2, md: 3 },
          '& > .MuiGrid2-root': {
            paddingLeft: { xs: 1, sm: 1.25, md: 1.5 },
            paddingTop: { xs: 1, sm: 1.25, md: 1.5 },
          }
        }}
      >

        {/* Booking Summary - Equal width on larger screens */}
        <Grid2 xs={12} md={12} lg={6} sx={{ flex: 1}} >
          <BookingSummary />
        </Grid2>
      </Grid2>
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
