
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from 'primereact/skeleton';
import { OverlayPanel } from 'primereact/overlaypanel';
import { type } from '@testing-library/user-event/dist/type';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';

const AddCompliance = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocument, setFilteredDocument] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  // State for filters
  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [date, setDate] = useState(null);
  const [selectedFlug, setSelectedFlug] = useState(null);
  const [selectedVesselType, setVesselType] = useState(null);
  const [selectedVesselStatus, setVesselStatus] = useState(null);
  const [selectedEngineType, setSelectedEngineType] = useState(null);
  const [selectedInspection, setSelectedInspection] = useState(null);
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

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedDocument = [
        { id: 1, name: "Sea Dreamer", type: "Flag State",  issuingAuthority: "USCG", outcome:"Passed", date: "20/10/2024", nextDate: "30/10/2024", status: "InCompliance" },
        { id: 2, name: "Serenity", type: "ISM Code Audit", issuingAuthority: "MCA", outcome:"Passed with Obs..", date: "20/10/2024", nextDate: "30/10/2024", status: "CompliancePending" },
        { id: 3, name: "Odyssey", type: "PSC", issuingAuthority: "Port State Control Officer", outcome:"Failed", date: "20/10/2024", nextDate: "30/10/2024", status: "InCompliance" },
        { id: 4, name: "Harmony", type: "Compliance", issuingAuthority: "MCA", outcome:"Passed with Obs..", date: "20/10/2024", nextDate: "30/10/2024", status: "NonCompliance" },
       
      ];
      setDocuments(fetchedDocument);
      setFilteredDocument(fetchedDocument); // Initially, all vessels are displayed
      setLoading(false);
    }, 500);
  }, []);

  // Handle filter logic
  const applyFilters = useCallback(() => {
    let filteredData = documents;

    if (selectedAuthority) {
      filteredData = filteredData.filter((vessel) => vessel.type === selectedAuthority);
    }
    if (selectedDocumentType) {
      filteredData = filteredData.filter((vessel) => vessel.yearbuilt === selectedDocumentType);
    }
    if (selectedStatus) {
      filteredData = filteredData.filter((vessel) => vessel.status === selectedStatus);
    }

    setFilteredDocument(filteredData);
  }, [documents, selectedAuthority, selectedDocumentType, selectedStatus]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Dropdown options
  const issueAuthorities = [
    ...new Set(documents.map((document) => document.issuingAuthority)),
  ].map((issueAuthority) => ({ name: issueAuthority, value: issueAuthority }));

  const types = [
    ...new Set(documents.map((vessel) => vessel.type)),
  ].map((type) => ({ name: type, value: type }));

  const statuses = [
    ...new Set(documents.map((vessel) => vessel.status)),
  ].map((status) => ({ name: status, value: status }));

  const goToAddCompliancePage = () => {
    navigate("/compliance-management/compliance/new");
  };

  const statusStyles = {
    InCompliance: {
      backgroundColor: "#94E0ED",
      color: "#047F94",
    },
    CompliancePending : {
      backgroundColor: "#F59E0B",
      color: "#FFFFFF",
    },
    NonCompliance: {
      backgroundColor: "#3B82F6",
      color: "#FFFFFF",
    },
   
    Default: {
      backgroundColor: "#F0F0F0",
      color: "#000000",
    },
  };

  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-rounded p-button-text"
        onClick={(e) => menuRef.current.toggle(e)}
      />
      <OverlayPanel ref={menuRef} dismissable className="datatable-overlaypanel">
        <Button
          label="Edit"
          icon="pi pi-pencil"
          className="p-button-text w-full"
          onClick={() => console.log('Edit', rowData)}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-text w-full"
          onClick={() => console.log('Delete', rowData)}
        />
      </OverlayPanel>
    </>
  );

  const skeletonTemplate = () => (
    <>
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="10%" />
    </>
  );

  return (
    <main className="flex h-screen page">
      <LeftMenu />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Documents</h3>
            <p>list of all documents</p>
          </div>
          <div className="sub-header-right flex align-items-center">
          <div className="flex align-items-center relative">
      <i className="pi pi-search absolute left-0 ml-2 text-gray-500"></i>
      <InputText 
        placeholder="Search" 
        className="pl-4 mr-3"
      />
    </div>
            <Dropdown
              value={selectedAuthority}
              options={issueAuthorities}
              onChange={(e) => setSelectedAuthority(e.value)}
              optionLabel="name"
              placeholder="Issuing Authority"
              className="mr-3 "
            />
            <Dropdown
              value={type}
              options={types}
              onChange={(e) => setSelectedDocumentType(e.value)}
              optionLabel="name"
              placeholder="Document type"
              className="mr-3"
            />
            <Dropdown
              value={selectedStatus}
              options={statuses}
              onChange={(e) => setSelectedStatus(e.value)}
              optionLabel="name"
              placeholder="Status"
              className="mr-3"
            />
            <Button
              label="Add Compliance"
              icon="pi pi-plus"
              onClick={goToAddCompliancePage}
              className="p-button-primary"
            />
          </div>
        </div>
        <div className="card-wrapper-gap">
        <div className="form-container">
                <TabView>
                  <TabPanel header="Inspection Details & Outcome">
                    <div className="form-container">
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
                    <div className="form-container">
                      <h5 className="mt-4">Inspection Outcome</h5>
                      <form>
                        <div className="grid">
                          <div className="col-12">
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
                          <div className="col-12">
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

                          <div className="col-6">
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

                          <div className="col-6">
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
                          <div className="col-12">
                            <div className="flex align-content-center mt-2 action-toggle">
                              <p className="mr-5 font-medium action-label">Action Required</p>
                              <InputSwitch checked={action} onChange={(e) => setAction(e.value)} />
                            </div>
                          </div>
                          <div className="col-12">
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


                          <div className="col-6">
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

                          <div className="col-6">
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
                          <div className="col-6">
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

                          <div className="col-6">
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

                          <div className="col-6">
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
                          <div className="col-6">
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

                          <div className="col-6">
                            <label htmlFor="verificationOfficerName">Verification Officer Name (Optional)</label>
                            <InputText
                              id="verificationOfficerName"
                              placeholder="Enter Officer’s Name"
                              className="w-full mt-2 p-inputtext p-component"
                            />
                          </div>
                          <div className="col-6">
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
                          <div className="col-6">
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
                      
                          <div className="col-6">
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
        </div>
      </div>
    </main>
  );
};

export default AddCompliance;
