import React from 'react';
import { useUser } from "../../../context/userContext";
import { useTheme } from "../../../context/theme/themeContext";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Alert,
  Snackbar,
  Paper,
  Stack,
  useMediaQuery,
  useTheme as useMuiTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  RoomService as ServiceIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { getServiceProviderBookings } from '../../../services/bookings/bookingService';

const ServiceProvidersBookings = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [bookings, setBookings] = React.useState([]);

  const fetchBookings = async () => {
    try {
      const response = await getServiceProviderBookings();
      setBookings(response.data.data);
    } catch (error) {

    }
  };


  return (
    <Box sx={{ p: { xs: 1, sm: 1.4, lg: 4 }, paddingTop: "70px !important" }}>

    </Box>
  )
}

export default ServiceProvidersBookings;
