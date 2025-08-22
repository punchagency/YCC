import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.6; }
  40% { transform: scale(1); opacity: 1; }
`;

const TypingDots = () => {
  const dotStyle = {
    display: "inline-block",
    width: 6,
    height: 6,
    margin: "0 3px",
    borderRadius: "50%",
    backgroundColor: "#9BBAD0",
    animation: `${bounce} 1.2s infinite ease-in-out`,
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        py: 0.5,
      }}
    >
      <Box component="span" sx={{ ...dotStyle, animationDelay: "0s" }} />
      <Box component="span" sx={{ ...dotStyle, animationDelay: "0.15s" }} />
      <Box component="span" sx={{ ...dotStyle, animationDelay: "0.3s" }} />
    </Box>
  );
};

export default TypingDots;
