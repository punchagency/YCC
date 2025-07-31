import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { AccommodationProvider } from "../../../context/accommodation/accommodationContext";
import Location from "./location";
import Rooms from "./rooms";

const Accomodation = () => {
  const outletContext = useOutletContext();

  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle("Crew Accommodation");
    }
  }, [outletContext]);

  return (
    <AccommodationProvider>
      <Location />
      <Rooms />
    </AccommodationProvider>
  );
};

export default Accomodation;
