import React from 'react'
import {Box, Typography} from '@mui/material'
import { useTheme } from '../../context/theme/themeContext';

const DashboardTitleBar = ({title, button}) => {
  const { theme } = useTheme();
  return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingX: '20px',
        // paddingY: '14px',
        height: '4rem',
        backgroundColor: theme === "light" ? "white" : "#03141F",
        border: '1px solid #E0E0E0',
        
    }}>
        <Typography
        sx={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            fontFamily: 'Plus Jakarta Sans',
        }}
        className='text-[#212121] dark:text-white font-semibold font-plus-jakarta-sans'
        >{title}</Typography>
        {button && button}
    </Box>
  )
}

export default DashboardTitleBar;