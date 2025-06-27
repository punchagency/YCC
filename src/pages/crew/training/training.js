import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import TrainingSearch from "./trainingsearch";
import TrainingBoxes from "./trainingboxes";

const Inventory = () => {
  const outletContext = useOutletContext();

  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle("Training & Certification");
    }
  }, [outletContext]);

  return (
    <>
      <TrainingSearch />
      <TrainingBoxes />
    </>
  );
};

export default Inventory;
