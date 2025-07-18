import {
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/material/styles";
import { formatCurrency } from "../../../utils/formatters";
import { useState } from "react";

import { TruckIcon } from "lucide-react";
import { buyLabels } from "../../../services/crew/shipmentService";
import { useToast } from "../../../context/toast/toastContext";
import { useUser } from "../../../context/userContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
} from "@mui/material";

// Styled components if needed (copy from details.js if any)
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  border: "none",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(8px)",
  borderRadius: "12px",
}));

function ShipmentRates({ subOrders }) {
  const { toast } = useToast();
  const { user } = useUser();
  const [selectedRates, setSelectedRates] = useState({});
  const [buying, setBuying] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  const eligibleSubOrders = subOrders.filter(
    (so) =>
      so.shipment && so.shipment.rates?.length > 0 && !so.shipment.selectedRate
  );

  if (eligibleSubOrders.length === 0) return null;

  const handleRateChange = (shipmentId, rateId) => {
    setSelectedRates((prev) => {
      const newRates = { ...prev, [shipmentId]: rateId };
      return newRates;
    });
  };

  // Helper function to get selected rate details for display
  const getSelectedRateDetails = (subOrder) => {
    const selectedRateId = selectedRates[subOrder.shipment._id];
    if (!selectedRateId) return null;

    const selectedRate = subOrder.shipment.rates.find((rate) => {
      const rateId =
        rate.id || rate._id || `rate-${subOrder.shipment.rates.indexOf(rate)}`;
      return rateId === selectedRateId;
    });

    return selectedRate;
  };

  const triggerPurchase = async () => {
    const selections = Object.entries(selectedRates).map(
      ([shipmentId, rateId]) => ({ shipmentId, rateId })
    );
    if (selections.length === 0) return;
    setBuying(true);
    try {
      const data = await buyLabels(selections);
      const failed = (data.results || []).filter((r) => !r.success);
      if (failed.length === 0) {
        // Show modal with invoice link
        if (data.invoiceUrl) {
          setInvoiceUrl(data.invoiceUrl);
          setInvoiceModalOpen(true);
        }
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Labels purchased successfully",
        });
        // Rewardful tracking (unchanged)
        if (window.rewardful && user?.email) {
          try {
            window.rewardful("convert", { email: user.email });
            console.log("Rewardful conversion tracked for:", user.email);
          } catch (rewardfulError) {
            console.error(
              "Error tracking Rewardful conversion:",
              rewardfulError
            );
          }
        }
      } else {
        toast.current.show({
          severity: "warn",
          summary: "Partial",
          detail: `${failed.length} label(s) failed to purchase`,
        });
        console.log("Failed to purchase labels:", failed);
      }
      setSelectedRates({});
      // No refreshOrder call here
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to buy labels",
      });
    } finally {
      setBuying(false);
      setConfirmOpen(false);
    }
  };

  const handleConfirmAllClick = () => {
    setConfirmOpen(true);
  };

  // Modern Success Modal
  const InvoiceModal = () => (
    <MuiDialog
      open={invoiceModalOpen}
      onClose={() => setInvoiceModalOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <MuiDialogTitle sx={{ textAlign: "center", pt: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 60, color: "#38BDF8", mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 2 }}>
          Shipping Labels Purchased!
        </Typography>
      </MuiDialogTitle>
      <MuiDialogContent sx={{ textAlign: "center", pb: 2 }}>
        <Typography variant="body1" sx={{ color: "#374151", mb: 2 }}>
          Your shipping labels have been purchased successfully.
          <br />
          An invoice has been sent to your email. You can also pay now to
          complete your order.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2, borderRadius: 2, fontWeight: 600, px: 4, boxShadow: 2 }}
          onClick={() => window.open(invoiceUrl, "_blank")}
        >
          Pay Invoice
        </Button>
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 2, color: "#6b7280" }}
        >
          You can always find your invoice in your email if you want to pay
          later.
        </Typography>
      </MuiDialogContent>
      <MuiDialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={() => setInvoiceModalOpen(false)}
          color="inherit"
          sx={{ fontWeight: 500 }}
        >
          Close
        </Button>
      </MuiDialogActions>
    </MuiDialog>
  );

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
                                      selectedRates[subOrder.shipment._id] ===
                                      rateId
                                    }
                                    onClick={() => {
                                      handleRateChange(
                                        subOrder.shipment._id,
                                        rateId
                                      );
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
                  </AccordionDetails>
                </Accordion>
              </Fade>
            );
          })}
        </Box>
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button
            variant="contained"
            disabled={
              buying ||
              Object.keys(selectedRates).length !== eligibleSubOrders.length
            }
            onClick={handleConfirmAllClick}
          >
            {buying ? "Purchasing..." : "Confirm All"}
          </Button>
        </Box>
        {/* Confirmation Dialog */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Purchase Shipping Labels</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will buy labels for all selected shipment rates. You will be
              charged immediately by the carriers. Continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} disabled={buying}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={triggerPurchase}
              disabled={buying}
              autoFocus
            >
              {buying ? "Purchasing..." : "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Modern Success Modal */}
        <InvoiceModal />
      </CardContent>
    </StyledCard>
  );
}

export default ShipmentRates;
