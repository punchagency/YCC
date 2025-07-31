import React from "react";
import { Routes, Route, useOutletContext } from "react-router-dom";
import CrewBookingsAndQuotes from "./CrewBookingsAndQuotes";
import BookingDetails from "./details";
import ModifyService from "./modifyservice";
import CreateBooking from "./createBooking";

const Booking = () => {
  const outletContext = useOutletContext();
  return (
    <div className="crew-booking-main-content">
      <Routes>
        <Route
          index
          element={
            <>
              {outletContext &&
                outletContext.setPageTitle &&
                outletContext.setPageTitle("Bookings")}
              <CreateBooking />
              <CrewBookingsAndQuotes />
            </>
          }
        />
        <Route path="details/:bookingId" element={<BookingDetails />} />
        <Route path="modify-service/:bookingId" element={<ModifyService />} />
      </Routes>
    </div>
  );
};

export default Booking;
