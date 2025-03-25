import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { useUser } from "../../../context/userContext";
import { useNotifications } from "../../../context/notificationsContext";
import { Toast } from "primereact/toast";

import { Menu } from "primereact/menu";
import { confirmDialog } from "primereact/confirmdialog";

const CrewSetting = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { notificationsEnabled, toggleNotifications } = useNotifications();
 
  const toast = React.useRef(null);
  const deleteMenuRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [language, setLanguage] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [accountVisibility, setAccountVisibility] = useState(true);

  // Language options
  const languages = [
    { name: "English", code: "en" },
    { name: "Spanish", code: "es" },
    { name: "French", code: "fr" },
    { name: "German", code: "de" },
    { name: "Italian", code: "it" },
    { name: "Portuguese", code: "pt" },
    { name: "Russian", code: "ru" },
    { name: "Chinese", code: "zh" },
    { name: "Japanese", code: "ja" },
    { name: "Arabic", code: "ar" },
  ];

  // Timezone options
  const timezones = [
    { name: "(GMT-12:00) International Date Line West", code: "Etc/GMT+12" },
    { name: "(GMT-11:00) Midway Island, Samoa", code: "Pacific/Midway" },
    { name: "(GMT-10:00) Hawaii", code: "Pacific/Honolulu" },
    { name: "(GMT-09:00) Alaska", code: "America/Anchorage" },
    {
      name: "(GMT-08:00) Pacific Time (US & Canada)",
      code: "America/Los_Angeles",
    },
    { name: "(GMT-07:00) Mountain Time (US & Canada)", code: "America/Denver" },
    { name: "(GMT-06:00) Central Time (US & Canada)", code: "America/Chicago" },
    {
      name: "(GMT-05:00) Eastern Time (US & Canada)",
      code: "America/New_York",
    },
    { name: "(GMT-04:00) Atlantic Time (Canada)", code: "America/Halifax" },
    { name: "(GMT-03:00) Brasilia", code: "America/Sao_Paulo" },
    { name: "(GMT-02:00) Mid-Atlantic", code: "Atlantic/South_Georgia" },
    { name: "(GMT-01:00) Azores", code: "Atlantic/Azores" },
    { name: "(GMT+00:00) London, Dublin, Edinburgh", code: "Europe/London" },
    { name: "(GMT+01:00) Paris, Berlin, Rome, Madrid", code: "Europe/Paris" },
    { name: "(GMT+02:00) Athens, Istanbul, Cairo", code: "Europe/Athens" },
    { name: "(GMT+03:00) Moscow, Kuwait, Riyadh", code: "Europe/Moscow" },
    { name: "(GMT+04:00) Dubai, Baku", code: "Asia/Dubai" },
    { name: "(GMT+05:00) Karachi, Tashkent", code: "Asia/Karachi" },
    { name: "(GMT+05:30) Kolkata, Chennai, Mumbai", code: "Asia/Kolkata" },
    { name: "(GMT+06:00) Dhaka, Almaty", code: "Asia/Dhaka" },
    { name: "(GMT+07:00) Bangkok, Jakarta", code: "Asia/Bangkok" },
    {
      name: "(GMT+08:00) Beijing, Hong Kong, Singapore",
      code: "Asia/Shanghai",
    },
    { name: "(GMT+09:00) Tokyo, Seoul", code: "Asia/Tokyo" },
    { name: "(GMT+10:00) Sydney, Melbourne", code: "Australia/Sydney" },
    { name: "(GMT+11:00) Solomon Islands", code: "Pacific/Guadalcanal" },
    { name: "(GMT+12:00) Auckland, Wellington", code: "Pacific/Auckland" },
  ];

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

      // Set language if available
      if (user.language) {
        const userLanguage = languages.find(
          (lang) => lang.code === user.language
        );
        setLanguage(userLanguage || languages[0]);
      } else {
        setLanguage(languages[0]); // Default to English
      }

      // Set timezone if available
      if (user.timezone) {
        const userTimezone = timezones.find((tz) => tz.code === user.timezone);
        setTimezone(userTimezone || timezones[7]); // Default to Eastern Time
      } else {
        setTimezone(timezones[7]); // Default to Eastern Time
      }

      // Set account visibility if available
      setAccountVisibility(user.accountVisibility !== false);
    }
  }, [user]);

  const handleSaveChanges = () => {
    console.log("Saving changes:", {
      name,
      email,
      password,
      confirmPassword,
      phone,
      twoFactorEnabled,
      language: language?.code,
      timezone: timezone?.code,
      notificationsEnabled,
    });

    // Show success message
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Settings Saved",
        detail: "Your settings have been updated successfully",
        life: 3000,
      });
    }
  };

  const confirmDeleteAccount = () => {
    confirmDialog({
      message:
        "Are you sure you want to delete your account? This action cannot be undone.",
      header: "Delete Account Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDeleteAccount(),
      reject: () => {},
    });
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account...");
    // Implement actual account deletion logic here

    // Show success message
    if (toast.current) {
      toast.current.show({
        severity: "info",
        summary: "Account Deleted",
        detail: "Your account has been deleted successfully",
        life: 3000,
      });
    }

    // Redirect to login page after a delay
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  // Template for dropdown items
  const languageOptionTemplate = (option) => {
    return (
      <div
        className="language-item"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {option.name}
      </div>
    );
  };

  const selectedLanguageTemplate = (option, props) => {
    if (option) {
      return (
        <div
          className="language-item"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {option.name}
        </div>
      );
    }
    return (
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {props.placeholder}
      </span>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Settings
            </h3>
          </div>
        </div>
      </div>
      <div
        className="settings-container"
        style={{
          padding: "20px",
          backgroundColor: "var(--bg-color, #fff)",
          color: "var(--text-color, #333)",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            textAlign: "left",
          }}
        >
          Manage Settings
        </h2>

        {/* Form container with flex display for name and email */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          {/* Name input */}
          <div style={{ flex: 1 }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Name
            </label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          </div>

          {/* Email input */}
          <div style={{ flex: 1 }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Email
            </label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          </div>
        </div>

        {/* Form container with flex display for password fields */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          {/* Password input */}
          <div style={{ flex: 1 }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Password
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              style={{
                width: "100%",
              }}
              inputStyle={{
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                width: "100%",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          </div>

          {/* Confirm Password input */}
          <div style={{ flex: 1 }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Confirm Password
            </label>
            <InputText
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          </div>
        </div>

        {/* Form container with flex display for phone and 2FA */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          {/* Phone input */}
          <div style={{ flex: 1 }}>
            <label
              htmlFor="phone"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Phone Number
            </label>
            <InputText
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          </div>

          {/* Two-Factor Authentication */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Two-Factor Authentication
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Checkbox
                inputId="twoFactor"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.checked)}
                style={{ marginRight: "10px" }}
              />
              <label
                htmlFor="twoFactor"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  cursor: "pointer",
                }}
              >
                Enable Two-Factor Authentication
              </label>
            </div>
          </div>
        </div>

        {/* Form container with flex display for language and timezone */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          {/* Language dropdown */}
          <div style={{ flex: 1 }}>
            <label
              htmlFor="language"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Language
            </label>
            <Dropdown
              id="language"
              value={language}
              options={languages}
              onChange={(e) => setLanguage(e.value)}
              optionLabel="name"
              placeholder="Select Language"
              itemTemplate={languageOptionTemplate}
              valueTemplate={selectedLanguageTemplate}
              style={{
                width: "100%",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              panelStyle={{
                border: "1px solid #e0e0e0",
              }}
              inputStyle={{
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            />
          </div>

          {/* Timezone dropdown */}
          <div style={{ flex: 1 }}>
            <label
              htmlFor="timezone"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Timezone
            </label>
            <Dropdown
              id="timezone"
              value={timezone}
              options={timezones}
              onChange={(e) => setTimezone(e.value)}
              optionLabel="name"
              placeholder="Select Timezone"
              itemTemplate={languageOptionTemplate}
              valueTemplate={selectedLanguageTemplate}
              style={{
                width: "100%",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              panelStyle={{
                border: "1px solid #e0e0e0",
              }}
              inputStyle={{
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>

        {/* Theme and Notification Settings */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            marginTop: "20px",
            justifyContent: "space-between",
          }}
        >
          {/* Notifications toggle */}
          <div style={{ flex: 1 }}>
            <label
              htmlFor="notifications"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Notifications
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="pi pi-bell"
                  style={{ fontSize: "1.2rem", marginRight: "8px" }}
                ></i>
                <span>{notificationsEnabled ? "Turn on" : "Turn off"}</span>
              </div>
              <InputSwitch
                checked={notificationsEnabled}
                onChange={toggleNotifications}
              />
            </div>
          </div>

          {/* Theme toggle */}
          <div style={{ flex: 1 }}>
            <label
              htmlFor="theme"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Theme
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                
                  <i
                    className="pi pi-moon"
                    style={{
                      fontSize: "1.2rem",
                      marginRight: "8px",
                      color: "#6B7280",
                    }}
                  ></i>
                
                
              </div>
             
            </div>
          </div>
        </div>

        {/* Account visibility and Delete Account row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          {/* Account visibility toggle */}
          <div style={{ flex: 1 }}>
            <label
              htmlFor="accountVisibility"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Account Visibility
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="pi pi-eye"
                  style={{ fontSize: "1.2rem", marginRight: "8px" }}
                ></i>
                <span>{accountVisibility ? "On" : "Off"}</span>
              </div>
              <InputSwitch
                checked={accountVisibility}
                onChange={(e) => setAccountVisibility(e.value)}
              />
            </div>
          </div>

          {/* Delete Account button */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Button
              label="Delete Account"
              icon="pi pi-trash"
              className="p-button-danger p-button-outlined"
              onClick={(e) => deleteMenuRef.current.toggle(e)}
              aria-haspopup
              aria-controls="delete-menu"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                width: "auto",
                height: "45px",
                fontSize: "14px",
              }}
            />

            <Menu
              model={[
                {
                  label: "Delete Account",
                  icon: "pi pi-trash",
                  command: () => confirmDeleteAccount(),
                },
                {
                  label: "Cancel",
                  icon: "pi pi-times",
                },
              ]}
              popup
              ref={deleteMenuRef}
              id="delete-menu"
            />
          </div>
        </div>

        {/* Save Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "30px",
          }}
        >
          <Button
            label="Cancel"
            onClick={handleSaveChanges}
            style={{
              backgroundColor: "#EF4444",
              border: "none",
              padding: "10px 20px",
              width: "150px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              marginRight: "10px",
            }}
          />

          <Button
            label="Save Changes"
            onClick={handleSaveChanges}
            style={{
              backgroundColor: "#0387D9",
              border: "none",
              padding: "10px 20px",
              width: "150px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CrewSetting;
