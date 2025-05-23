import React from "react";
import { FiFilter, FiChevronDown, FiSearch } from "react-icons/fi";

const SearchFilters = ({
  onFilterChange = () => {},
  onSearchChange = () => {},
  activeFilter = "all",
}) => {
  const handleFilterClick = (filter) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <>
      <div className="">
        <div className="flex justify-content-between align-items-center w-full">
          <div style={{ width: "40%" }}>
            <div
              className="flex justify-content-between align-items-center bg-white ml-5 mt-4 p-2"
              style={{ borderRadius: "10px", height: "100%" }}
            >
              <div
                style={{
                  backgroundColor:
                    activeFilter === "all" ? "#0387D9" : "transparent",
                  borderRadius: "10px",
                  padding: "5px",
                  color: activeFilter === "all" ? "white" : "black",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => handleFilterClick("all")}
              >
                All
              </div>
              <div
                style={{
                  backgroundColor:
                    activeFilter === "pending" ? "#0387D9" : "transparent",
                  borderRadius: "10px",
                  padding: "5px",
                  color: activeFilter === "pending" ? "white" : "black",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => handleFilterClick("pending")}
              >
                Pending Invoices
              </div>
              <div
                style={{
                  backgroundColor:
                    activeFilter === "completed" ? "#0387D9" : "transparent",
                  borderRadius: "10px",
                  padding: "5px",
                  color: activeFilter === "completed" ? "white" : "black",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => handleFilterClick("completed")}
              >
                Completed Payment
              </div>
              <div
                style={{
                  backgroundColor:
                    activeFilter === "upcoming" ? "#0387D9" : "transparent",
                  borderRadius: "10px",
                  padding: "5px",
                  color: activeFilter === "upcoming" ? "white" : "black",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => handleFilterClick("upcoming")}
              >
                Upcoming Expenses
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "300px",
                height: "40px",
                marginRight: "10px",
                marginTop: "7px",
              }}
            >
              <div
                className="flex items-center justify-between bg-white border border-gray-300 rounded-[10px] px-3 shadow-sm p-2"
                style={{ borderRadius: "6px" }}
              >
                <FiFilter className="text-gray-500 text-sm mr-2" />
                <span className="text-gray-500 text-sm flex-1">
                  Select Filter
                </span>
                <FiChevronDown className="text-gray-500 text-sm" />
              </div>
            </div>
            <div
              className="flex items-center bg-white border border-gray-300 rounded-[10px] px-3 shadow-sm p-2 mr-5"
              style={{ borderRadius: "6px" }}
            >
              <FiSearch className="text-gray-400 text-sm mr-2" />
              <input
                type="text"
                placeholder="Search Transactions"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent border-none outline-none h-full"
                onChange={(e) =>
                  onSearchChange && onSearchChange(e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
