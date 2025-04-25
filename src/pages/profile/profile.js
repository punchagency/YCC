import React, { useState } from "react";
import { Button } from "primereact/button";

import manprofile from "../../assets/images/crew/manprofile.png";
import "./profile.css";

const CrewSetting = () => {
  // const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData] = useState({
    name: "Alex",
    email: "Alexseiger@Gmail.Com",
    location: "Your Location Here",
    phone: "+1 355 2544 558",
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    // Add your save logic here
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Profile
            </h3>
          </div>
        </div>
      </div>
      <div className="settings-container">
        <div className="profile-container-about">
          <div className="profile-container-about-left">
            <div className="profile-container-about-left-top">
              <img src={manprofile} alt="manprofile" />
              <div className="profile-name">
                <p>Alex Seiger</p>
                <p>Alexseiger@Gmail.Com</p>
              </div>
              <div className="profile-location-wrapper">
                <p className="profile-location">Sydney, Australia</p>
              </div>
            </div>
            <div>
              <button onClick={handleEdit}>Edit</button>
            </div>
          </div>
          <div>
            <div>
              <p className="profile-about-title">About</p>
              <p>
                Lorem Ipsum Dolor Sit Amet Consectetur. Etiam Porttitor
                Dignissim Bibendum Pharetra Tristique A Quis. Tincidunt Quis
                Congue Sodales Maecenas Proin Commodo Sed Bibendum Sed.
                Consequat Fringilla Pharetra Malesuada Nisl Facilisis. Morbi
                Tortor Aliquam Fusce Ac Dui Iaculis. Viverra Leo Velit Erat In
                Etiam Donec Tellus Nunc Gravida.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="personal-information-section">
        <h3>Personal Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Order History</label>
            <input
              type="text"
              value={formData.email}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={formData.phone}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
        </div>
        {isEditing && (
          <div className="form-actions">
            <Button
              label="Cancel"
              className="p-button-text cancel-button"
              icon="pi pi-times"
              onClick={handleCancel}
              style={{ backgroundColor: "#EF4444", color: "" }}
            />
            <Button
              label="Save"
              className="save-button"
              icon="pi pi-check"
              onClick={handleSave}
              style={{ backgroundColor: "#0387D9", color: "#ffffff" }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CrewSetting;
