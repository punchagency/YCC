import React from 'react'
import {Box, Typography} from '@mui/material'
import { useTheme } from '../../context/theme/themeContext';

const DashboardTitleBar = ({title}) => {
  const { theme } = useTheme();
  return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '10px',
        backgroundColor: theme === "light" ? "white" : "#03141F",
        border: '1px solid #E0E0E0',
    }}>
        <Typography
        sx={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: theme === "light" ? "#212121" : "white",
            fontFamily: 'Plus Jakarta Sans',
        }}
        >{title}</Typography>
    </Box>
  )
}

export default DashboardTitleBar;