import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import countriesData from "../../../data/countries.json";
import searchIcon from "../../../assets/images/crew/searchLogo.png";
import layerIcon from "../../../assets/images/crew/Layer_1.png";

// List of countries to show in the dropdown, as in the screenshot
const allowedCountries = [
  "Antigua and Barbuda",
  "Bahamas",
  "Bermuda",
  "Barbados",
  "British Virgin Islands",
  "Cayman Islands",
  "Cook Islands",
  "Cyprus",
  "France",
  "Gibraltar",
  "Guernsey",
  "Hong Kong",
  "Isle of Man",
  "Jersey",
  "Liberia",
  "Malaysia",
  "Malta",
  "Marshall Islands",
  "Monaco",
  "Panama",
  "Seychelles",
  "Saint Kitts and Nevis",
  "Saint Vincent and the Grenadines",
  "Turks and Caicos Islands",
  "United States",
];

const countryOptions = countriesData
  .filter((country) =>
    allowedCountries.some(
      (name) => name.toLowerCase() === country.name.common.toLowerCase()
    )
  )
  .map((country) => ({
    value: country.cca2,
    label: country.name.common,
    flag: `https://flagcdn.com/24x18/${country.cca2.toLowerCase()}.png`,
  }));

const customOption = (props) => {
  const { innerProps, innerRef, data } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{ display: "flex", alignItems: "center", padding: 8 }}
    >
      <img
        src={data.flag}
        alt={data.label}
        style={{ width: 24, height: 18, marginRight: 8, borderRadius: 2 }}
      />
      <span>{data.label}</span>
    </div>
  );
};

const LegalSearch = ({
  selectedCountry,
  setSelectedCountry,
  searchText,
  setSearchText,
}) => {
  // For SSR safety
  const isClient = typeof window !== "undefined";
  const selectRef = useRef();

  useEffect(() => {
    if (isClient && document.body) {
      // Ensure body has position: relative for portal
      document.body.style.position = "relative";
    }
  }, [isClient]);

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .legal-search-header {
            width: 100% !important;
            margin-left: 0 !important;
            padding: 0 8px !important;
          }
          .legal-search-bar {
            width: 100% !important;
            margin-left: 0 !important;
            padding: 6px 0 !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
          }
          .legal-search-bar input {
            width: 100% !important;
            min-width: 0 !important;
          }
          .legal-search-bar .react-select__control {
            min-width: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .legal-search-bar .react-select__menu {
            min-width: 0 !important;
            width: 100vw !important;
            left: 0 !important;
            max-width: 100vw !important;
          }
          .react-select__menu-portal {
            left: 0 !important;
            width: 100vw !important;
            min-width: 0 !important;
            max-width: 100vw !important;
            position: fixed !important;
            z-index: 99999 !important;
            top: 56px !important;
          }
        }
      `}</style>
      <div>
        <div className="flex align-items-center justify-content-between p-4">
          <div
            className="legal-search-header"
            style={{ width: "95%", marginLeft: "20px" }}
          >
            {/* Removed <h2>Legal Resources</h2> to avoid double title bar */}
          </div>
          <div className="flex align-items-center">
            <div
              className="bg-transparent border-1 border-gray-300 legal-search-bar"
              style={{ width: "350px", borderRadius: "4px", padding: "5px" }}
            >
              <div className="flex align-items-center justify-content-between">
                <div className="mr-3">
                  <img src={layerIcon} alt="layer" />
                </div>
                <div style={{ width: "100%" }}>
                  <Select
                    ref={selectRef}
                    classNamePrefix="react-select"
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    placeholder="Filter"
                    isClearable
                    menuPortalTarget={isClient ? document.body : null}
                    menuPosition="fixed"
                    components={{ Option: customOption }}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        background: "transparent",
                        border: "none",
                        boxShadow: "none",
                        cursor: "pointer",
                        minWidth: 0,
                        width: "100%",
                        maxWidth: "100%",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 99999,
                        minWidth: 0,
                        width: "100vw",
                        left: 0,
                        maxWidth: "100vw",
                        position: "fixed",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        left: 0,
                        width: "100vw",
                        minWidth: 0,
                        maxWidth: "100vw",
                        position: "fixed",
                        zIndex: 99999,
                        top: 56,
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className="border-1 border-gray-300 legal-search-bar"
              style={{
                width: "350px",
                borderRadius: "4px",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                padding: "7px",
                marginLeft: "10px",
              }}
            >
              <img src={searchIcon} alt="search" className="mr-2" />
              <input
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalSearch;
