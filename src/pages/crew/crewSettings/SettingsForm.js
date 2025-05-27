import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { InputSwitch } from "primereact/inputswitch";
import { useUser } from "../../../context/userContext";
import { useNotifications } from "../../../context/notificationsContext";
import { Dialog } from "primereact/dialog";

const SettingsForm = ({ onSave, onCancel, loading }) => {
  const { user } = useUser();
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [accountVisibility, setAccountVisibility] = useState(true);
  const [theme, setTheme] = useState("light");
  const [deleteAccountEnabled, setDeleteAccountEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Populate form with user data when available
    if (user) {
      // Set name from firstName and lastName if available
      const firstName = user.firstName || user?.profile?.firstName || "";
      const lastName = user.lastName || user?.profile?.lastName || "";
      setName(
        firstName && lastName
          ? `${firstName} ${lastName}`
          : firstName || lastName || ""
      );

      // Set email
      setEmail(user.email || "");
      // Set phone
      setPhone(user.phone || user?.profile?.phone || "");
      // Set two-factor authentication status if available
      setTwoFactorEnabled(user.twoFactorEnabled || false);

      // Set account visibility if available
      setAccountVisibility(user.accountVisibility !== false);
    }
  }, [user]);

  const handleSubmit = () => {
    // Validate form
    if (password && password !== confirmPassword) {
      return {
        success: false,
        message: "New password and confirm password do not match",
      };
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
        return {
          success: false,
          message: "Current password is required to change password",
        };
      }

      settingsData.currentPassword = currentPassword;
      settingsData.newPassword = password;
      settingsData.confirmPassword = confirmPassword;
    }

    onSave(settingsData);
  };

  return (
    <div className="settings-grid">
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
      <div className="settings-form-group">
        <label>Notifications</label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "8px 16px",
            minHeight: 44,
          }}
        >
          <span style={{ color: "#444", fontSize: 14 }}>Turn On</span>
          <InputSwitch
            checked={notificationsEnabled}
            onChange={(e) => toggleNotifications(e.value)}
            style={{ marginLeft: 8 }}
          />
        </div>
      </div>
      <div className="settings-form-group">
        <label>Delete Account</label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "8px 16px",
            minHeight: 44,
          }}
        >
          <span style={{ color: "#444", fontSize: 14 }}>Turn On</span>
          <InputSwitch
            checked={deleteAccountEnabled}
            onChange={(e) => {
              if (e.value) {
                setShowDeleteModal(true);
              } else {
                setDeleteAccountEnabled(false);
              }
            }}
            style={{ marginLeft: 8 }}
          />
        </div>
      </div>
      <Dialog
        visible={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setDeleteAccountEnabled(false);
        }}
        header="Confirm Delete Account"
        style={{ width: "400px" }}
        modal
        footer={
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button
              label="Cancel"
              className="p-button-text"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteAccountEnabled(false);
              }}
            />
            <Button
              label="Yes"
              className="p-button-danger"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteAccountEnabled(true);
                // Place your delete logic here if needed
              }}
            />
          </div>
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "2rem", color: "#dc3545" }}
          />
          <span>Are you sure you want to delete your account?</span>
        </div>
      </Dialog>
      <div className="settings-actions">
        <Button
          label="Cancel"
          className="p-button-danger"
          onClick={onCancel}
          disabled={loading}
        />
        <Button
          label={loading ? "Saving..." : "Save"}
          className="p-button-primary"
          onClick={handleSubmit}
          disabled={loading}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SettingsForm;
