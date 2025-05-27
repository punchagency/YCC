import { React } from "react";
import Location from "./location";
import Rooms from "./rooms";

const Accomodation = () => {
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
              Accomodation
            </h3>
          </div>
        </div>
      </div>
      <Location />
      <Rooms />
    </>
  );
};

export default Accomodation;
