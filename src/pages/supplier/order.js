import React from 'react';
import { useUser } from "../../context/userContext";
import { useTheme } from "../../context/theme/themeContext";
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
    Divider,
    Alert,
    Snackbar,
    IconButton,
    Paper,
    Container,
    Stack,
    useMediaQuery,
    useTheme as useMuiTheme,
    alpha,
} from "@mui/material";
import { getSupplierOrders } from '../../services/order/orderService';

const SupplierOrder = () => {
    const { user } = useUser();
    // const { theme } = useTheme();
    const muiTheme = useMuiTheme();
    const [supplierOrders, setSupplierOrders] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [orderStatus, setOrderStatus] = React.useState("all");
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: "",
        severity: "success",
    });

    const { setPageTitle } = useOutletContext() || {};
    React.useEffect(() => {
        if (setPageTitle) setPageTitle("Orders");
    }, [setPageTitle]);

    const fetchOrders = async () => {
        const response = await getSupplierOrders(orderStatus);
        if (response.success) {
            // Handle successful order fetch
            console.log("Orders fetched successfully:", response.data);
            setSupplierOrders(response.data.data);
        } else {
            setSnackbar({
                open: true,
                message: response.error,
                severity: "error",
            });
        }
    };

    React.useEffect(() => {
        fetchOrders();
    }, []);


    return (
        <>
            <Box sx={{ p: 4, paddingTop: "80px" }}>
                My Orders
            </Box>
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

export default SupplierOrder;
