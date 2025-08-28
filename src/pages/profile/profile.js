import React, { useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useUser } from "../../context/userContext";
import { useOutletContext } from "react-router-dom";

import manprofile from "../../assets/images/crew/manprofile.png";
import "./profile.css";
import {
  uploadProfilePicture,
  removeProfilePicture,
  updateUserSettings,
  updateCrewProfile,
} from "../../services/crewSettings/crewsettings";

const YEARS_OF_EXPERIENCE_OPTIONS = [
  { label: "0-2", value: "0-2" },
  { label: "2-4", value: "2-4" },
  { label: "4-10", value: "4-10" },
  { label: "10+", value: "10+" },
];
const DEPARTMENT_OPTIONS = [
  { label: "Captain", value: "captain" },
  { label: "Exterior", value: "exterior" },
  { label: "Interior", value: "interior" },
  { label: "Chef", value: "chef" },
  { label: "Engineering", value: "engineering" },
];

const ProfilePage = () => {
  const { user, refreshUser } = useUser();
  const isCrew =
    user?.role?.name === "crew_member" || user?.role === "crew_member";
  const outletContext = useOutletContext();

  // Helper to always prefix phone with + if not empty
  const formatPhone = (phone) => {
    if (!phone) return "";
    return phone.startsWith("+") ? phone : `+${phone}`;
  };

  // Initial form data for admin or crew
  const initialFormData = isCrew
    ? {
        name: user?.crewProfile
          ? `${user.crewProfile.firstName} ${user.crewProfile.lastName}`
          : user?.name || "",
        email: user?.email || "",
        location: user?.crewProfile?.country || "",
        phone: formatPhone(user?.crewProfile?.phone || ""),
        yearsOfExperience: user?.crewProfile?.yearsOfExperience || "",
        department: user?.crewProfile?.position || "",
      }
    : {
        name: user?.name || "",
        email: user?.email || "",
        location: user?.location || "",
        phone: formatPhone(user?.phone || ""),
      };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [showPicDrawer, setShowPicDrawer] = useState(false);
  const picRef = useRef(null);
  const [showPicPreview, setShowPicPreview] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [replyToEmail, setReplyToEmail] = useState(
    user?.replyToEmail || user?.email || ""
  );

  const handleEdit = () => {
    setIsEditing(true);
    setSaveLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(initialFormData);
    setSaveLoading(false);
  };

  const handleSave = async () => {
    if (isCrew) {
      setSaveLoading(true);
      try {
        // Parse name into firstName and lastName
        const nameParts = formData.name.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const updateData = {
          firstName,
          lastName,
          phone: formData.phone.replace(/^\+/, ""),
          country: formData.location,
          yearsOfExperience: formData.yearsOfExperience,
          position: formData.department,
          replyToEmail: replyToEmail,
        };

        const response = await updateCrewProfile(updateData);
        if (response.status) {
          await refreshUser();
          setIsEditing(false);
        } else {
          alert(response.message || "Failed to update crew profile");
        }
      } catch (error) {
        alert("An error occurred while updating your profile");
      } finally {
        setSaveLoading(false);
      }
      return;
    }

    // For admin users, update the basic profile fields
    setSaveLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        location: formData.location,
        phone: formData.phone.replace(/^\+/, ""), // Remove + prefix for backend
        replyToEmail: replyToEmail,
      };

      const response = await updateUserSettings(updateData);

      if (response.status) {
        await refreshUser(); // Refresh user data from context
        setIsEditing(false);
      } else {
        alert(response.message || "Failed to update profile");
      }
    } catch (error) {
      alert("An error occurred while updating your profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangePicture = () => {
    if (fileInputRef.current) fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicLoading(true);
    const res = await uploadProfilePicture(file);
    setPicLoading(false);
    if (res.status) {
      await refreshUser();
    } else {
      alert(res.message || "Failed to upload profile picture");
    }
  };

  const handleRemovePicture = async () => {
    if (!window.confirm("Remove your profile picture?")) return;
    setPicLoading(true);
    const res = await removeProfilePicture();
    setPicLoading(false);
    if (res.status) {
      await refreshUser();
    } else {
      alert(res.message || "Failed to remove profile picture");
    }
  };

  const handleViewPicture = () => {
    setShowPicDrawer(false);
    setTimeout(() => setShowPicPreview(true), 200); // Wait for drawer to close
  };

  // Calculate drawer position relative to profile picture
  const getDrawerStyle = () => {
    if (!picRef.current) return { opacity: 0, pointerEvents: "none" };
    const rect = picRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return {
        position: "absolute",
        top: rect.bottom + 12 + window.scrollY,
        left: rect.left + window.scrollX,
        zIndex: 1000,
        opacity: showPicDrawer ? 1 : 0,
        pointerEvents: showPicDrawer ? "auto" : "none",
        transform: showPicDrawer ? "translateY(0)" : "translateY(40px)",
        transition:
          "opacity 0.22s cubic-bezier(.4,2,.6,1), transform 0.22s cubic-bezier(.4,2,.6,1)",
        minWidth: 220,
        maxWidth: 260,
        borderRadius: 16,
        boxShadow:
          "0 8px 32px rgba(4,135,217,0.18), 0 1.5px 6px rgba(0,0,0,0.08)",
        background: "#fff",
        padding: "0.5rem 0.75rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      };
    } else {
      return {
        position: "absolute",
        top: rect.top + window.scrollY,
        left: rect.right + 16 + window.scrollX,
        zIndex: 1000,
        opacity: showPicDrawer ? 1 : 0,
        pointerEvents: showPicDrawer ? "auto" : "none",
        transform: showPicDrawer ? "translateX(0)" : "translateX(40px)",
        transition:
          "opacity 0.22s cubic-bezier(.4,2,.6,1), transform 0.22s cubic-bezier(.4,2,.6,1)",
        minWidth: 220,
        maxWidth: 260,
        borderRadius: 16,
        boxShadow:
          "0 8px 32px rgba(4,135,217,0.18), 0 1.5px 6px rgba(0,0,0,0.08)",
        background: "#fff",
        padding: "0.5rem 0.75rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      };
    }
  };

  // Close drawer on click outside
  React.useEffect(() => {
    const handleClick = (e) => {
      if (
        showPicDrawer &&
        picRef.current &&
        !picRef.current.contains(e.target)
      ) {
        const drawer = document.getElementById("profile-pic-mini-drawer");
        if (drawer && !drawer.contains(e.target)) {
          setShowPicDrawer(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPicDrawer]);

  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle("Profile", { backArrow: true });
    }
  }, [outletContext]);

  return (
    <>
      {/* Mini-drawer for profile picture actions */}
      <div
        id="profile-pic-mini-drawer"
        style={
          showPicDrawer
            ? getDrawerStyle()
            : { ...getDrawerStyle(), pointerEvents: "none" }
        }
      >
        {showPicDrawer && (
          <div className="profile-pic-drawer-content">
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                marginBottom: 4,
              }}
            >
              <Button
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => setShowPicDrawer(false)}
                aria-label="Close"
                style={{ fontSize: 20 }}
              />
            </div>
            <Button
              label="Change Profile Picture"
              icon="pi pi-upload"
              className="p-button-text drawer-action-btn"
              onClick={handleChangePicture}
              style={{ width: "100%", marginBottom: 12 }}
              disabled={picLoading}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              label="View Profile Picture"
              icon="pi pi-eye"
              className="p-button-text drawer-action-btn"
              onClick={handleViewPicture}
              style={{ width: "100%", marginBottom: 12 }}
            />
            <Button
              label="Remove Profile Picture"
              icon="pi pi-trash"
              className="p-button-text drawer-action-btn"
              severity="danger"
              onClick={handleRemovePicture}
              style={{ width: "100%" }}
              disabled={picLoading}
            />
          </div>
        )}
      </div>

      {/* Profile picture preview modal */}
      {showPicPreview && (
        <div
          className="profile-pic-preview-modal"
          onClick={() => setShowPicPreview(false)}
        >
          <div
            className="profile-pic-preview-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                user?.profilePicture ||
                user?.crewProfile?.profilePicture ||
                manprofile
              }
              alt="Profile Preview"
              style={{
                maxWidth: "90vw",
                maxHeight: "70vh",
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(4,135,217,0.18)",
              }}
            />
            <Button
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowPicPreview(false)}
              style={{ position: "absolute", top: 8, right: 8, fontSize: 22 }}
              aria-label="Close"
            />
          </div>
        </div>
      )}

      <div className="settings-container">
        <div className="profile-container-about">
          <div className="profile-container-about-left">
            <div className="profile-container-about-left-top">
              <img
                ref={picRef}
                src={
                  user?.profilePicture ||
                  user?.crewProfile?.profilePicture ||
                  manprofile
                }
                alt="manprofile"
                className="profile-picture-clickable"
                onClick={() => setShowPicDrawer((v) => !v)}
                style={{ cursor: "pointer" }}
              />
              <div className="profile-name">
                <p>{formData.name}</p>
                <p>{formData.email}</p>
              </div>
              <div className="profile-location-wrapper">
                <p className="profile-location">{formData.location}</p>
              </div>
            </div>
            <div>
              <Button
                label="Edit"
                className="edit-button"
                icon="pi pi-pencil"
                onClick={handleEdit}
                disabled={isEditing}
              />
            </div>
          </div>
          {/* <div>
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
          </div> */}
        </div>
      </div>
      <div className="personal-information-section profile-bottom-spacing">
        <h3>Personal Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={!isEditing}
              className="form-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              disabled={!isEditing}
              className="form-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              disabled={!isEditing}
              className="form-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              disabled={!isEditing}
              className="form-input"
              onChange={handleChange}
            />
          </div>
          {isCrew && (
            <>
              <div className="form-group">
                <label>Years of Experience</label>
                <select
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  disabled={!isEditing}
                  className="form-input"
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  {YEARS_OF_EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  disabled={!isEditing}
                  className="form-input"
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  {DEPARTMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="replyToEmail">Reply-To Email</label>
            <input
              type="email"
              id="replyToEmail"
              name="replyToEmail"
              value={replyToEmail}
              onChange={(e) => setReplyToEmail(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter a custom reply-to email or leave as your signup email"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
            <small style={{ color: "#888" }}>
              This email will be used as the reply-to address for calendar
              invites. Default is your signup email: <b>{user?.email}</b>
            </small>
          </div>
        </div>
        {isEditing && (
          <div className="form-actions">
            <Button
              label="Cancel"
              className="p-button-text cancel-button"
              icon="pi pi-times"
              onClick={handleCancel}
            />
            <Button
              label="Save"
              className="save-button"
              icon="pi pi-check"
              onClick={handleSave}
              loading={saveLoading}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
