import React, { useState } from "react";
import LegalSearch from "./legalsearch";
import LegalBoxes from "./legalboxes";

const Inventory = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                marginLeft: "40px",
              }}
            >
              Crew Portal
            </h3>
          </div>
        </div>
      </div>
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
