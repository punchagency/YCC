import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTheme } from "../../context/theme/themeContext";
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

const SupplierTransaction = () => {
    const navigate = useNavigate();
    // const { theme } = useTheme();
    // const muiTheme = useMuiTheme();
    const { setPageTitle } = useOutletContext() || {};

    React.useEffect(() => {
        if (setPageTitle) setPageTitle("Transactions");
    }, [setPageTitle]);

    return (
        <Box sx={{ p: 4, paddingTop: '80px' }}>

        </Box>
    )
}

export default SupplierTransaction
