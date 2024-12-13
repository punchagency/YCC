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


const AddVassel = () => {
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
  const [scheduledDate,setScheduledDate] = useState(null);
  const [scheduledType,setScheduledType] = useState(null);
  const [reminder,setReminder] = useState(null);
  const [taskDescription,setTaskDescription] = useState(null);
  const [taskCategory,setTaskCategory] = useState(null);
  const [maintenanceDate,setMaintenanceDate] = useState(null);
  const [serviceType,setServiceType] = useState(null);
  const [workDescription,setWorkDescription] = useState(null);
  const [replacementDate,setReplacementDate] = useState(null);
  const [financeCategory,setFinanceCategory] = useState(null);
  const [revenueSource,setRevenueSource] = useState(null);
  const currentDate = new Date().toLocaleDateString("en-US");

  const goVasselPage = () => {
    // console.log("Navigating to /user-management/users");
    navigate("/vessel-management/vessels");
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
    <>
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="arrow">
              <Link to="/vessel-management/vessels">
                <i className="pi pi-angle-left"></i>
              </Link>
            </div>
            <div className="content">
              <h3>Add New Vessel</h3>
              <p>Enter the user detail and create an user</p>
            </div>
          </div>
          <div className="sub-header-right">
            <Button
              label="Cancel"
              onClick={goVasselPage}
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
          <TabView className="v-tab v-tab-two">
            <TabPanel header="General information">
              <div className="form-container">
                <TabView>
                  <TabPanel header="Basic Details">
                    <div className="form-container">
                      <h5>Basic Details</h5>
                      <form>
                        <div className="grid">
                          <div className="col-12 md:col-6">
                            <label htmlFor="dreamer">Vessel Name</label>
                            <InputText
                              id="dreamer"
                              placeholder="Sea Dreamer"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="flagState">Flag State</label>
                            <Dropdown
                              id="flagState"
                              value={selectedFlug}
                              onChange={(e) => setSelectedFlug(e.value)}
                              options={nationalities}
                              optionLabel="name"
                              placeholder="Select a nationality"
                              className="w-full mt-2"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="registration">Registration Number</label>
                            <InputText
                              id="registration"
                              placeholder="Enter Registration Number"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="vesselType">Vessel Type</label>
                            <Dropdown
                              id="vesselType"
                              value={selectedVesselType}
                              onChange={(e) => setVesselType(e.value)}
                              options={vessel}
                              optionLabel="name"
                              placeholder="Select a Vessel Type"
                              className="w-full mt-2"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="yearBuilt">Year Built</label>
                            <InputText
                              id="yearBuilt"
                              placeholder="Enter Year Built"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="manufacturer">Manufacturer</label>
                            <InputText
                              id="manufacturer"
                              placeholder="Enter Manufacturer"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-12">
                            <label htmlFor="vesselStatus">Vessel Status</label>
                            <Dropdown
                              id="vesselStatus"
                              value={selectedVesselStatus}
                              onChange={(e) => setVesselStatus(e.value)}
                              options={status}
                              optionLabel="name"
                              placeholder="Select a Vessel Status"
                              className="w-full mt-2"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </TabPanel>
                  <TabPanel header="Dimensions">
                    <div className="form-container">
                      <h5>Dimensions</h5>
                      <form>
                        <div className="grid">
                          <div className="col-12 md:col-6">
                            <label htmlFor="length">Length</label>
                            <InputText
                              id="length"
                              placeholder="10 meters"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="beam">Beam</label>
                            <InputText
                              id="beam"
                              placeholder="5 meters"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="draft">Draft</label>
                            <InputText
                              id="draft"
                              placeholder="2.1 meters"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="tonnage">Gross Tonnage</label>
                            <InputText
                              id="tonnage"
                              placeholder="200 GT"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </TabPanel>
                  <TabPanel header="Engine Information & Capacity">
                    <div className="form-container">
                      <h5>Engine Information & Capacity</h5>
                      <form>
                        <div className="grid">
                          <div className="col-12 md:col-6">
                            <label htmlFor="engineType">Engine Type and Power</label>
                            <Dropdown
                              id="engineType"
                              value={selectedEngineType}
                              onChange={(e) => setSelectedEngineType(e.value)}
                              options={engine}
                              optionLabel="name"
                              placeholder="Select Engine Type and Power"
                              className="w-full mt-2"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="engines">Number of Engines</label>
                            <InputText
                              id="engines"
                              placeholder="Enter Number of Engines"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="power">Engine Power</label>
                            <InputText
                              id="power"
                              placeholder="Enter Engine Power"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </TabPanel>
                </TabView>
              </div>
            </TabPanel>
            <TabPanel header="Compliance">
              <div className="form-container">
                <TabView>
                  <TabPanel header="Inspection Details & Outcome">
                    <div className="form-container">
                      <h5>Inspection Details</h5>
                      <form>
                        <div className="grid">
                          <div className="col-12 md:col-6">
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
                          <div className="col-12 md:col-6">
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

                          <div className="col-12 md:col-6">
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

                          <div className="col-12 md:col-6">
                            <label htmlFor="inspectorName">Inspector’s Name</label>
                            <InputText
                              id="inspectorName"
                              placeholder="Enter Inspector’s Name"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="inspectorEmail">Email address</label>
                            <InputText
                              id="inspectorEmail"
                              value={email}
                              onChange={handleEmailChange}
                              className="w-full mt-2"
                              placeholder="Inspector’s email"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="inspectorPhone">Phone no</label>
                            <InputText
                              id="inspectorPhone"
                              value={phone}
                              onChange={handlePhoneChange}
                              className="w-full mt-2"
                              placeholder="Inspector’s Ph no"
                            />
                          </div>
                          <div className="col-12 md:col-6">
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
                    <div className="form-container">
                      <h5 className="mt-4">Inspection Outcome</h5>
                      <form>
                        <div className="grid">
                          <div className="col-12 md:col-6">
                            <label htmlFor="outcome">Outcome</label>
                            <Dropdown
                              id="outcome"
                              value={outcome}
                              onChange={(e) => setOutcome(e.value)}
                              options={outcomes}
                              optionLabel="name"
                              placeholder=" Passed with Deficiencies (Corrective actions required)"
                              className="w-full mt-2"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="outcome">Observation Report <span className="text-xs">( Detailed description of issues identified )</span></label>
                            <InputTextarea
                              id="outcome"
                              value={report}
                              onChange={(e) => setReport(e.target.value)}
                              rows={5}
                              cols={10}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="category">Categories</label>
                            <Dropdown
                              id="category"
                              value={category}
                              onChange={(e) => setCategory(e.value)}
                              options={categories}
                              optionLabel="name"
                              placeholder={categories.length > 0 ? categories[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="deficiency">Severity of Deficiency</label>
                            <Dropdown
                              id="deficiency"
                              value={deficiency}
                              onChange={(e) => setDeficiency(e.value)}
                              options={deficiencies}
                              optionLabel="name"
                              placeholder={categories.length > 0 ? categories[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <div className="flex align-content-center mt-2 action-toggle">
                              <p className="mr-5 font-medium action-label">Action Required</p>
                              <InputSwitch checked={action} onChange={(e) => setAction(e.value)} />
                            </div>
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="actionDescription">Action Description <span className="text-xs">( Mention in detail )</span></label>
                            <InputTextarea
                              id="actionDescription"
                              value={actionDescription}
                              onChange={(e) => setActionDescription(e.target.value)}
                              rows={5}
                              cols={10}
                              className="w-full mt-2"
                            />
                          </div>

                        </div>
                      </form>
                    </div>
                  </TabPanel>
                  <TabPanel header="Corrective Action Plan">
                    <div className="form-container">
                      <h5>Corrective Action Plan</h5>
                      <form>
                        <div className="grid">
                          <div className="col-12">
                            <label htmlFor="description">Description</label>
                            <InputTextarea
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={5}
                              cols={10}
                              className="w-full mt-2"
                            />
                          </div>


                          <div className="col-12 md:col-6">
                            <label htmlFor="department">Responsible Person/Department</label>
                            <Dropdown
                              id="department"
                              value={department}
                              onChange={(e) => setDepartment(e.value)}
                              options={departments}
                              optionLabel="name"
                              placeholder={departments.length > 0 ? departments[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="flagState">Target Completion Date</label>
                            <Calendar
                              id="targetdate"
                              value={targetCompletionDate}
                              onChange={(e) => setTargetCompletionDate(e.value)}
                              showIcon
                              placeholder={currentDate}
                              className="w-full mt-2 p-input-calender"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="actionStatus">Status</label>
                            <Dropdown
                              id="actionStatus"
                              value={actionStatus}
                              onChange={(e) => setActionStatus(e.value)}
                              options={actionStatuses}
                              optionLabel="name"
                              placeholder={actionStatuses.length > 0 ? actionStatuses[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="inspectionDate">Follow-Up Inspection Date ( Optional )</label>
                            <Calendar
                              id="inspectionDate"
                              value={inspectionDate}
                              onChange={(e) => setInspectionDate(e.value)}
                              showIcon
                              placeholder={currentDate}
                              className="w-full mt-2 p-input-calender"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="uploadDocuments">Upload Supporting Documents</label>
                            <div className="flex align-content-center mt-3">
                              <div className="flex flex-wrap gap-1">
                                {uploadedFiles.map((file, index) => {
                                  const isImage = file.type.includes('image') || file.name.toLowerCase().endsWith(('.jpg', '.jpeg', '.png', '.gif'));

                                  return (
                                    <div key={index} className="file-item">
                                      {isImage ? (
                                        <img
                                          src={file.url}
                                          alt={file.name}
                                          className="file-icon"
                                        />
                                      ) : (
                                        <i className="pi pi-file-pdf file-icon"></i>

                                      )}
                                      <span className="uploadfiles" onClick={() => removeFile(file.name)}>
                                        <i className="pi pi-times"></i>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <label htmlFor="file-upload" className="custom-upload-button">
                                <i className="pi pi-upload mr-2"></i>Upload
                              </label>
                              <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.gif"
                                className="file-upload-input"
                                onChange={handleFileSelect}
                              />
                            </div>
                          </div>


                        </div>
                      </form>
                    </div>
                  </TabPanel>
                  <TabPanel header="Compliance Verification">
                    <div className="form-container">
                      <h5>Compliance Verification</h5>
                      <form>
                        <div className="grid">
                          <div className="col-12 md:col-6">
                            <label htmlFor="complianceStatus">Return to Compliance</label>
                            <Dropdown
                              id="complianceStatus"
                              value={complianceStatus}
                              onChange={(e) => setComplianceStatus(e.value)}
                              options={complianceStatuses}
                              optionLabel="name"
                              placeholder={complianceStatuses.length > 0 ? complianceStatuses[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="verificationOfficerName">Verification Officer Name (Optional)</label>
                            <InputText
                              id="verificationOfficerName"
                              placeholder="Enter Officer’s Name"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="uploadDocuments">Upload Supporting Documents</label>
                            <div className="flex align-content-center mt-3">
                              <div className="flex flex-wrap gap-1">
                                {uploadedFiles.map((file, index) => {
                                  const isImage = file.type.includes('image') || file.name.toLowerCase().endsWith(('.jpg', '.jpeg', '.png', '.gif'));

                                  return (
                                    <div key={index} className="file-item">
                                      {isImage ? (
                                        <img
                                          src={file.url}
                                          alt={file.name}
                                          className="file-icon"
                                        />
                                      ) : (
                                        <i className="pi pi-file-pdf file-icon"></i>
                                      )}
                                      <span className="uploadfiles" onClick={() => removeFile(file.name)}>
                                        <i className="pi pi-times"></i>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <label htmlFor="file-upload" className="custom-upload-button">
                                <i className="pi pi-upload mr-2"></i>Upload
                              </label>
                              <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.gif"
                                className="file-upload-input"
                                onChange={handleFileSelect}
                              />
                            </div>
                          </div>



                        </div>
                      </form>
                    </div>
                  </TabPanel>
                  <TabPanel header="Next Scheduled">
                  <div className="form-container">
                      <h5 className="mt-4">Next Scheduled</h5>
                      <form>
                        <div className="grid">
                          <div className="col-12 md:col-6">
                          <label htmlFor="scheduledDate">Date</label>

                          <Calendar
                              id="scheduledDate"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.value)}
                              showIcon
                              placeholder={currentDate}
                              className="w-full mt-2 p-input-calender"
                            />
                          </div>
                      
                          <div className="col-12 md:col-6">
                            <label htmlFor="scheduledType">Type</label>
                            <Dropdown
                              id="scheduledType"
                              value={scheduledType}
                              onChange={(e) => setScheduledType(e.value)}
                              options={scheduledTypes}
                              optionLabel="name"
                              placeholder={scheduledTypes.length > 0 ? scheduledTypes[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>

                          
                          <div className="col-12">
                          <label htmlFor="reminder">Automatic Reminder</label>

                          <Calendar
                              id="reminder"
                              value={reminder}
                              onChange={(e) => setReminder(e.value)}
                              showIcon
                              placeholder={currentDate}
                              className="w-full mt-2 p-input-calender"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </TabPanel>
                </TabView>
              </div>
            </TabPanel>











            <TabPanel header="Maintenance history">
              <div className="form-container">
              <TabView>
                  <TabPanel header="Maintenance Logs">
                    <div className="form-container">
                      <h5>Maintenance Logs</h5>
                      <form>
                        <div className="grid">
                        <div className="col-12">
                            <label htmlFor="taskDescription" className="font-medium">Task Title (A brief description of the maintenance task)</label>
                            <InputTextarea
                              id="taskDescription"
                              value={taskDescription}
                              onChange={(e) => setTaskDescription(e.target.value)}
                              rows={5}
                              cols={10}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="taskCategory">Task Category</label>
                            <Dropdown
                              id="taskCategory"
                              value={taskCategory}
                              onChange={(e) => setTaskCategory(e.value)}
                              options={taskCategories}
                              optionLabel="name"
                              placeholder={taskCategories.length > 0 ? taskCategories[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="maintenanceDate">Date of Maintenance</label>
                            <Calendar
                              id="maintenanceDate"
                              value={maintenanceDate}
                              onChange={(e) => setMaintenanceDate(e.value)}
                              showIcon
                              placeholder={currentDate}
                              className="w-full mt-2 p-input-calender"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="serviceType">Service Provide Type</label>
                            <Dropdown
                              id="serviceType"
                              value={serviceType}
                              onChange={(e) => setServiceType(e.value)}
                              options={serviceTypes}
                              optionLabel="name"
                              placeholder={serviceTypes.length > 0 ? serviceTypes[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="maintenanceDate">Date of Maintenance</label>
                            <Calendar
                              id="maintenanceDate"
                              value={maintenanceDate}
                              onChange={(e) => setMaintenanceDate(e.value)}
                              showIcon
                              placeholder="Motor Yacht"
                              className="w-full mt-2 p-input-calender"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="workDescription" className="font-medium">Description of Work Done</label>
                            <InputTextarea
                              id="workDescription"
                              value={workDescription}
                              onChange={(e) => setWorkDescription(e.target.value)}
                              rows={5}
                              cols={10}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="uploadDocuments">Upload Maintenance Report</label>
                            <div className="flex align-content-center">
                              <div className="flex flex-wrap gap-1">
                                {uploadedFiles.map((file, index) => {
                                  const isImage = file.type.includes('image') || file.name.toLowerCase().endsWith(('.jpg', '.jpeg', '.png', '.gif'));

                                  return (
                                    <div key={index} className="file-item">
                                      {isImage ? (
                                        <img
                                          src={file.url}
                                          alt={file.name}
                                          className="file-icon"
                                        />
                                      ) : (
                                        <i className="pi pi-file-pdf file-icon"></i>

                                      )}
                                      <span className="uploadfiles" onClick={() => removeFile(file.name)}>
                                        <i className="pi pi-times"></i>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <label htmlFor="file-upload" className="custom-upload-button">
                                <i className="pi pi-upload mr-2"></i>Upload
                              </label>
                              <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.gif"
                                className="file-upload-input"
                                onChange={handleFileSelect}
                              />
                            </div>
                          </div>



                        </div>
                      </form>
                    </div>
                  
                  </TabPanel>
                  <TabPanel header="Corrective Action Plan">
                    <div className="form-container">
                      <h5>Spare Parts and Inventory</h5>
                      <form>
                        <div className="grid">
                        <div className="col-12 md:col-6">
                            <label htmlFor="partName">Parts Name</label>
                            <InputText
                              id="partName"
                              placeholder="Inverters & Converters"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="quantity">Quantity</label>
                            <InputText
                              id="quantity"
                              placeholder="2"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="replacementDate">Date of Replacement</label>
                            <Calendar
                              id="replacementDate"
                              value={replacementDate}
                              onChange={(e) => setReplacementDate(e.value)}
                              showIcon
                              placeholder={currentDate}
                              className="w-full mt-2 p-input-calender"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="serviceType">Service Provide Type</label>
                            <Dropdown
                              id="serviceType"
                              value={serviceType}
                              onChange={(e) => setServiceType(e.value)}
                              options={serviceTypes}
                              optionLabel="name"
                              placeholder={serviceTypes.length > 0 ? serviceTypes[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="supplierPhone">Supplier phone</label>
                            <InputText
                              id="supplierPhone"
                              placeholder="897(789067)"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-12 md:col-6">
                            <label htmlFor="uploadDocuments">Upload Supporting Documents</label>
                            <div className="flex align-content-center gap-4">
                              <div className="flex flex-wrap gap-1">
                                {uploadedFiles.map((file, index) => {
                                  const isImage = file.type.includes('image') || file.name.toLowerCase().endsWith(('.jpg', '.jpeg', '.png', '.gif'));

                                  return (
                                    <div key={index} className="file-item">
                                      {isImage ? (
                                        <img
                                          src={file.url}
                                          alt={file.name}
                                          className="file-icon"
                                        />
                                      ) : (
                                        <i className="pi pi-file-pdf file-icon"></i>

                                      )}
                                      <span className="uploadfiles" onClick={() => removeFile(file.name)}>
                                        <i className="pi pi-times"></i>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <label htmlFor="file-upload" className="custom-upload-button">
                                <i className="pi pi-upload mr-2"></i>Upload
                              </label>
                              <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.gif"
                                className="file-upload-input"
                                onChange={handleFileSelect}
                              />
                            </div>
                          </div>


                        </div>
                      </form>
                    </div>
                  </TabPanel>
                 
               
                </TabView>
              </div>
            </TabPanel>
            <TabPanel header="Financial Information">
              <div className="form-container">
              <TabView>
                  <TabPanel header="Operational Expenses">
                    <div className="form-container">
                      <h5>Operational Expenses</h5>
                      <form>
                        <div className="grid">
                      

                          <div className="col-12 md:col-6">
                            <label htmlFor="financeCategory">Category</label>
                            <Dropdown
                              id="financeCategory"
                              value={financeCategory}
                              onChange={(e) => setFinanceCategory(e.value)}
                              options={financeCategories}
                              optionLabel="name"
                              placeholder={financeCategories.length > 0 ? financeCategories[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="amount">Amount</label>
                            <InputText
                              id="amount"
                              placeholder="$400"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>

                       

                          <div className="col-12">
                            <label htmlFor="date">Date</label>
                            <Calendar
                              id="date"
                              value={date}
                              onChange={(e) => setDate(e.value)}
                              showIcon
                              placeholder={currentDate}
                              className="w-full mt-2 p-input-calender"
                            />
                          </div>

                          <div className="col-12">
                            <label htmlFor="workDescription" className="font-medium">Description <span className="text-xs">(A brief description of the maintenance task)</span></label>
                            <InputTextarea
                              id="workDescription"
                              value={workDescription}
                              onChange={(e) => setWorkDescription(e.target.value)}
                              rows={5}
                              cols={10}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="uploadDocuments">Upload Maintenance Report</label>
                            <div className="flex align-content-center">
                              <div className="flex flex-wrap gap-1">
                                {uploadedFiles.map((file, index) => {
                                  const isImage = file.type.includes('image') || file.name.toLowerCase().endsWith(('.jpg', '.jpeg', '.png', '.gif'));

                                  return (
                                    <div key={index} className="file-item">
                                      {isImage ? (
                                        <img
                                          src={file.url}
                                          alt={file.name}
                                          className="file-icon"
                                        />
                                      ) : (
                                        <i className="pi pi-file-pdf file-icon"></i>

                                      )}
                                      <span className="uploadfiles" onClick={() => removeFile(file.name)}>
                                        <i className="pi pi-times"></i>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <label htmlFor="file-upload" className="custom-upload-button">
                                <i className="pi pi-upload mr-2"></i>Upload
                              </label>
                              <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.gif"
                                className="file-upload-input"
                                onChange={handleFileSelect}
                              />
                            </div>
                          </div>



                        </div>
                      </form>
                    </div>
                  
                  </TabPanel>
                  <TabPanel header="Revenue">
                  <div className="form-container">
                      <h5>Revenue</h5>
                      <form>
                        <div className="grid">
                      

                          <div className="col-12 md:col-6">
                            <label htmlFor="revenueSource">Revenue Source</label>
                            <Dropdown
                              id="revenueSource"
                              value={revenueSource}
                              onChange={(e) => setRevenueSource(e.value)}
                              options={revenueSources}
                              optionLabel="name"
                              placeholder={revenueSources.length > 0 ? revenueSources[0].name : "Select"}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="amount">Amount</label>
                            <InputText
                              id="amount"
                              placeholder="$400"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>

                       

                          <div className="col-12">
                            <label htmlFor="date">Date</label>
                            <Calendar
                              id="date"
                              value={date}
                              onChange={(e) => setDate(e.value)}
                              showIcon
                              placeholder={currentDate}
                              className="w-full mt-2 p-input-calender"
                            />
                          </div>

                          <div className="col-12">
                            <label htmlFor="workDescription" className="font-medium">Description <span className="text-xs">(A brief description of the maintenance task)</span></label>
                            <InputTextarea
                              id="workDescription"
                              value={workDescription}
                              onChange={(e) => setWorkDescription(e.target.value)}
                              rows={5}
                              cols={10}
                              className="w-full mt-2"
                            />
                          </div>

                          <div className="col-12 md:col-6">
                            <label htmlFor="uploadDocuments">Upload Maintenance Report</label>
                            <div className="flex align-content-center">
                              <div className="flex flex-wrap gap-1">
                                {uploadedFiles.map((file, index) => {
                                  const isImage = file.type.includes('image') || file.name.toLowerCase().endsWith(('.jpg', '.jpeg', '.png', '.gif'));

                                  return (
                                    <div key={index} className="file-item">
                                      {isImage ? (
                                        <img
                                          src={file.url}
                                          alt={file.name}
                                          className="file-icon"
                                        />
                                      ) : (
                                        <i className="pi pi-file-pdf file-icon"></i>

                                      )}
                                      <span className="uploadfiles" onClick={() => removeFile(file.name)}>
                                        <i className="pi pi-times"></i>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <label htmlFor="file-upload" className="custom-upload-button">
                                <i className="pi pi-upload mr-2"></i>Upload
                              </label>
                              <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.gif"
                                className="file-upload-input"
                                onChange={handleFileSelect}
                              />
                            </div>
                          </div>



                        </div>
                      </form>
                    </div>
                  </TabPanel>
                 
               
                </TabView>
              </div>
            </TabPanel>
          </TabView>
        </div>
    </>
  );
};

export default AddVassel;
