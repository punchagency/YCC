import React, { useState } from "react";
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
  return (
    <>
      <div>
        <div className="flex align-items-center justify-content-between p-4">
          <div className="" style={{ width: "95%", marginLeft: "20px" }}>
            <h2>Legal Resources</h2>
          </div>
          <div className="flex align-items-center">
            <div
              className="bg-transparent border-1 border-gray-300"
              style={{ width: "350px", borderRadius: "4px", padding: "5px" }}
            >
              <div className="flex align-items-center justify-content-between">
                <div className="mr-3">
                  <img src={layerIcon} alt="layer" />
                </div>
                <div style={{ width: "100%" }}>
                  <Select
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    placeholder="Filter"
                    isClearable
                    components={{ Option: customOption }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: "transparent",
                        border: "none",
                        boxShadow: "none",
                        cursor: "pointer",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className="border-1 border-gray-300"
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
