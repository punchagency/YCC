import React from "react";
import { Routes, Route, useOutletContext } from "react-router-dom";
import CrewBookingsAndQuotes from "./CrewBookingsAndQuotes";
import BookingDetails from "./details";
import ModifyService from "./modifyservice";
import CreateBooking from "./createBooking";
import useMediaQuery from '@mui/material/useMediaQuery';
import { getVendorsAndServices } from "../../../services/crew/crewBookingService";
import { useToast } from "../../../components/Toast";
import { getBookings } from "../../../services/crew/crewBookingService";
import { Box } from "@mui/material";

const Booking = () => {
  const { showError } = useToast();
  const outletContext = useOutletContext();
  const [openSelectServiceCategories, setOpenSelectServiceCategories] = React.useState(false);
  const [openSelectVendors, setOpenSelectVendors] = React.useState(false);
  const [openVendorServices, setOpenVendorServices] = React.useState(false);
  const [openVendorProfile, setOpenVendorProfile] = React.useState(false);
  const [openCreateBookingForm, setOpenCreateBookingForm] = React.useState(false);
  
  const [selectedServiceCategories, setSelectedServiceCategories] = React.useState([]);
  const [selectedVendor, setSelectedVendor] = React.useState(null);
  const [selectedServices, setSelectedServices] = React.useState([]);
  const [vendorServices, setVendorServices] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [vendors, setVendors] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [error, setError] = React.useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [showVendorModal] = React.useState(false);

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
  const fetchVendors = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await getVendorsAndServices();
      if (response.status) {
        // Extract unique vendors from services
        const uniqueVendors = response.data.data.filter((vendor) => vendor.services.length > 0);
        setVendors(uniqueVendors);
      }
    } catch (error) {
      showError("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  React.useEffect(() => {
    if (showVendorModal) {
      fetchVendors();
    }
  }, [showVendorModal, fetchVendors]);

  React.useEffect(() => {
    const handleCreateBookingClick = () => {
      setOpenSelectServiceCategories(true);
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
  }, [fetchBookings]);
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
              <CreateBooking 
                openSelectServiceCategories={openSelectServiceCategories}
                setOpenSelectServiceCategories={setOpenSelectServiceCategories}
                openSelectVendors={openSelectVendors}
                setOpenSelectVendors={setOpenSelectVendors}
                openVendorServices={openVendorServices}
                setOpenVendorServices={setOpenVendorServices}
                openVendorProfile={openVendorProfile}
                setOpenVendorProfile={setOpenVendorProfile}
                openCreateBookingForm={openCreateBookingForm}
                setOpenCreateBookingForm={setOpenCreateBookingForm}
                selectedServiceCategories={selectedServiceCategories}
                setSelectedServiceCategories={setSelectedServiceCategories}
                selectedVendor={selectedVendor}
                setSelectedVendor={setSelectedVendor}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                vendors={vendors}
                fetchBookings={fetchBookings}
                setVendors={setVendors}
                vendorServices={vendorServices}
                setVendorServices={setVendorServices}
                loading={loading}
                setLoading={setLoading}
              />
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
