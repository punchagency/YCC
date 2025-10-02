import React from "react";
import { Routes, Route, useOutletContext, useNavigate } from "react-router-dom";
import CrewBookingsAndQuotes from "./CrewBookingsAndQuotes";
import BookingDetails from "./details";
import ModifyService from "./modifyservice";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useToast } from "../../../components/Toast";
import { getBookings } from "../../../services/crew/crewBookingService";
import { Box } from "@mui/material";

const Booking = () => {
  const { showError } = useToast();
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [bookings, setBookings] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [error, setError] = React.useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const fetchBookings = React.useCallback(async (params = {}) => {
    const currentPage = params.page || page;
    const currentLimit = params.limit || limit;
    setLoading(true);
    try {
      const response = await getBookings({ page: currentPage, limit: currentLimit });

      if (response.status) {
        setBookings(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
        setError(null);
      } else {
        setError(response.error || "Failed to fetch bookings");
        showError(response.error || "Failed to fetch bookings");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      showError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [showError, page, limit]);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  React.useEffect(() => {
    const handleCreateBookingClick = () => {
      navigate("/crew/booking/new-create-booking");
    };
    
    const handleBookingCreated = () => {
      fetchBookings();
    };
    
    window.addEventListener("openCreateBookingModal", handleCreateBookingClick);
    window.addEventListener("bookingCreated", handleBookingCreated);
    
    return () => {
      window.removeEventListener("openCreateBookingModal", handleCreateBookingClick);
      window.removeEventListener("bookingCreated", handleBookingCreated);
    };
  }, []);


  return (
    <Box sx={{ p: isMobile ? 0 : 2, paddingTop: isMobile ? "10px !important" : "40px !important", mx: "auto" }}>
      <Routes>
        <Route
          index
          element={
            <>
              {outletContext &&
                outletContext.setPageTitle &&
                outletContext.setPageTitle("Bookings")}
              <CrewBookingsAndQuotes 
                bookings={bookings}
                loading={loading}
                error={error}
                fetchBookings={fetchBookings}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                totalPages={totalPages}
                totalItems={totalItems}
              />
            </>
          }
        />
        <Route path="details/:bookingId" element={<BookingDetails />} />
        <Route path="modify-service/:bookingId" element={<ModifyService />} />
      </Routes>
    </Box>
  );
};

export default Booking;
