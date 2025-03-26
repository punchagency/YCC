import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    name: "Emmanuel Nnachi",
    email: "emmanuelnnachi@example.com",
    password: "",
    confirmPassword: "",
    phoneNumber: "2349060724111",
    twoFactorEnabled: false,
    language: "English",
    timezone: "(GMT-05:00) Eastern Time",
    notificationsEnabled: true,
    darkMode: false,
    accountVisible: true
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };

  const handleSwitchChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDropdownChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = () => {
    // Save logic here
    console.log("Saving settings:", formData);
    // Show success message or navigate back
  };

  const handleDeleteAccount = () => {
    // Delete account logic
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Deleting account");
      // Perform deletion and logout
    }
  };

  const languageOptions = [
    { label: "English", value: "English" },
    { label: "Spanish", value: "Spanish" },
    { label: "French", value: "French" },
    { label: "German", value: "German" }
  ];

  const timezoneOptions = [
    { label: "(GMT-05:00) Eastern Time", value: "(GMT-05:00) Eastern Time" },
    { label: "(GMT-06:00) Central Time", value: "(GMT-06:00) Central Time" },
    { label: "(GMT-07:00) Mountain Time", value: "(GMT-07:00) Mountain Time" },
    { label: "(GMT-08:00) Pacific Time", value: "(GMT-08:00) Pacific Time" },
    { label: "(GMT+00:00) UTC", value: "(GMT+00:00) UTC" }
  ];

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Settings</h3>
          </div>
        </div>
      </div>

      <div className="settings-container" style={{ padding: isMobile ? '15px' : '30px' }}>
        <h2 style={{ 
          fontSize: isMobile ? '20px' : '24px', 
          marginBottom: '20px',
          fontWeight: '600'
        }}>
          Manage Settings
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: '20px',
          maxWidth: '800px'
        }}>
          {/* Name */}
          <div>
            <label 
              htmlFor="name" 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Name
            </label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ width: '100%' }}
            />
          </div>

          {/* Email */}
          <div>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Email
            </label>
            <InputText
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{ width: '100%' }}
            />
          </div>

          {/* Password */}
          <div>
            <label 
              htmlFor="password" 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Password
            </label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              toggleMask
              feedback={false}
              style={{ width: '100%' }}
              inputStyle={{ width: '100%' }}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label 
              htmlFor="confirmPassword" 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Confirm Password
            </label>
            <Password
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              toggleMask
              feedback={false}
              style={{ width: '100%' }}
              inputStyle={{ width: '100%' }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label 
              htmlFor="phoneNumber" 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Phone Number
            </label>
            <InputText
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              style={{ width: '100%' }}
            />
          </div>

          {/* Two-Factor Authentication */}
          <div>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Two-Factor Authentication
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0'
            }}>
              <span style={{ fontSize: '14px' }}>Enable Two-Factor Authentication</span>
              <InputSwitch
                checked={formData.twoFactorEnabled}
                onChange={(e) => handleSwitchChange('twoFactorEnabled', e.value)}
              />
            </div>
          </div>

          {/* Language */}
          <div>
            <label 
              htmlFor="language" 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Language
            </label>
            <Dropdown
              id="language"
              name="language"
              value={formData.language}
              options={languageOptions}
              onChange={(e) => handleDropdownChange('language', e.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Timezone */}
          <div>
            <label 
              htmlFor="timezone" 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Timezone
            </label>
            <Dropdown
              id="timezone"
              name="timezone"
              value={formData.timezone}
              options={timezoneOptions}
              onChange={(e) => handleDropdownChange('timezone', e.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Notifications */}
          <div>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Notifications
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="pi pi-bell" style={{ marginRight: '10px', fontSize: '18px' }}></i>
                <span style={{ fontSize: '14px' }}>Turn on</span>
              </div>
              <InputSwitch
                checked={formData.notificationsEnabled}
                onChange={(e) => handleSwitchChange('notificationsEnabled', e.value)}
              />
            </div>
          </div>

          {/* Theme */}
          <div>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Theme
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="pi pi-moon" style={{ marginRight: '10px', fontSize: '18px' }}></i>
                <span style={{ fontSize: '14px' }}>Dark Mode</span>
              </div>
              <InputSwitch
                checked={formData.darkMode}
                onChange={(e) => handleSwitchChange('darkMode', e.value)}
              />
            </div>
          </div>

          {/* Account Visibility */}
          <div>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Account Visibility
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="pi pi-eye" style={{ marginRight: '10px', fontSize: '18px' }}></i>
                <span style={{ fontSize: '14px' }}>On</span>
              </div>
              <InputSwitch
                checked={formData.accountVisible}
                onChange={(e) => handleSwitchChange('accountVisible', e.value)}
              />
            </div>
          </div>

          {/* Delete Account */}
          <div style={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
            <Button
              label="Delete Account"
              icon="pi pi-trash"
              className="p-button-danger p-button-outlined"
              onClick={handleDeleteAccount}
              style={{ 
                width: isMobile ? '100%' : 'auto',
                marginTop: '10px'
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: isMobile ? 'space-between' : 'flex-start',
          marginTop: '30px',
          gap: '15px'
        }}>
          <Button
            label="Cancel"
            className="p-button-secondary"
            onClick={handleCancel}
            style={{ 
              width: isMobile ? '48%' : 'auto'
            }}
          />
          <Button
            label="Save Changes"
            onClick={handleSave}
            style={{ 
              width: isMobile ? '48%' : 'auto',
              backgroundColor: '#0387D9',
              border: 'none'
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Settings; 