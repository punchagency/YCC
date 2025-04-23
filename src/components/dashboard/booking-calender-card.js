import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useTheme } from "../../context/theme/themeContext";
import { useMediaQuery } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";

const BookingCalenderCard = () => {
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));

  const [selectedDate, setSelectedDate] = useState(13);
  const [viewingDate, setViewingDate] = useState(11);

  // Calendar data for March 2025
  const calendarData = [
    [27, 28, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28],
    [29, 30, 31, 1, 2, 3],
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        height: "auto",
        minHeight: { xs: "auto", md: "370px" },
        bgcolor: theme === "light" ? "#ffffff" : "#7A7A7A",
        borderRadius: { xs: "16px", md: "24px" },
        boxShadow: "0px 1px 8px 0px #0000001F",
        padding: { xs: "15px", sm: "18px", md: "20px" },
        display: "flex",
        flexDirection: "column",
        gap: { xs: "8px", md: "10px" },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: { xs: "5px", md: "10px" },
        }}
      >
        <Typography
          sx={{
            color: theme === "light" ? "#212121" : "white",
            fontSize: { xs: "16px", md: "18px" },
            fontWeight: 500,
            fontFamily: "Plus Jakarta Sans",
            width: "100%",
          }}
        >
          March{" "}
          <Box component="span" sx={{ fontWeight: 700 }}>
            2025
          </Box>
        </Typography>

        <Box sx={{ display: "flex", gap: { xs: 0.5, md: 1 } }}>
          <IconButton
            sx={{
              width: { xs: "32px", md: "40px" },
              height: { xs: "32px", md: "40px" },
              bgcolor: theme === "light" ? "#ffffff" : "#7A7A7A",
              border: "1px solid #fafafa",
              color: theme === "light" ? "#212121" : "white",
              "&:hover": {
                bgcolor: theme === "light" ? "#f5f5f5" : "#7A7A7A",
              },
            }}
          >
            <ChevronLeftIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          <IconButton
            sx={{
              width: { xs: "32px", md: "40px" },
              height: { xs: "32px", md: "40px" },
              bgcolor: theme === "light" ? "#ffffff" : "#7A7A7A",
              border: "1px solid #fafafa",
              color: theme === "light" ? "#212121" : "white",
              "&:hover": {
                bgcolor: theme === "light" ? "#f5f5f5" : "#7A7A7A",
              },
            }}
          >
            <ChevronRightIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={isMobile ? 0.5 : 1}>
        {calendarData.flat().map((day, index) => {
          const isPreviousMonth = index < 2;
          const isNextMonth = index > 31;
          const isSelected =
            day === selectedDate && !isPreviousMonth && !isNextMonth;

          return (
            <Grid
              item
              xs={2}
              sm={2}
              md={1}
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: {
                  xs: isMobile ? "12px 0" : "15px 0",
                  md: "25px",
                },
                maxWidth: isMobile ? "16.66%" : "90%",
                margin: 0,
              }}
            >
              <Button
                onClick={() => setSelectedDate(day)}
                sx={{
                  minWidth: { xs: "20px", md: "25px" },
                  width: { xs: "20px", md: "25px" },
                  height: { xs: "20px", md: "25px" },
                  padding: "0px",
                  fontSize: { xs: "12px", md: "14px" },
                  fontWeight: 600,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: isSelected ? "#0387d9" : "transparent",
                  color: isSelected
                    ? theme === "light"
                      ? "#ffffff"
                      : "white"
                    : isPreviousMonth || isNextMonth
                    ? "rgba(107, 107, 107, 0.4)"
                    : theme === "light"
                    ? "#212121"
                    : "white",
                  "&:hover": {
                    bgcolor: isSelected ? "#0387d9" : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {day}
              </Button>
            </Grid>
          );
        })}
      </Grid>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 2, sm: 0 },
          mt: { xs: 1, md: 0 },
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
          <Typography
            sx={{
              color: theme === "light" ? "#212121" : "white",
              fontSize: { xs: "9px", sm: "10px" },
              fontWeight: 500,
              fontFamily: "Plus Jakarta Sans",
            }}
          >
            Tasks for March {viewingDate}th, 2025:
          </Typography>
          <Typography
            sx={{
              color: theme === "light" ? "#6b6b6b" : "white",
              marginTop: "5px",
              fontFamily: "Plus Jakarta Sans",
              fontSize: { xs: "11px", sm: "12px" },
            }}
          >
            No tasks for this day.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="contained"
            startIcon={
              <AddBoxIcon sx={{ fontSize: isMobile ? "16px" : "inherit" }} />
            }
            sx={{
              bgcolor: "#0387d9",
              color: theme === "light" ? "#ffffff" : "white",
              borderRadius: "10px",
              padding: { xs: "8px 15px", md: "10px 20px" },
              fontWeight: 500,
              textTransform: "none",
              fontSize: { xs: "11px", md: "12px" },
              "&:hover": {
                bgcolor: "rgba(3, 135, 217, 0.9)",
              },
            }}
          >
            Add Task
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingCalenderCard;
