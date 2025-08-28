import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useNavigate, useOutletContext } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
// import { Checkbox } from "primereact/checkbox";

import { useUser } from "../../../context/userContext";
import { Toast } from "primereact/toast";
import { updateUserSettings } from "../../../services/crewSettings/crewsettings";

// import { Menu } from "primereact/menu";
// import { confirmDialog } from "primereact/confirmdialog";

// Define these arrays outside the component to prevent infinite loops
// const LANGUAGES = [
//   { name: "English", code: "en" },
//   { name: "Spanish", code: "es" },
//   { name: "French", code: "fr" },
//   { name: "German", code: "de" },
//   { name: "Italian", code: "it" },
//   { name: "Portuguese", code: "pt" },
//   { name: "Russian", code: "ru" },
//   { name: "Chinese", code: "zh" },
//   { name: "Japanese", code: "ja" },
//   { name: "Arabic", code: "ar" },
// ];

const AdminSetting = () => {
  const navigate = useNavigate();
  const { setPageTitle } = useOutletContext() || {};
  const { user } = useUser();

  const toast = React.useRef(null);
  // const deleteMenuRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (setPageTitle) setPageTitle("Settings");
    // Populate form with user data when available
    if (user) {
      // Set name from crewProfile firstName and lastName if available
      const firstName = user.crewProfile?.firstName || user.firstName || "";
      const lastName = user.crewProfile?.lastName || user.lastName || "";
      setName(
        firstName && lastName
          ? `${firstName} ${lastName}`
          : firstName || lastName || ""
      );

      // Set email
      setEmail(user.email || "");
      // Set phone from crewProfile
      setPhone(user.crewProfile?.phoneNumber || user.phone || "");
      // Set two-factor authentication status if available

      // Set account visibility if available
    }
  }, [user, setPageTitle]);

  const handleSaveChanges = async () => {
    setLoading(true);

    // Validate form
    if (password && password !== confirmPassword) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "New password and confirm password do not match",
        life: 3000,
      });
      setLoading(false);
      return;
    }

    // Prepare data for API
    const settingsData = {
      name,
      email,
      phone,
    };

    // Add password fields if changing password
    if (password) {
      if (!currentPassword) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Current password is required to change password",
          life: 3000,
        });
        setLoading(false);
        return;
      }

      settingsData.currentPassword = currentPassword;
      settingsData.newPassword = password;
      settingsData.confirmPassword = confirmPassword;
    }

    try {
      const response = await updateUserSettings(settingsData);

      if (response.status) {
        // Clear password fields
        setCurrentPassword("");
        setPassword("");
        setConfirmPassword("");

        // Show success message
        toast.current.show({
          severity: "success",
          summary: "Settings Saved",
          detail: "Your settings have been updated successfully",
          life: 3000,
        });
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

  // const confirmDeleteAccount = () => {
  //   confirmDialog({
  //     message:
  //       "Are you sure you want to delete your account? This action cannot be undone.",
  //     header: "Delete Account Confirmation",
  //     icon: "pi pi-exclamation-triangle",
  //     acceptClassName: "p-button-danger",
  //     accept: () => handleDeleteAccount(),
  //     reject: () => {},
  //   });
  // };

  // const handleDeleteAccount = () => {
  //   console.log("Deleting account...");
  //   Implement actual account deletion logic here

  //   Show success message
  //   if (toast.current) {
  //     toast.current.show({
  //       severity: "info",
  //       summary: "Account Deleted",
  //       detail: "Your account has been deleted successfully",
  //       life: 3000,
  //     });
  //   }

  //   Redirect to login page after a delay
  //   setTimeout(() => {
  //     navigate("/login");
  //   }, 3000);
  // };

  // const changeTheme = () => {
  //   // Implement theme change logic here
  //   setTheme(theme === "light" ? "dark" : "light");
  // };

  return (
    <>
      <Toast ref={toast} />
      <div style={{ background: "#F8FBFF", minHeight: "100vh", width: "100%" }}>
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content"></div>
        </div>

        <div className="settings-container">
          <div className="settings-grid">
            {/* <div className="settings-form-group">
              <label>Username</label>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                style={{ width: "100%" }}
                disabled={loading}
              />
            </div> */}

            <div className="settings-form-group">
              <label>Email</label>
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                style={{ width: "100%" }}
                disabled={loading}
              />
            </div>

            <div className="settings-form-group">
              <label>Current Password</label>
              <Password
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password (required for password change)"
                feedback={false}
                style={{ width: "100%" }}
                toggleMask
                disabled={loading}
              />
            </div>

            <div className="settings-form-group">
              <label>New Password</label>
              <Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                feedback={true}
                style={{ width: "100%" }}
                toggleMask
                disabled={loading}
              />
            </div>

            <div className="settings-form-group">
              <label>Confirm Password</label>
              <Password
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                feedback={false}
                toggleMask
                style={{ width: "100%" }}
                disabled={loading}
              />
            </div>

            {/* <div className="settings-form-group">
              <label>Phone Number</label>
              <InputText
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Add Phone Number"
                disabled={loading}
              />
            </div> */}

            {/* <div className="settings-form-group">
              <label>Two-Factor Authentication</label>
              <InputText placeholder="Verify Your Two-Factor Authentication" />
            </div>

            <div className="settings-form-group">
              <label>Notifications</label>
              <div className="toggle-container">
                <span>Turn On</span>
                <InputSwitch
                  checked={notificationsEnabled}
                  onChange={toggleNotifications}
                />
              </div>
            </div>

            <div className="settings-form-group">
              <label>Theme (Light/Dark Mode)</label>
              <div className="toggle-container">
                <span>Light Mode</span>
                <InputSwitch
                  checked={theme === "dark"}
                  onChange={changeTheme}
                  style={{ width: "100%" }}
                />
              </div>
            </div> */}

            {/* <div className="settings-form-group">
              <label>Account Visibility</label>
              <div className="toggle-container">
                <span>Visible Now</span>
                <InputSwitch
                  checked={accountVisibility}
                  onChange={(e) => setAccountVisibility(e.value)}
                />
              </div>
            </div> */}

            {/* <div className="settings-form-group delete-account">
              <label>Delete Accounts</label>
              <div className="delete-buttons">
                <Button
                  label="No"
                  className="p-button-danger"
                  style={{ width: "100px !important" }}
                />
                <Button label="Yes" className="p-button-primary" />
              </div>
            </div> */}
          </div>

          <div className="settings-actions">
            <Button
              label="Cancel"
              className="p-button-danger"
              onClick={() => navigate(-1)}
              disabled={loading}
            />
            <Button
              label={loading ? "Saving..." : "Save"}
              className="p-button-primary"
              onClick={handleSaveChanges}
              disabled={loading}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSetting;
