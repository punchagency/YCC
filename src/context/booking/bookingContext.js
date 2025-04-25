import React, { createContext, useContext, useState} from "react";
import {
  // getBookingService,
  updateBookingService,
  // deleteBookingService,
  updateBookingStatusService,
  getAllBookingService,
} from "../../services/bookings/bookingService";
// import { useUser } from "../userContext";
import { useToast } from "../toast/toastContext";
const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const { toast } = useToast();
  // const { user } = useUser();

  const [bookings, setBookings] = useState([]);
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(10);
  // const [totalPages, setTotalPages] = useState(0);

  const fetchBookings = async () => {
    try {
      const result = await getAllBookingService();

      if (result.status) {
        setBookings(result.data);
        // setTotalPages(result.data.totalPages);
        // setLimit(result.data.limit);
        return true;
      } else {
        console.error("Error fetching bookings:", result.message);
        return false;
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return false;
    }
  };

  const updateBooking = async (bookingId, bookingData) => {
    try {
      console.log("Updating booking with ID:", bookingId);
      console.log("Booking data being sent to API:", bookingData);

      const response = await updateBookingService(bookingId, bookingData);
      console.log("Update booking service response:", response);

      if (response.status) {
        // Update the local state with the updated booking
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? {
                  ...booking,
                  ...response.data,
                  // Make sure vesselLocation is updated in the UI
                  vesselLocation:
                    response.data.vendorLocation || booking.vesselLocation,
                }
              : booking
          )
        );

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Booking updated successfully",
          life: 3000,
        });

        return true;
      } else {
        console.error("Error updating booking:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Error in updateBooking:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update booking",
        life: 3000,
      });
      return false;
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await updateBookingStatusService(bookingId, status);

      if (response.status) {
        // Update the bookings array with the new status
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, bookingStatus: status }
              : booking
          )
        );

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `Booking status updated to ${status}`,
          life: 3000,
        });

        return true;
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Failed to update booking status",
          life: 3000,
        });

        return false;
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response?.data?.message || "Failed to update booking status",
        life: 3000,
      });

      return false;
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      // const response = await deleteBookingService(bookingId);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Booking deleted successfully",
        life: 3000,
      });
      return true;
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete booking",
        life: 3000,
      });
      return false;
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        setBookings,
        deleteBooking,
        updateBooking,
        fetchBookings,
        updateBookingStatus,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
