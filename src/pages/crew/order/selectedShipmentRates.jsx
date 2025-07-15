import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TruckIcon, EyeIcon } from "lucide-react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatCurrency } from "../../../utils/formatters";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  border: "none",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(8px)",
  borderRadius: "12px",
}));

export default function SelectedShipmentRates({ subOrders }) {
  const items = subOrders.filter(
    (so) => so.shipment && so.shipment.selectedRate
  );
  if (items.length === 0) return null;

  return (
    <StyledCard sx={{ mt: 1 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <TruckIcon size={24} stroke="#0387D9" />
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#374151" }}>
            Purchased Shipping Labels
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Carrier</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                {/* <TableCell sx={{ fontWeight: 600 }}>Est. Delivery</TableCell> */}
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tracking Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Label</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((so) => {
                const r = so.shipment.selectedRate;
                return (
                  <TableRow key={so._id}>
                    <TableCell>
                      {so.supplier?.businessName || "Supplier"}
                    </TableCell>
                    <TableCell>
                      <LocalShippingIcon
                        sx={{
                          verticalAlign: "middle",
                          mr: 1,
                          color: "#0387D9",
                        }}
                      />
                      {r.carrier}
                    </TableCell>
                    <TableCell>{r.service}</TableCell>
                    {/* <TableCell>
                      <AccessTimeIcon
                        sx={{
                          verticalAlign: "middle",
                          mr: 1,
                          color: "#0387D9",
                        }}
                      />
                      {r.deliveryDays ? `${r.deliveryDays} days` : "N/A"}
                    </TableCell> */}
                    <TableCell>{formatCurrency(r.rate)}</TableCell>
                    <TableCell>{so.shipment.trackingCode || "-"}</TableCell>
                    <TableCell>
                      {so.shipment.labelUrl ? (
                        <Tooltip title="View shipping label">
                          <IconButton
                            size="small"
                            onClick={() =>
                              window.open(so.shipment.labelUrl, "_blank")
                            }
                            sx={{
                              color: "#0387D9",
                              "&:hover": {
                                backgroundColor: "rgba(3, 135, 217, 0.1)",
                              },
                            }}
                          >
                            <EyeIcon size={18} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </StyledCard>
  );
}
