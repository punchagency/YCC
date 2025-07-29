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

  // Dummy data for testing - matches API response structure
  const dummyInvoices = [
    {
      _id: "inv_001",
      invoiceId: "INV-2024-001",
      type: "order",
      status: "paid",
      amount: 250000, // $2,500.00
      currency: "USD",
      invoiceDate: "2024-01-15T10:30:00Z",
      dueDate: "2024-02-15T10:30:00Z",
      paymentDate: "2024-01-20T14:22:00Z",
      invoiceUrl: "https://example.com/invoices/inv-001.pdf",
      customer: {
        _id: "cust_001",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1-555-0123",
      },
      suppliers: [
        {
          _id: "sup_001",
          businessName: "Global Logistics Co.",
          email: "contact@globallogistics.com",
          phone: "+1-555-0100",
        },
      ],
      orderId: "ORD-2024-001",
      quoteId: null,
      bookingId: null,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:22:00Z",
    },
    {
      _id: "inv_002",
      invoiceId: "INV-2024-002",
      type: "booking",
      status: "pending",
      amount: 180000, // $1,800.00
      currency: "USD",
      invoiceDate: "2024-01-18T09:15:00Z",
      dueDate: "2024-02-18T09:15:00Z",
      paymentDate: null,
      invoiceUrl: "https://example.com/invoices/inv-002.pdf",
      customer: {
        _id: "cust_002",
        name: "Sarah Johnson",
        email: "sarah.j@business.com",
        phone: "+1-555-0124",
      },
      suppliers: [
        {
          _id: "sup_002",
          businessName: "Express Shipping Solutions",
          email: "info@expressshipping.com",
          phone: "+1-555-0101",
        },
      ],
      orderId: null,
      quoteId: null,
      bookingId: "BK-2024-002",
      createdAt: "2024-01-18T09:15:00Z",
      updatedAt: "2024-01-18T09:15:00Z",
    },
    {
      _id: "inv_003",
      invoiceId: "INV-2024-003",
      type: "quote",
      status: "paid",
      amount: 95000, // $950.00
      currency: "USD",
      invoiceDate: "2024-01-20T16:45:00Z",
      dueDate: "2024-02-20T16:45:00Z",
      paymentDate: "2024-01-25T11:30:00Z",
      invoiceUrl: "https://example.com/invoices/inv-003.pdf",
      customer: {
        _id: "cust_003",
        name: "Michael Chen",
        email: "mchen@techstartup.com",
        phone: "+1-555-0125",
      },
      suppliers: [
        {
          _id: "sup_003",
          businessName: "Premium Cargo Services",
          email: "service@premiumcargo.com",
          phone: "+1-555-0102",
        },
      ],
      orderId: null,
      quoteId: "QT-2024-003",
      bookingId: null,
      createdAt: "2024-01-20T16:45:00Z",
      updatedAt: "2024-01-25T11:30:00Z",
    },
    {
      _id: "inv_004",
      invoiceId: "INV-2024-004",
      type: "order",
      status: "failed",
      amount: 320000, // $3,200.00
      currency: "USD",
      invoiceDate: "2024-01-22T13:20:00Z",
      dueDate: "2024-02-22T13:20:00Z",
      paymentDate: null,
      invoiceUrl: "https://example.com/invoices/inv-004.pdf",
      customer: {
        _id: "cust_004",
        name: "Emily Rodriguez",
        email: "emily.r@manufacturing.com",
        phone: "+1-555-0126",
      },
      suppliers: [
        {
          _id: "sup_004",
          businessName: "Industrial Transport Ltd.",
          email: "contact@industrialtransport.com",
          phone: "+1-555-0103",
        },
      ],
      orderId: "ORD-2024-004",
      quoteId: null,
      bookingId: null,
      createdAt: "2024-01-22T13:20:00Z",
      updatedAt: "2024-01-22T13:20:00Z",
    },
    {
      _id: "inv_005",
      invoiceId: "INV-2024-005",
      type: "booking",
      status: "paid",
      amount: 145000, // $1,450.00
      currency: "USD",
      invoiceDate: "2024-01-25T08:30:00Z",
      dueDate: "2024-02-25T08:30:00Z",
      paymentDate: "2024-01-28T15:45:00Z",
      invoiceUrl: "https://example.com/invoices/inv-005.pdf",
      customer: {
        _id: "cust_005",
        name: "David Wilson",
        email: "dwilson@retailchain.com",
        phone: "+1-555-0127",
      },
      suppliers: [
        {
          _id: "sup_005",
          businessName: "FastTrack Logistics",
          email: "info@fasttracklogistics.com",
          phone: "+1-555-0104",
        },
      ],
      orderId: null,
      quoteId: null,
      bookingId: "BK-2024-005",
      createdAt: "2024-01-25T08:30:00Z",
      updatedAt: "2024-01-28T15:45:00Z",
    },
    {
      _id: "inv_006",
      invoiceId: "INV-2024-006",
      type: "quote",
      status: "pending",
      amount: 75000, // $750.00
      currency: "USD",
      invoiceDate: "2024-01-28T11:00:00Z",
      dueDate: "2024-02-28T11:00:00Z",
      paymentDate: null,
      invoiceUrl: "https://example.com/invoices/inv-006.pdf",
      customer: {
        _id: "cust_006",
        name: "Lisa Thompson",
        email: "lisa.t@consulting.com",
        phone: "+1-555-0128",
      },
      suppliers: [
        {
          _id: "sup_006",
          businessName: "Elite Shipping Partners",
          email: "service@eliteshipping.com",
          phone: "+1-555-0105",
        },
      ],
      orderId: null,
      quoteId: "QT-2024-006",
      bookingId: null,
      createdAt: "2024-01-28T11:00:00Z",
      updatedAt: "2024-01-28T11:00:00Z",
    },
    {
      _id: "inv_007",
      invoiceId: "INV-2024-007",
      type: "order",
      status: "paid",
      amount: 420000, // $4,200.00
      currency: "USD",
      invoiceDate: "2024-01-30T14:15:00Z",
      dueDate: "2024-02-30T14:15:00Z",
      paymentDate: "2024-02-02T09:20:00Z",
      invoiceUrl: "https://example.com/invoices/inv-007.pdf",
      customer: {
        _id: "cust_007",
        name: "Robert Brown",
        email: "rbrown@construction.com",
        phone: "+1-555-0129",
      },
      suppliers: [
        {
          _id: "sup_007",
          businessName: "Heavy Haul Transport",
          email: "contact@heavyhaul.com",
          phone: "+1-555-0106",
        },
      ],
      orderId: "ORD-2024-007",
      quoteId: null,
      bookingId: null,
      createdAt: "2024-01-30T14:15:00Z",
      updatedAt: "2024-02-02T09:20:00Z",
    },
    {
      _id: "inv_008",
      invoiceId: "INV-2024-008",
      type: "booking",
      status: "failed",
      amount: 110000, // $1,100.00
      currency: "USD",
      invoiceDate: "2024-02-01T10:45:00Z",
      dueDate: "2024-03-01T10:45:00Z",
      paymentDate: null,
      invoiceUrl: "https://example.com/invoices/inv-008.pdf",
      customer: {
        _id: "cust_008",
        name: "Jennifer Davis",
        email: "jdavis@ecommerce.com",
        phone: "+1-555-0130",
      },
      suppliers: [
        {
          _id: "sup_008",
          businessName: "Digital Express Solutions",
          email: "info@digitalexpress.com",
          phone: "+1-555-0107",
        },
      ],
      orderId: null,
      quoteId: null,
      bookingId: "BK-2024-008",
      createdAt: "2024-02-01T10:45:00Z",
      updatedAt: "2024-02-01T10:45:00Z",
    },
    {
      _id: "inv_009",
      invoiceId: "INV-2024-009",
      type: "quote",
      status: "paid",
      amount: 85000, // $850.00
      currency: "USD",
      invoiceDate: "2024-02-03T16:30:00Z",
      dueDate: "2024-03-03T16:30:00Z",
      paymentDate: "2024-02-05T12:15:00Z",
      invoiceUrl: "https://example.com/invoices/inv-009.pdf",
      customer: {
        _id: "cust_009",
        name: "Thomas Anderson",
        email: "tanderson@software.com",
        phone: "+1-555-0131",
      },
      suppliers: [
        {
          _id: "sup_009",
          businessName: "Tech Logistics Pro",
          email: "service@techlogistics.com",
          phone: "+1-555-0108",
        },
      ],
      orderId: null,
      quoteId: "QT-2024-009",
      bookingId: null,
      createdAt: "2024-02-03T16:30:00Z",
      updatedAt: "2024-02-05T12:15:00Z",
    },
    {
      _id: "inv_010",
      invoiceId: "INV-2024-010",
      type: "order",
      status: "pending",
      amount: 280000, // $2,800.00
      currency: "USD",
      invoiceDate: "2024-02-05T09:00:00Z",
      dueDate: "2024-03-05T09:00:00Z",
      paymentDate: null,
      invoiceUrl: "https://example.com/invoices/inv-010.pdf",
      customer: {
        _id: "cust_010",
        name: "Amanda Garcia",
        email: "agarcia@pharmaceutical.com",
        phone: "+1-555-0132",
      },
      suppliers: [
        {
          _id: "sup_010",
          businessName: "Medical Transport Specialists",
          email: "contact@medicaltransport.com",
          phone: "+1-555-0109",
        },
      ],
      orderId: "ORD-2024-010",
      quoteId: null,
      bookingId: null,
      createdAt: "2024-02-05T09:00:00Z",
      updatedAt: "2024-02-05T09:00:00Z",
    },
  ];

  // Dummy summary data
  const dummySummary = {
    totalAmount: 2000000, // $20,000.00
    totalPaid: 1200000, // $12,000.00
    totalPending: 535000, // $5,350.00
    totalFailed: 430000, // $4,300.00
    totalCount: 10,
    paidCount: 6,
    pendingCount: 3,
    failedCount: 1,
    byType: {
      order: {
        totalAmount: 1250000, // $12,500.00
        count: 5,
      },
      booking: {
        totalAmount: 435000, // $4,350.00
        count: 3,
      },
      quote: {
        totalAmount: 255000, // $2,550.00
        count: 2,
      },
    },
  };

  // Dummy pagination data
  const dummyPagination = {
    currentPage: 1,
    totalPages: 2, // 10 records ÷ 5 per page = 2 pages
    totalInvoices: 10,
    hasNextPage: true, // Can go to page 2
    hasPrevPage: false, // On first page
  };

  // Set page title
  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Financial Management");
  }, [setPageTitle]);

  // Fetch invoice data
  const fetchInvoices = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // For now, use dummy data instead of API call
      const response = await getAdminInvoices(page, 5); // Changed limit to 5

      // Simulate API delay
      // await new Promise((resolve) => setTimeout(resolve, 500));

      // // Use dummy data with pagination
      // const itemsPerPage = 5;
      // const startIndex = (page - 1) * itemsPerPage;
      // const endIndex = startIndex + itemsPerPage;
      // const paginatedInvoices = dummyInvoices.slice(startIndex, endIndex);

      // // Update pagination data based on current page
      // const updatedPagination = {
      //   currentPage: page,
      //   totalPages:
      //     dummyInvoices.length > 0
      //       ? Math.ceil(dummyInvoices.length / itemsPerPage)
      //       : 1,
      //   totalInvoices: dummyInvoices.length,
      //   hasNextPage:
      //     dummyInvoices.length > 0
      //       ? page < Math.ceil(dummyInvoices.length / itemsPerPage)
      //       : false,
      //   hasPrevPage: page > 1,
      // };

      // setInvoices(paginatedInvoices);
      // setPagination(updatedPagination);
      // setSummary(dummySummary);

      // Uncomment below when you want to use real API
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
        p: isMobile ? 1 : isTablet ? 3 : 3,
        pt: isMobile ? 0 : 5,
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
          <SummaryCards summary={summary} loading={loading} />
        </Grid>

        {/* Type Breakdown and Invoice Table */}
        <Grid item xs={12} lg={4}>
          <TypeBreakdown
            byType={summary?.byType}
            totalAmount={summary?.totalAmount}
            loading={loading}
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
