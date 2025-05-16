import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { updateUserSettings } from "../../../services/crewSettings/crewsettings";
import SettingsForm from "./SettingsForm";
import "./crewsettings.css";

const CrewSettings = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = async (settingsData) => {
    setLoading(true);

    // Add console log
    console.log("Data received from form:", settingsData);

    // Check if there are validation errors from the form
    if (settingsData.success === false) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: settingsData.message,
        life: 3000,
      });
      setLoading(false);
      return;
    }

    // Remove the success flag before sending to API
    const { success, ...dataToSend } = settingsData;

    try {
      // Add console log before API call
      console.log("Sending to API:", dataToSend);
      const response = await updateUserSettings(dataToSend);
      
      // Add console log after API response
      console.log("API response:", response);

      if (response.status) {
        // Show success message
        toast.current.show({
          severity: "success",
          summary: "Settings Saved",
          detail: "Your settings have been updated successfully",
          life: 3000,
        });
        
        // Optional: Redirect after successful update
        // setTimeout(() => navigate('/crew/dashboard'), 2000);
      } else {
        // Show error message
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Failed to update settings",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="settings-page">
        <div className="settings-header">
          <div className="settings-header-content">
            <div className="settings-title">
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  paddingLeft: "20px",
                }}
              >
                Settings
              </h3>
            </div>
          </div>
        </div>

        <div className="settings-container">
          <SettingsForm
            onSave={handleSaveChanges}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default CrewSettings;
