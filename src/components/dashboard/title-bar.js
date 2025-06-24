import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useTheme } from "../../context/theme/themeContext";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardTitleBar = ({ title, button, backArrow = false }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: { xs: "10px", sm: "20px" },
        height: "4rem",
        backgroundColor: theme === "light" ? "white" : "#03141F",
        border: "1px solid #E0E0E0",
        width: "100vw",
        marginLeft: { xs: "calc(-100vw + 100%)", sm: 0 },
        marginRight: { xs: "calc(-50vw + 50%)", sm: 0 },
        marginTop: { xs: "10px", sm: 0 },
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {backArrow && (
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: theme === "light" ? "#212121" : "#fff",
              transition: "background 0.2s, color 0.2s",
              "&:hover": {
                background: theme === "light" ? "#f0f0f0" : "#173042",
                color: theme === "light" ? "#1976d2" : "#90caf9",
              },
              mr: 1,
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </IconButton>
        )}
        <Typography
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            fontFamily: "Plus Jakarta Sans",
          }}
          className="text-[#212121] dark:text-white font-semibold font-plus-jakarta-sans"
        >
          {title}
        </Typography>
      </Box>
      {button && button}
    </Box>
  );
};

export default DashboardTitleBar;
