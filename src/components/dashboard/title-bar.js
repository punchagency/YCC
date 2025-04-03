import React from 'react'
import {Box, Typography} from '@mui/material'

const dashboardTitleBar = () => {
  return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '10px',
        backgroundColor: 'white',
        border: '1px solid #E0E0E0',
    }}>
        <Typography
        sx={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#212121',
            fontFamily: 'Plus Jakarta Sans',
        }}
        >Dashboard</Typography>
    </Box>
  )
}

export default dashboardTitleBar