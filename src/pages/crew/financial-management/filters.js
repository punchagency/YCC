import React, { useState } from "react";
import { FiFilter, FiChevronDown, FiSearch } from "react-icons/fi";

const SearchFilters = () => {
  return (
    <>
      <div className="">
        <div className="flex justify-content-between align-items-center w-full">
          <div style={{ width: "30%" }}>
            <div
              className="flex justify-content-between align-items-center bg-white ml-5 mt-4 p-2"
              style={{ borderRadius: "10px", height: "100%" }}
            >
              <div
                style={{
                  backgroundColor: "#0387D9",
                  borderRadius: "10px",
                  padding: "5px",
                  color: "white",
                }}
              >
                Pending Invoices
              </div>
              <div>Completed Payment</div>
              <div>Upcoming Expenses</div>
            </div>
          </div>
          <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            <div style={{ width: "300px", height: " 40px", marginRight:"10px", marginTop:"7px"}}>
              <div className="flex items-center justify-between bg-white border border-gray-300 rounded-[10px] px-3 shadow-sm p-2" style={{borderRadius:"6px"}}>
                <FiFilter className="text-gray-500 text-sm mr-2" />
                <span className="text-gray-500 text-sm flex-1">
                  Select Filter
                </span>
                <FiChevronDown className="text-gray-500 text-sm" />
              </div>
            </div>
            <div className="flex items-center bg-white border border-gray-300 rounded-[10px] px-3 shadow-sm p-2 mr-5" style={{borderRadius:"6px"}}>
              <FiSearch className="text-gray-400 text-sm mr-2" />
              <input
                type="text"
                placeholder="Search Transactions"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent border-none outline-none h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
