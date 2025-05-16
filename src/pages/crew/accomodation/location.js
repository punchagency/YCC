import { React } from "react";

const Location = () => {
  return (
    <>
      <div className="p-3">
        <div className="flex justify-content-between align-items-center">
          <div>
            <h2>Crew Accomodation</h2>
          </div>
          <div>
            <select
              style={{
                width: "200px",
                padding: "5px 3px 5px 3px",
                borderRadius: "5px",
                border: "1px solid lightgrey",
                outline: "none",
                marginRight: "10px",
              }}
              className=""
              defaultValue=""
            >
              <option value="" disabled>
                All Locations
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <button
              style={{
                padding: "5px 10px 5px 10px",
                borderRadius: "5px",
                backgroundColor: "#007bff",
                color: "white",
                border: "1px solid #007bff",
                outline: "none",
                width: "150px",
                padding: "5px 10px 5px 10px",
              }}
            >
              View Map
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Location;
