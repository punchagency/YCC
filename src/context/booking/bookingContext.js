import { createContext, useContext, useState, useEffect } from "react";
import { getBookings, updateBooking, deleteBooking } from "../../services/bookings/bookingService";
import { useUser } from "../userContext";
const BookingContext = createContext();

export const useBooking = () => {
    return useContext(BookingContext);
}

export const BookingProvider = ({ children }) => {
    const { user } = useUser();
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    
    const fetchBookings = async () => {
        try {
            const response = await getBookings(user.profile._id);
            console.log('response', response)
            const bookings = response.data.result;
            console.log('bookings', bookings)
            setBookings(bookings);
            setTotalPages(response.data.totalPages);
            setLimit(response.data.limit);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }

    const updateBooking = async (bookingId, booking) => {
        try {
            const response = await updateBooking(bookingId, booking);
            console.log('response', response)
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    }


    const deleteBooking = async (bookingId) => {
        try {
            const response = await deleteBooking(bookingId);
            console.log('response', response)
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <BookingContext.Provider value={{ bookings, setBookings, deleteBooking, updateBooking }}>
            {children}
        </BookingContext.Provider>
    );

}

export default BookingContext;
