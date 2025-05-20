import React, { useState } from "react";
import visa from "../../../assets/images/crew/visa.png";
import mastercard from "../../../assets/images/crew/mastercard.png";
import threeDots from "../../../assets/images/crew/three_dot.png";
import plus from "../../../assets/images/crew/plus.png";

const PaymentDetails = () => {
  return (
    <>
      <div
        className="bg-white pt-4 pl-3 pr-3 pb-7 ml-5"
        style={{ width: "30%", marginBottom: "20px", height: "550px", marginTop:"30px", borderRadius:"10px" }}
      >
        <div className="mt-6 mb-6">
          <h2>Saved Payment Methods </h2>
          <p> Manage your stored payment preference for faster transactions.</p>
        </div>
        <div
          style={{
            width: "100%",
            border: "1px solid #E0E0E0",
            padding: "8px 20px 8px 8px",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <div className="flex bg-white justify-content-between align-items-center">
            <div className="flex">
              <div>
                <img
                  src={visa}
                  alt="visa"
                  width={70}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <span>Visa ending in 1234</span>
                <br />

                <span>Expires 01/24</span>
              </div>
            </div>
            <div>
              <img src={threeDots} alt="three-dots" />
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            border: "1px solid #E0E0E0",
            padding: "8px 20px 8px 8px",
          }}
        >
          <div className="flex bg-white justify-content-between align-items-center">
            <div className="flex">
              <div>
                <img
                  src={mastercard}
                  alt="mastercard"
                  width={70}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <span>Mastercard ending in 1234</span>
                <br />

                <span>Expires 01/24</span>
              </div>
            </div>
            <div>
              <img src={threeDots} alt="three-dots" />
            </div>
          </div>
        </div>
        <div className="flex justify-content-center align-items-center">
          <button
            className="flex justify-content-center align-items-center"
            style={{
              border: "1px solid #0387D9",
              backgroundColor: "transparent",
              color: "#0387D9",
              fontSize: "16px",
              fontWeight: "500",
              padding: "17px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "50px",
            }}
          >
            <img src={plus} alt="plus" />
            Add Payment Method
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentDetails;
