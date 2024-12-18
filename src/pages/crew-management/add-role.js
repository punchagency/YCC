import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
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
const navigate = useNavigate();
  const goRolePage = ()=>{
    navigate('/crew-management/role');
  }

  return (
    <>
        <div className="flex align-items-center justify-content-between sub-header-panel">
          {/* Left Section: Heading and Subheading */}
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="arrow">
              <Link to="/crew-management/role">
                <i className="pi pi-angle-left"></i>
              </Link>
            </div>
            <div className="content">
              <h3>Roles</h3>
              <p>Lists of different roles with accessibility</p>
            </div>
          </div>

          {/* Right Section: Action Button */}
          <div className="sub-header-right">
            <Button
            onClick={goRolePage}
              label="Save"
              icon="pi pi-save"
              className="p-button-primary"
            />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <div className="card">
            <div className="card-wraper">
              <h4 className="m-0 mb-3">Role Information</h4>
              <div className="field mb-3">
                <label htmlFor="roleTitle">
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
                <label>Permissions</label>
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
