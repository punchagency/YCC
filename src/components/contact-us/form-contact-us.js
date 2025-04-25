import {
  Box,
  TextField,
  Button,
  Typography,
  styled,
  MenuItem,
} from "@mui/material";
// import { useState } from 'react'

const FormContactUs = () => {
  // Remove all unused state variables

  const subjectOptions = [
    { label: "General Question", value: "General Question" },
    { label: "Partnership Opportunities", value: "Partnership Opportunities" },
    { label: "Investor Relations", value: "Investor Relations" },
    { label: "Press & Media", value: "Press & Media" },
    {
      label: "Assistance with Booking Services",
      value: "Assistance with Booking Services",
    },
    {
      label: "Issues with a Vendor or Service Provider",
      value: "Issues with a Vendor or Service Provider",
    },

    {
      label: "Vendor Registration & Onboarding Support",
      value: "Vendor Registration & Onboarding Support",
    },
    {
      label: "Crew Profile & Account Assistance",
      value: "Crew Profile & Account Assistance",
    },
    {
      label: "Unable to Find a Product or Service",
      value: "Unable to Find a Product or Service",
    },
    {
      label: "Custom Order or Special Request",
      value: "Custom Order or Special Request",
    },
    {
      label: "Emergency Provisioning Request",
      value: "Emergency Provisioning Request",
    },
    {
      label: "Urgent Crew Support or Emergency Assistance",
      value: "Urgent Crew Support or Emergency Assistance",
    },

    {
      label: "Legal Inquiry or Maritime Compliance Support",
      value: "Legal Inquiry or Maritime Compliance Support",
    },
    {
      label: "Report a Workplace Incident",
      value: "Report a Workplace Incident",
    },
    {
      label: "Help with Maintenance & Repairs",
      value: "Help with Maintenance & Repairs",
    },
    {
      label: "Compliance & Flag State Documentation Assistance",
      value: "Compliance & Flag State Documentation Assistance",
    },
    {
      label: "Financial Management & Invoice Support",
      value: "Financial Management & Invoice Support",
    },
    { label: "Account/Login Issues", value: "Account/Login Issues" },
    {
      label: "Website or Platform Functionality Issues",
      value: "Website or Platform Functionality Issues",
    },
    { label: "AI Chatbot Assistance", value: "AI Chatbot Assistance" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        height: "100%",
        backgroundColor: "#F2F6F8",
        borderRadius: "13px",
        padding: "20px",
      }}
    >
      <TextField
        label="Full Name"
        variant="outlined"
        fullWidth
        sx={{
          backgroundColor: "white",
        }}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        sx={{
          backgroundColor: "white",
        }}
      />
      <TextField
        select
        label="Subject"
        variant="outlined"
        fullWidth
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                backgroundColor: "white", // Background of dropdown
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                maxHeight: "350px",
              },
            },
          },
        }}
        InputProps={{
          sx: {
            textAlign: "left", // Aligns text left
            "& .MuiSelect-select": {
              textAlign: "left", // Ensures the selected text aligns left
            },
          },
        }}
        sx={{
          backgroundColor: "white",
        }}
      >
        {subjectOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              fontSize: "16px",
              padding: "10px",
              paddingLeft: "30px",
              "&.Mui-selected": {
                background: "linear-gradient(90deg, #034D92, #0487D9)", // Gradient background
                color: "white",
                textAlign: "left",
              },
              "&.Mui-selected:hover": {
                background: "linear-gradient(90deg, #034D92, #0487D9)", // Keep gradient on hover
              },
              "&:hover": {
                backgroundColor: "#f0f8ff", // Light blue hover effect
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Location"
        variant="outlined"
        fullWidth
        sx={{
          backgroundColor: "white",
        }}
      />
      <TextField
        label="Message..."
        variant="outlined"
        fullWidth
        multiline
        rows={7}
        sx={{
          backgroundColor: "white",
        }}
      />
      <StyledButton>
        <ButtonTypography sx={{ color: "white" }}>Submit</ButtonTypography>
      </StyledButton>
    </Box>
  );
};

const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";

const StyledButton = styled(Button)(() => ({
  position: "relative",
  width: "100%",
  border: "none",
  borderRadius: "8px",
  textTransform: "none",
  background: linearGradient, // Set gradient as background
  color: "white", // Ensure text is readable
  padding: "20px 20px",
  fontSize: "16px",
  fontWeight: "500",

  "&:hover": {
    opacity: 0.9, // Slight transparency effect on hover
  },
}));

const ButtonTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Inter, sans-serif",
  fontWeight: 600,
  lineHeight: "19px",
  fontSize: "16px", // Default for large screens

  [theme.breakpoints.down("sm")]: {
    // Mobile (xs)
    fontSize: "14px",
    lineHeight: "17px",
  },

  [theme.breakpoints.between("sm", "md")]: {
    // Tablets (sm - md)
    fontSize: "15px",
    lineHeight: "18px",
  },

  [theme.breakpoints.up("md")]: {
    // Medium+ screens
    fontSize: "16px",
    lineHeight: "19px",
  },
}));

export default FormContactUs;
