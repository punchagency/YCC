import { React } from "react";
import bar from "../../../assets/images/crew/bar.png";

const ActiveOrders = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div style={{ width: "30%" }} className="m-4">
          <div
            className="flex bg-white p-4"
            style={{ width: "200px", borderRadius: "10px" }}
          >
            <div
              style={{
                backgroundColor: "#D5B184",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="mr-3"
            >
              <img src={bar} alt="bar" width="20px" height="20px" />
            </div>
            <div>
              <h2 style={{ fontSize: "20px" }}>Active Orders</h2>
              <h1 className="text-2xl font-bold">56</h1>
            </div>
          </div>
        </div>
        <div style={{ width: "30%" }} className="m-4">
          <div
            className="flex bg-white p-4"
            style={{ width: "200px", borderRadius: "10px" }}
          >
            <div
              style={{
                backgroundColor: "#D5B184",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="mr-3"
            >
              <img src={bar} alt="bar" width="20px" height="20px" />
            </div>
            <div>
              <h2 style={{ fontSize: "20px" }}>Completed Orders</h2>
              <h1 className="text-2xl font-bold">25</h1>
            </div>
          </div>
        </div>
        <div style={{ width: "30%" }} className="m-4">
          <div
            className="flex bg-white p-4"
            style={{ width: "200px", borderRadius: "10px" }}
          >
            <div
              style={{
                backgroundColor: "#D5B184",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="mr-3"
            >
              <img src={bar} alt="bar" width="20px" height="20px" />
            </div>
            <div>
              <h2 style={{ fontSize: "20px" }}>Pending Orders</h2>
              <h1 className="text-2xl font-bold">31</h1>
            </div>
          </div>
        </div>
      </div>
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
            Pending Orders
          </div>
          <div>Shipped Orders</div>
          <div>Delivered Orders</div>
        </div>
      </div>
    </>
  );
};

export default ActiveOrders;
