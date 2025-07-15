import {
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/material/styles";
import { formatCurrency } from "../../../utils/formatters";
import { useState } from "react";
import axios from "axios";

import { TruckIcon } from "lucide-react";

// Styled components if needed (copy from details.js if any)
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  border: "none",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(8px)",
  borderRadius: "12px",
}));

function ShipmentRates({ subOrders, refreshOrder }) {
  const [selectedRates, setSelectedRates] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const eligibleSubOrders = subOrders.filter(
    (so) =>
      so.shipment && so.shipment.rates?.length > 0 && !so.shipment.selectedRate
  );

  if (eligibleSubOrders.length === 0) return null;

  const handleRateChange = (subOrderId, rateId) => {
    setSelectedRates((prev) => ({ ...prev, [subOrderId]: rateId }));
  };

  const handleConfirmSelection = async (subOrderId) => {
    const rateId = selectedRates[subOrderId];
    if (!rateId) return;
    setLoading((prev) => ({ ...prev, [subOrderId]: true }));
    setError(null);
    setSuccess(null);
    try {
      // Simulate API call (replace with real API when backend is ready)
      // await axios.post(`/api/crew-orders/suborders/${subOrderId}/select-rate`, { rateId });
      // For now, just wait a bit
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess("Rate selected successfully");
      setSelectedRates((prev) => {
        const newSelected = { ...prev };
        delete newSelected[subOrderId];
        return newSelected;
      });
      if (refreshOrder) await refreshOrder();
    } catch (err) {
      setError("Failed to select rate");
    } finally {
      setLoading((prev) => ({ ...prev, [subOrderId]: false }));
    }
  };

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <TruckIcon size={24} stroke="#0387D9" />
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>
            Shipping Options
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {eligibleSubOrders.map((subOrder) => (
            <Fade in={true} key={subOrder._id}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    Shipping for {subOrder.supplier?.businessName || "Supplier"}{" "}
                    - Select Rate
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={selectedRates[subOrder._id] || ""}
                      onChange={(e) =>
                        handleRateChange(subOrder._id, e.target.value)
                      }
                    >
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell>Carrier</TableCell>
                              <TableCell>Service</TableCell>
                              <TableCell>Est. Delivery</TableCell>
                              <TableCell>Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {subOrder.shipment.rates.map((rate) => (
                              <TableRow key={rate.id}>
                                <TableCell>
                                  <FormControlLabel
                                    value={rate.id}
                                    control={<Radio />}
                                    label=""
                                  />
                                </TableCell>
                                <TableCell>
                                  <LocalShippingIcon
                                    sx={{
                                      verticalAlign: "middle",
                                      mr: 1,
                                    }}
                                  />{" "}
                                  {rate.carrier}
                                </TableCell>
                                <TableCell>{rate.service}</TableCell>
                                <TableCell>
                                  <AccessTimeIcon
                                    sx={{
                                      verticalAlign: "middle",
                                      mr: 1,
                                    }}
                                  />{" "}
                                  {rate.deliveryDays
                                    ? `${rate.deliveryDays} days`
                                    : "N/A"}
                                </TableCell>
                                <TableCell>
                                  <AttachMoneyIcon
                                    sx={{
                                      verticalAlign: "middle",
                                      mr: 1,
                                    }}
                                  />{" "}
                                  {formatCurrency(rate.rate)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </RadioGroup>
                    <Button
                      variant="contained"
                      disabled={
                        !selectedRates[subOrder._id] || loading[subOrder._id]
                      }
                      onClick={() => handleConfirmSelection(subOrder._id)}
                      sx={{ mt: 2 }}
                    >
                      Confirm Selection
                    </Button>
                  </FormControl>
                </AccordionDetails>
              </Accordion>
            </Fade>
          ))}
        </Box>
      </CardContent>
    </StyledCard>
  );
}

export default ShipmentRates;
