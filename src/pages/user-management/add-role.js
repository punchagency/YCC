import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
const AddRole = () => {
  const [roleTitle, setRoleTitle] = useState("");
  const [permissions, setPermissions] = useState([]);

  const permissionList = [
    "Oversee compliance",
    "Certifications for the vessel and crew",
    "Manage maintenance schedules",
    "Logs, and reports",
    "Supervise overall operations",
    "Accountability for inspections and audits",
    "Assign tasks to departments",
    "Ensure completion",
  ];

  const togglePermission = (permission) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((p) => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  return (
    <>
        <div className="flex align-items-center justify-content-between sub-header-panel">
          {/* Left Section: Heading and Subheading */}
          <div className="sub-header-left">
            <h3>Roles</h3>
            <p>Lists of different roles with accessibility </p>
          </div>

          {/* Right Section: Action Button */}
          <div className="sub-header-right">
            <Button
              label="Save"
              icon="pi pi-save"
              className="p-button-primary"
            />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <div className="card">
            <div className="card-wraper">
              <h4 className="mb-3">Role Information</h4>
              <div className="field mb-3">
                <label htmlFor="roleTitle" className="block font-medium mb-1">
                  Role Title
                </label>
                <InputText
                  id="roleTitle"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="Enter Role name"
                  className="w-full"
                />
              </div>
              <div className="field">
                <label className="block font-medium mb-2">Permissions</label>
                {permissionList.map((permission, index) => (
                  <div key={index} className="field-checkbox">
                    <Checkbox
                      inputId={`permission${index}`}
                      value={permission}
                      checked={permissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                    />
                    <label htmlFor={`permission${index}`} className="ml-2">
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default AddRole;
