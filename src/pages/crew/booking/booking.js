import React from "react";
import { Routes, Route } from "react-router-dom";
import CrewBookingsAndQuotes from "./CrewBookingsAndQuotes";
import BookingDetails from "./details";
import ModifyService from "./modifyservice";
import CreateBooking from "./createBooking";
const Booking = () => {
  return (
    <div>
      <CreateBooking />
      <Routes>
        <Route index element={<CrewBookingsAndQuotes />} />
        <Route path="details/:bookingId" element={<BookingDetails />} />
        <Route path="modify-service/:bookingId" element={<ModifyService />} />
      </Routes>
    </div>
  );
};

export default Booking;
