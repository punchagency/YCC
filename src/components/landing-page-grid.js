import React from 'react'
import { Box, Typography, styled, Container, Grid } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const LandingPageGrid = ({gridData}) => {
  return (
    <Box component="section" sx={{
        minHeight: "100vh",
        width: "100%",
    }}>

        <Container maxWidth="lg" sx={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            justifyContent: "center",
            alignItems: "center",
        }}>

            <Grid container rowSpacing={{ xs: 3, sm: 4, md: 5 }} columnSpacing={{ xs: 3, sm: 4, md: 5 }} sx={{ width: "100%" }}>
                {gridData.map((item, index) => (
                    <Grid
                        item
                        xs={12}  // Full width on extra-small screens (mobile)
                        sm={6}   // 2-column layout on small screens (600px+)
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent: "start",
                            textAlign: "left",
                        }}
                    >
                        <Box sx={{ px: 7, py: 7, display: "flex", background: "#E6EFF28A", borderRadius: '13px', flexDirection: "column", gap: "28px", justifyContent: "space-between" }}>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                                <Box>
                                    <img src={item.image} alt="yacht" />
                                </Box>
                                <Box sx={{  display: "flex", flexDirection: "column", gap: "23px"  }}>
                                    <SecondaryHeadingText>
                                        {item.title}
                                    </SecondaryHeadingText>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'start',
                                        gap: '8px'
                                    }}>
                                        <CheckCircleIcon sx={{
                                            width: '26.7109375px',
                                            height: '26px',
                                            color: '#02214B'
                                        }} />
                                        <SecondarySubTextBlack>{item.subtext1}</SecondarySubTextBlack>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'start', 
                                        gap: '8px'
                                    }}>
                                        <CheckCircleIcon sx={{
                                            width: '26.7109375px',
                                            height: '26px',
                                            color: '#02214B'
                                        }} />
                                        <SecondarySubTextBlack>{item.subtext2}</SecondarySubTextBlack>
                                    </Box>
                                </Box>

                            </Box>

                        </Box>
                    </Grid>
                ))}
            </Grid>



        </Container>

    </Box>
  )
}


const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26.55px",
    letterSpacing: "0%",
    color: "#373737",
    display: 'inline-block'
})


const SecondaryHeadingText = styled(Typography)({
    color: "#000000",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "38px",
    lineHeight: "47.12px",
    letterSpacing: "-0.02em",
    paddingBottom: "30px", // Adds space between text and border
    borderBottom: "1px solid  #02214B59",

})


export default LandingPageGrid