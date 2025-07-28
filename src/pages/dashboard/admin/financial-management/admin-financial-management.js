import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { getAdminInvoices } from "../../../../services/adminFinancialService";
import SummaryCards from "./SummaryCards";
import TypeBreakdown from "./TypeBreakdown";
import InvoiceTable from "./InvoiceTable";

const AdminFinancialManagement = () => {
  const { setPageTitle } = useOutletContext() || {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState(null);

  // Set page title
  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Financial Management");
  }, [setPageTitle]);

  // Fetch invoice data
  const fetchInvoices = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAdminInvoices(page, 20);

      if (response.status) {
        setInvoices(response.data.invoices);
        setPagination(response.data.pagination);
        setSummary(response.data.summary);
      } else {
        setError("Failed to fetch invoice data");
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load financial data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchInvoices(1);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchInvoices(newPage);
  };

  // Handle error close
  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F8FBFF",
        p: isMobile ? 2 : isTablet ? 3 : 3,
      }}
    >
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Summary Cards - Full Width */}
        <Grid item xs={12}>
          <SummaryCards summary={summary} />
        </Grid>

        {/* Type Breakdown and Invoice Table */}
        <Grid item xs={12} lg={4}>
          <TypeBreakdown
            byType={summary?.byType}
            totalAmount={summary?.totalAmount}
          />
        </Grid>

        <Grid item xs={12} lg={8}>
          <InvoiceTable
            invoices={invoices}
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminFinancialManagement;
