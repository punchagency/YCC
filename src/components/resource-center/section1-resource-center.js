import { Box, Container, Typography, styled } from '@mui/material'

const Section1ResourceCenter = () => {
    return (
        <Container maxWidth="md" sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "100%",
            height: { xs: "100%", md: "40vh" },
        }}>
            <Box>
                <HeadingText>Navigate the Yachting World with Condence and Ease</HeadingText>
            </Box>
            <Box>
                <SecondarySubTextBlack>Welcome to the Yacht Crew Center, LLC Resource Hub, where professionals come to maintain efficiency and effectiveness with a wealth of tools, guides, and industry insights. We’re here to support captain, chef, engineering, and other crew members, as well as yacht owners, in achieving their goals. From streamlining operations to delivering exceptional guest experiences, and everything you need to succeed in one place.</SecondarySubTextBlack>
            </Box>
        </Container>
    )
}

const HeadingText = styled(Typography)({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "45px",
    lineHeight: "51px",
    letterSpacing: "-0.02em",
})

const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26px",
    letterSpacing: "-0.03em",
    color: "#373737",
    textAlign: "justify",
})

export default Section1ResourceCenter