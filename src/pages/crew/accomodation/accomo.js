import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
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
    <>
      <Location />
      <Rooms />
    </>
  );
};

export default Accomodation;
