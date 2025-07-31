import { React } from "react";
import searchIcon from "../../../assets/images/crew/searchLogo.png";
import neworder from "../../../assets/images/crew/neworder.png";

const LegalSearch = () => {
  return (
    <>
      <div>
        <div className="flex align-items-center justify-content-between p-4">
          <div className="" style={{ width: "95%", marginLeft: "20px" }}>
            {/* Removed <h2>Training & Certification</h2> to avoid duplicate page title */}
          </div>
          <div className="flex align-items-center">
            {/* <div
              className="bg-transparent border-1 border-gray-300"
              style={{ width: "350px", borderRadius: "4px", padding: "5px" }}
            >
              <div className="flex align-items-center justify-content-between">
                <div className="mr-3">
                  <img src={layerIcon} alt="layer" />
                </div>

                <select
                  className="border-none w-full outline-none"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                    alignContent: "center",
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    25 Flag State
                  </option>
                  <option value="1">Flag State 1</option>
                  <option value="2">Flag State 2</option>
                  <option value="3">Flag State 3</option>
                </select>
              </div>
            </div> */}
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
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <button
                className="flex align-items-center justify-content-center outline-none"
                style={{
                  backgroundColor: "#0387D9",
                  border: "1px solid #0387D9",
                  borderRadius: "4px",
                  padding: "5px",
                  color: "white",
                  marginLeft: "10px",
                }}
              >
                <img src={neworder} alt="neworder" className="mr-2" /> Book New
                Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalSearch;
