import { React } from "react";
import TrainingSearch from "./trainingsearch";
import TrainingBoxes from "./trainingboxes";

const Inventory = () => {
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                marginLeft: "10px",
              }}
            >
              Crew Portal
            </h3>
          </div>
        </div>
      </div>
      <TrainingSearch />
      <TrainingBoxes />
    </>
  );
};

export default Inventory;
