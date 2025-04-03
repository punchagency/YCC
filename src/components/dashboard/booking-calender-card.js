import { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Grid from "@mui/material/Grid"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import AddBoxIcon from '@mui/icons-material/AddBox';    

const BookingCalenderCard = () => {
  const [selectedDate, setSelectedDate] = useState(13)
  const [viewingDate, setViewingDate] = useState(11)

  // Calendar data for March 2025
  const calendarData = [
    [27, 28, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28],
    [29, 30, 31, 1, 2, 3],
  ]

  return (

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          height: "370px",
          //bgcolor: "#ffffff",
          backgroundColor: "yellow",
          borderRadius: "24px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Typography
            sx={{
              color: "#212121",
              fontSize: "18px",
              fontWeight: 500,
              backgroundColor: "red",
              width: "100%",
            }}
          >
            March{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              2025
            </Box>
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              sx={{
                width: "40px",
                height: "40px",
                bgcolor: "#ffffff",
                border: "1px solid #fafafa",
                color: "#212121",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              sx={{
                width: "40px",
                height: "40px",
                bgcolor: "#ffffff",
                border: "1px solid #fafafa",
                color: "#212121",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>




        <Grid container spacing={1}  sx={{ mb: 4 }}>
  {calendarData.flat().map((day, index) => {
    const isPreviousMonth = index < 2;
    const isNextMonth = index > 31;
    const isSelected = day === selectedDate && !isPreviousMonth && !isNextMonth;

    return (
      <Grid item xs={1} key={index} sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px",
        maxWidth: "90%",
        margin: 0,
      }}>
        <Button
          onClick={() => setSelectedDate(day)}
          sx={{
            minWidth: "25px",
            width: "25px",
            height: "25px",
            padding: "0px",
            fontSize: "14px",
            fontWeight: 600,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: isSelected ? "#0387d9" : "transparent",
            color: isSelected
              ? "#ffffff"
              : isPreviousMonth || isNextMonth
                ? "rgba(107, 107, 107, 0.4)"
                : "#212121",
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


          <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
        <Box sx={{ backgroundColor: "lightgray", width: "100%"}}>
          <Typography
            sx={{
              color: "#212121",
              fontSize: "12px",
              fontWeight: 500,
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 500,
              fontSize: "10px",
            }}
          >
            Tasks for March {viewingDate}th, 2025:
          </Typography>
          <Typography
            sx={{
              color: "#6b6b6b",
              marginTop: "5px",
              fontSize: "12px",
            }}
          >
            No tasks for this day.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddBoxIcon />}
            sx={{
              bgcolor: "#0387d9",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "10px 20px",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "8px",
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

  )
}

export default BookingCalenderCard;
