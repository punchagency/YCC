import React, { createContext, useContext, useState, useRef } from 'react';
import { getBookingService, updateBookingService, deleteBookingService, updateBookingStatusService } from "../../services/bookings/bookingService";
import { useUser } from "../userContext";
import { useToast } from "../toast/toastContext";
const BookingContext = createContext();

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}

export const BookingProvider = ({ children }) => {
    const { toast } = useToast();
    const { user } = useUser();

    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    
    const fetchBookings = async () => {
        try {
            const response = await getBookingService(user.profile._id);
            const bookings = response.data.result;
            setBookings(bookings);
            setTotalPages(response.data.totalPages);
            setLimit(response.data.limit);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }

    const updateBooking = async (bookingId, bookingData) => {
        try {
            const response = await updateBookingService(bookingId, bookingData);
            const updatedBooking = response.data;
            setBookings(bookings.map(booking => 
                booking._id === bookingId ? updatedBooking : booking
            ));
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Booking updated successfully',
                life: 3000
            });
            return true;
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update booking',
                life: 3000
            });
            return false;
        }
    }

    const updateBookingStatus = async (bookingId, status) => {
        try {
            const response = await updateBookingStatusService(bookingId, status);
            const updatedBooking = response.data;   
            setBookings(bookings.map(booking => 
                booking._id === bookingId ? updatedBooking : booking
            ));
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: `Booking status updated to ${status}`,
                life: 3000
            });
            return true;
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response.data.message || 'Failed to update booking status',
                life: 3000
            });
            return false;
        }
    }

    const deleteBooking = async (bookingId) => {
        try {
            const response = await deleteBookingService(bookingId);
            setBookings(bookings.filter(booking => 
                booking._id !== bookingId
            ));
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Booking deleted successfully',
                life: 3000
            });
            return true;
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete booking',
                life: 3000
            });
            return false;
        }
    }

    return (
        <BookingContext.Provider value={{
            bookings,
            setBookings,
            deleteBooking,
            updateBooking,
            fetchBookings,
            updateBookingStatus
            }}>
            {children}
        </BookingContext.Provider>
    );
}

export default BookingContext;
