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
    setSelectedRates((prev) => {
      const newRates = { ...prev, [subOrderId]: rateId };
      return newRates;
    });
  };

  // Helper function to get selected rate details for display
  const getSelectedRateDetails = (subOrder) => {
    const selectedRateId = selectedRates[subOrder._id];
    if (!selectedRateId) return null;

    const selectedRate = subOrder.shipment.rates.find((rate) => {
      const rateId =
        rate.id || rate._id || `rate-${subOrder.shipment.rates.indexOf(rate)}`;
      return rateId === selectedRateId;
    });

    return selectedRate;
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
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#374151" }}>
            Shipping Options
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {eligibleSubOrders.map((subOrder) => {
            const selectedRate = getSelectedRateDetails(subOrder);
            return (
              <Fade in={true} key={subOrder._id}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      Shipping for{" "}
                      {subOrder.supplier?.businessName || "Supplier"} -
                      {selectedRate ? (
                        <span
                          style={{
                            color: "#0387D9",
                            fontWeight: 600,
                            marginLeft: "8px",
                          }}
                        >
                          {selectedRate.carrier} {selectedRate.service} -{" "}
                          {formatCurrency(selectedRate.rate)}
                        </span>
                      ) : (
                        <span style={{ color: "#6b7280", marginLeft: "8px" }}>
                          Select Rate
                        </span>
                      )}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell
                              sx={{ color: "#374151", fontWeight: 600 }}
                            >
                              Carrier
                            </TableCell>
                            <TableCell
                              sx={{ color: "#374151", fontWeight: 600 }}
                            >
                              Service
                            </TableCell>
                            <TableCell
                              sx={{ color: "#374151", fontWeight: 600 }}
                            >
                              Est. Delivery
                            </TableCell>
                            <TableCell
                              sx={{ color: "#374151", fontWeight: 600 }}
                            >
                              Price
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subOrder.shipment.rates.map((rate, index) => {
                            const rateId =
                              rate.id || rate._id || `rate-${index}`;
                            return (
                              <TableRow key={rateId}>
                                <TableCell>
                                  <Radio
                                    checked={
                                      selectedRates[subOrder._id] === rateId
                                    }
                                    onClick={() => {
                                      handleRateChange(subOrder._id, rateId);
                                    }}
                                    value={rateId}
                                    name={`shipment-rate-${subOrder._id}`}
                                    inputProps={{
                                      "aria-label": `Select ${rate.carrier} ${rate.service}`,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <LocalShippingIcon
                                    sx={{
                                      verticalAlign: "middle",
                                      mr: 1,
                                      color: "#0387D9",
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
                                      color: "#0387D9",
                                    }}
                                  />{" "}
                                  {rate.deliveryDays
                                    ? `${rate.deliveryDays} days`
                                    : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(rate.rate)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Button
                      variant="contained"
                      disabled={
                        !selectedRates[subOrder._id] || loading[subOrder._id]
                      }
                      onClick={() => handleConfirmSelection(subOrder._id)}
                      sx={{ mt: 2 }}
                    >
                      {loading[subOrder._id]
                        ? "Confirming..."
                        : "Confirm Selection"}
                    </Button>
                  </AccordionDetails>
                </Accordion>
              </Fade>
            );
          })}
        </Box>
      </CardContent>
    </StyledCard>
  );
}

export default ShipmentRates;
