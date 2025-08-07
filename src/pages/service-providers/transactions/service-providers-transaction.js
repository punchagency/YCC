import React from 'react';
import { useTheme } from "../../../context/theme/themeContext";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Alert,
  Snackbar,
  Paper,
  Stack,
  alpha,
  Card,
  CardContent,
  Avatar,
  Chip,
  Container,
  Skeleton,
  ListItem,
  ListItemText,
  ListItemIcon,
  List,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  AccountBalance as RevenueIcon,
} from "@mui/icons-material";
import { fetchFinancialAnalysis } from '../../../services/service/newServiceEndpoints';

const ServiceProvidersTransactions = () => {
  const { setPageTitle } = useOutletContext() || {};
  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Financial Management");
  }, [setPageTitle]);
  const [params, setParams] = React.useState({ page: 1, limit: 10, status: "all", period: "year", startDate: null, endDate: null });
  const [financialData, setFinancialData] = React.useState({});
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetchFinancialAnalysis(params);
      console.log(response.data);
      if (response.status) {
        setFinancialData(response.data)
      } else {
        setSnackbar({ open: true, message: "Failed to load dashboard data", severity: "error" });
      }
    } catch (error) {
      console.error('Error fetching financial analysis:', error);
      setSnackbar({ open: true, message: "Error loading dashboard", severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalysis();
  }, [params]);

  return (
    <>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ServiceProvidersTransactions
