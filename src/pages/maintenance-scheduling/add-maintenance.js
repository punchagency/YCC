import React, { useState } from "react";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";
import { FileUpload } from "primereact/fileupload";


const AddMaintenance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [selectedFlug, setSelectedFlug] = useState(null);
  const [selectedVesselType, setVesselType] = useState(null);
  const [selectedVesselStatus, setVesselStatus] = useState(null);
  const [selectedEngineType, setSelectedEngineType] = useState(null);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [report, setReport] = useState(null);
  const [category, setCategory] = useState(null);
  const [deficiency, setDeficiency] = useState(null);
  const [action, setAction] = useState(true);
  const [actionDescription, setActionDescription] = useState(null);
  const [description, setDescription] = useState(null);
  const [department, setDepartment] = useState(null);
  const [targetCompletionDate, setTargetCompletionDate] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [inspectionDate, setInspectionDate] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledType, setScheduledType] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [taskDescription, setTaskDescription] = useState(null);
  const [taskCategory, setTaskCategory] = useState(null);
  const [maintenanceDate, setMaintenanceDate] = useState(null);
  const [serviceType, setServiceType] = useState(null);
  const [workDescription, setWorkDescription] = useState(null);
  const [replacementDate, setReplacementDate] = useState(null);
  const [financeCategory, setFinanceCategory] = useState(null);
  const [revenueSource, setRevenueSource] = useState(null);
  const currentDate = new Date().toLocaleDateString("en-US");

  const goVasselPage = () => {
    console.log("Navigating to /user-management/users");
    navigate("/user-management/users");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handlePhoneChange = (e) => {
    setPhone(e.value);
  }
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newUploadedFiles = files.map((file) => ({
      name: file.name,
      type: file.type || '',
      url: URL.createObjectURL(file), // Create a temporary URL for images
    }));

    // Update state with selected files
    setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);
  };

  // Remove a file from the uploaded list
  const removeFile = (fileName) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const nationalities = [
    { name: "American", code: "US" },
    { name: "Indian", code: "IN" },
    { name: "British", code: "UK" },
    { name: "Australian", code: "AU" },
  ];

  const vessel = [
    { name: "Motor Yacht" },
    { name: "Sailboat Yacht" }
  ];

  const status = [
    { name: "Active" },
    { name: "Inactive" }
  ];

  const engine = [
    { name: "Gas Turbine" },
    { name: "Oil Turbine" }
  ];

  const inspection = [
    { name: "Flag State Inspection 1" },
    { name: "Flag State Inspection 2" }
  ];

  const authority = [
    { name: "USCG" },
    { name: "USCB" }
  ];

  const outcomes = [
    { name: "demo1" },
    { name: "demo2" }
  ];

  const categories = [
    { name: "Environmental" },
    { name: "demo2" }
  ];
  const deficiencies = [
    { name: "demo1" },
    { name: "demo2" }
  ];

  const departments = [
    { name: "Chief Engineer" },
    { name: "Junior Chief Engineer" }
  ];

  const actionStatuses = [
    { name: "Not Started" },
    { name: "Started" }
  ];

  const complianceStatuses = [
    { name: "Yes" },
    { name: "No" }
  ];

  const scheduledTypes = [
    { name: "Port State Control (PSC) Inspection" },
    { name: "Inspection" }
  ];

  const taskCategories = [
    { name: "Engine & Propulsion Systems" },
    { name: "Engine & Propulsion" }
  ];

  const serviceTypes = [
    { name: "Internal (Crew)" },
    { name: "External (Crew)" }
  ];

  const financeCategories = [
    { name: "Maintenance" },
    { name: "Maintenance 2" }
  ];
  const revenueSources = [
    { name: "Charter" },
    { name: "Charter 2" }
  ];

  return (
    <main className="flex h-screen page">
      <LeftMenu />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="arrow">
              <Link to="/vessel-management/vessels">
                <i className="pi pi-angle-left"></i>
              </Link>
            </div>
            <div className="content">
              <h3>Add New Task</h3>
              <p>Enter the user detail and create an user</p>
            </div>
          </div>
          <div className="sub-header-right">
            <Button
              label="Cancel"
              icon="pi pi-times-circle"
              severity="secondary"
              outlined
              className="p-button-secondary mr-3"
            />
            <Button
              onClick={goVasselPage}
              label="Save"
              icon="pi pi-save"
              className="p-button-primary"
              type="button"
            />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <div className="form-container border-round-sm" style={{ backgroundColor: '#FFFFFF', padding: "28px" }}>

            <h5>Inspection Details</h5>
            <form>
              <div className="grid">
                <div className="col-6">
                  <label htmlFor="inspection">Inspection Details</label>
                  <Dropdown
                    id="inspection"
                    value={selectedInspection}
                    onChange={(e) => setSelectedInspection(e.value)}
                    options={inspection}
                    optionLabel="name"
                    placeholder="Select a Flag State Inspection"
                    className="w-full mt-2"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="flagState">Inspection Date</label>
                  <Calendar
                    id="dob"
                    value={date}
                    onChange={(e) => setDate(e.value)}
                    showIcon
                    placeholder="Date of birth"
                    className="w-full mt-2 p-input-calender"
                  />
                </div>

                <div className="col-6">
                  <label htmlFor="authority">Issuing Authority</label>
                  <Dropdown
                    id="authority"
                    value={selectedAuthority}
                    onChange={(e) => setSelectedAuthority(e.value)}
                    options={authority}
                    optionLabel="name"
                    placeholder="Select a Issuing Authority"
                    className="w-full mt-2"
                  />
                </div>

                <div className="col-6">
                  <label htmlFor="inspectorName">Inspector’s Name</label>
                  <InputText
                    id="inspectorName"
                    placeholder="Enter Inspector’s Name"
                    className="w-full mt-2 p-inputtext p-component"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="inspectorEmail">Email address</label>
                  <InputText
                    id="inspectorEmail"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full mt-2"
                    placeholder="Inspector’s email"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="inspectorPhone">Phone no</label>
                  <InputText
                    id="inspectorPhone"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full mt-2"
                    placeholder="Inspector’s Ph no"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="organizationName">Affiliated Organization</label>
                  <InputText
                    id="organizationName"
                    placeholder="Affiliated Organization name"
                    className="w-full mt-2 p-inputtext p-component"
                  />
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </main>
  );
};

export default AddMaintenance;
