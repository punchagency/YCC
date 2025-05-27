import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
// import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { useUser } from "../../../context/userContext";
import { useNotifications } from "../../../context/notificationsContext";
import { Toast } from "primereact/toast";

// import { Menu } from "primereact/menu";
// import { confirmDialog } from "primereact/confirmdialog";

const CrewSetting = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  const toast = React.useRef(null);
  // const deleteMenuRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [language, setLanguage] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [accountVisibility, setAccountVisibility] = useState(true);
  const [theme, setTheme] = useState("light");

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
  }, [user, languages, timezones]);

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

  const changeTheme = () => {
    // Implement theme change logic here
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <Toast ref={toast} />
      <div style={{ background: "#F8FBFF", minHeight: "100vh", width: "100%" }}>
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="content">
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Settings
              </h3>
            </div>
          </div>
        </div>

        <div className="settings-container">
          <div className="settings-grid">
            <div className="settings-form-group">
              <label>Username</label>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                style={{ width: "100%" }}
              />
            </div>

            <div className="settings-form-group">
              <label>Email</label>
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                style={{ width: "100%" }}
              />
            </div>

            <div className="settings-form-group">
              <label>Password</label>
              <Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                feedback={false}
                style={{ width: "100%" }}
                toggleMask
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
              />
            </div>

            <div className="settings-form-group">
              <label>Phone Number</label>
              <InputText
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Add Phone Number"
              />
            </div>

            <div className="settings-form-group">
              <label>Two-Factor Authentication</label>
              <InputText placeholder="Verify Your Two-Factor Authentication" />
            </div>

            <div className="settings-form-group">
              <label>Language</label>
              <Dropdown
                value={language}
                options={languages}
                onChange={(e) => setLanguage(e.value)}
                optionLabel="name"
                placeholder="Select Language"
              />
            </div>

            <div className="settings-form-group">
              <label>Time Zone</label>
              <Dropdown
                value={timezone}
                options={timezones}
                onChange={(e) => setTimezone(e.value)}
                optionLabel="name"
                placeholder="Set Time Zone"
              />
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
            </div>

            <div className="settings-form-group">
              <label>Account Visibility</label>
              <div className="toggle-container">
                <span>Visible Now</span>
                <InputSwitch
                  checked={accountVisibility}
                  onChange={(e) => setAccountVisibility(e.value)}
                />
              </div>
            </div>

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
            />
            <Button
              label="Save"
              className="p-button-primary"
              onClick={handleSaveChanges}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CrewSetting; 