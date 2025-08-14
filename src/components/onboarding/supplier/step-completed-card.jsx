import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const StepCompletedCard = ({ title, description, onContinue }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "grey.200",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
        minWidth: 300,
        width: "100%",
        maxWidth: 600,
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        {title}
      </Typography>
      {description && (
        <Typography sx={{ mb: 3, color: "text.secondary" }}>
          {description}
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={onContinue}>
        Continue
      </Button>
    </Box>
  );
};

export default StepCompletedCard;


