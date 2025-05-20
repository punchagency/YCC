import { React } from "react";
import { FaChevronDown } from "react-icons/fa";
const Stock = () => {
  return (
    <>
      <div>
       
          <div className="flex justify-content-between align-items-center">
            <div style={{ width: "50%" }}>
              <h2>Current Stock Overview</h2>
            </div>
            <div className="flex justify-content-end">
              <button
                className="mr-2 p-2 bg-transparent"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "3px",
                  alignContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                All Categories <FaChevronDown style={{ marginLeft: "5px" }} />
              </button>
              <button
                className="mr-2 p-2 bg-transparent"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "3px",
                  alignContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Stock Level <FaChevronDown style={{ marginLeft: "5px" }} />
              </button>
              <button
                className="mr-2 p-2 bg-transparent"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "3px",
                  alignContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Vendors <FaChevronDown style={{ marginLeft: "5px" }} />
              </button>
            </div>
          </div>
        
      </div>
    </>
  );
};

export default Stock;
