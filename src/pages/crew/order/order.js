import { React } from "react";
import ActiveOrders from "./active";
import OrderTable from "./table";

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
              Orders Management
            </h3>
          </div>
        </div>
      </div>
      <ActiveOrders />
      <OrderTable />
    </>
  );
};

export default Inventory;
