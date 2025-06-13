import { Button } from "primereact/button";
import React from "react";
import comingSoon from "../assets/images/coming-soon.jpg";
import { useNavigate } from "react-router-dom";
import CustomButton from '../components/Button';


export default function ComingSoon () {
  const navigate = useNavigate()
  const goBack = () =>{
    navigate(-1)
  }
  return (
    <>
      <div className="h-screen">
          <div className="flex h-full align-items-center">
            <div className="col-12">
              <img src={comingSoon} alt="Profile" className="block mx-auto" />
              {/* <h1 className="mb-3">Coming Soon</h1> */}
              <CustomButton onClick={goBack} style={{ fontFamily: 'Inter, sans-serif' }}>Go Back</CustomButton>
            </div>
          </div>
      </div>
    </>
  );
};
