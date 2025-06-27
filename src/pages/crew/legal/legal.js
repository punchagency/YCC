import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import LegalSearch from "./legalsearch";
import LegalBoxes from "./legalboxes";

const Inventory = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchText, setSearchText] = useState("");
  const outletContext = useOutletContext();

  // Set the page title using the shared layout context if available
  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle("Legal Resources");
    }
  }, [outletContext]);

  return (
    <>
      <LegalSearch
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <LegalBoxes selectedCountry={selectedCountry} searchText={searchText} />
    </>
  );
};

export default Inventory;
