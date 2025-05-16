import React from "react";
import { Routes, Route } from "react-router-dom";
import BookingTable from "./table";
import BookingDetails from "./details";
import ModifyService from "./modifyservice";

const Booking = () => {
  return (
    <div>
      <Routes>
        <Route index element={<BookingTable />} />
        <Route path="details/:bookingId" element={<BookingDetails />} />
        <Route path="modify-service/:bookingId" element={<ModifyService />} />
      </Routes>
    </div>
  );
};

export default Booking;
