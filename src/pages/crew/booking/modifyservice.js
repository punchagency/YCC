import React from "react";
import { useNavigate } from "react-router-dom";
import vector from "../../../assets/images/crew/Vector 5.png";

const Booking = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div
        className="mb-6 flex align-items-center bg-white p-3"
        style={{ width: "100%" }}
      >
        <img
          src={vector}
          alt="vector"
          width="10px"
          height="10px"
          objectFit="contain"
          onClick={handleGoBack}
          style={{ cursor: "pointer" }}
        />
        <h2 className="ml-2">Modify Service</h2>
      </div>
      <div className="ml-5 mt-4 mb-3">
        <h2>Current Service Detail</h2>
      </div>
      <div style={{ width: "97%", marginLeft: "1.5%" }}>
        <div
          className="flex bg-white p-4 rounded-lg"
          style={{ width: "100%", borderRadius: "15px" }}
        >
          <div className="flex justify-between align-items-center">
            <div className="" style={{ width: "50%", marginRight: "10px" }}>
              <label>Service Name</label>
              <input
                type="text"
                placeholder="Service Type"
                className="border border-gray-300 rounded-md"
                style={{
                  width: "100%",
                  border: "1px solid lightgrey",
                  padding: "15px 10px",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              />
            </div>
            <div className="" style={{ width: "50%" }}>
              <label>Date</label>
              <input
                type="text"
                placeholder="Service Type"
                className="border border-gray-300 rounded-md"
                style={{
                  width: "100%",
                  border: "1px solid lightgrey",
                  padding: "15px 10px",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              />
            </div>
          </div>
        </div>
        <div
          className="flex justify-between align-items-center bg-white p-4 rounded-lg"
          style={{ width: "100%", borderRadius: "15px", marginTop: "10px" }}
        >
          <div className="" style={{ width: "50%", marginRight: "10px" }}>
            <label>Time</label>
            <input
              type="text"
              placeholder="Service Type"
              className="border border-gray-300 rounded-md"
              style={{
                width: "100%",
                border: "1px solid lightgrey",
                padding: "15px 10px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            />
          </div>
          <div className="" style={{ width: "50%" }}>
            <label>Cost</label>
            <input
              type="text"
              placeholder="Service Type"
              className="border border-gray-300 rounded-md"
              style={{
                width: "100%",
                border: "1px solid lightgrey",
                padding: "15px 10px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            />
          </div>
        </div>
      </div>
      <div
        className="bg-white"
        style={{
          width: "97%",
          marginLeft: "1.5%",
          marginTop: "10px",
          borderRadius: "15px",
          padding: "40px 20px",
        }}
      >
        <h2>Service Tier</h2>
        <div className="mb-6">
          <select
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: "10px",
              border: "1px solid lightgrey",
              outline: "none",
              marginTop: "10px",
            }}
          >
            <option value="1">Basic -$120</option>
            <option value="2">Standard -$150</option>
            <option value="3">Premium -$180</option>
            <option value="4">VIP -$200</option>
            <option value="5">Custom -$250</option>
          </select>
        </div>
        <div>
          <h2 className=" font-bold mb-4">Add-On Services</h2>
          <div>
            <div className="flex align-items-center mb-3">
              <input type="checkbox" />
              <label>Deep Clean (+$150) </label>
            </div>
            <div className="flex align-items-center mb-3">
              <input type="checkbox" />
              <label>Extra crew Member (+$100)</label>
            </div>
            <div className="flex align-items-center mb-6">
              <input type="checkbox" />
              <label>Weekend Service (+$100)</label>
            </div>
          </div>
          <div
            className="flex justify-content-between align-items-center"
            style={{
              border: "1px solid lightgrey",
              padding: "10px 20px",
              borderRadius: "10px",
            }}
          >
            <p>Updated Total Price</p>
            <p>$120</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;
