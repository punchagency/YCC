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


const EditMaintenance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
const [crew,setCrews] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [priority,setPriority] = useState(null);
  const [status,setStatus] = useState(null);
const [additionalNotes,setAdditionalNotes] = useState(null);
  const [frequency,setFrequency] = useState(null);

 
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



  const priorities = [
    { name: "High" },
    { name: "Low" }
  ];

  const statuses = [
    { name: "Active" },
    { name: "Inactive" }
  ];

  const frequencies = [
    { name: "Weekly" },
    { name: "Monthly" }
  ];

  
  const crews = [
    { name: "Flag State Authority" },
    { name: "Flag State Authority 2" }
  ];

  return (
    <main className="flex h-screen page">
      <LeftMenu role="Captain/Manager" />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="arrow">
              <Link to="/maintenance-scheduling/maintenance">
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
            onClick={goVasselPage}
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

            <h5>Add New Task</h5>
            <form>
              <div className="grid">
                
              <div className="col-12">
                  <label htmlFor="task">Task Title</label>
                  <InputText
                    id="task"
                    placeholder="Enter Task Title"
                    className="w-full mt-2 p-inputtext p-component"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="vesselName">Vessel Name</label>
                  <InputText
                    id="vesselName"
                    placeholder="Enter Vessel Name"
                    className="w-full mt-2 p-inputtext p-component"
                  />
                </div>

                <div className="col-6">
                  <label htmlFor="equipmentName">Equipment Name</label>
                  <InputText
                    id="equipmentName"
                    placeholder="Enter Equipment Name"
                    className="w-full mt-2 p-inputtext p-component"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="crew">Assigned Crew </label>
                  <Dropdown
                    id="crew"
                    value={crew}
                    onChange={(e) => setCrews(e.value)}
                    options={crews}
                    optionLabel="name"
                    placeholder={crews.length > 0 ? crews[0].name : "Select"}
                    className="w-full mt-2"
                  />
                </div>
                <div className="col-6">
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
                <div className="col-6">
                  <label htmlFor="priority">Priority Level </label>
                  <Dropdown
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.value)}
                    options={priorities}
                    optionLabel="name"
                    placeholder="Choose priority"
                    className="w-full mt-2"
                  />
                </div>

                <div className="col-6">
                  <label htmlFor="status">Status</label>
                  <Dropdown
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.value)}
                    options={statuses}
                    optionLabel="name"
                    placeholder="Enter Status"
                    className="w-full mt-2"
                  />
                </div>

                <div className="col-6">
                  <label htmlFor="frequency">Maintenance Frequency</label>
                  <Dropdown
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.value)}
                    options={frequencies}
                    optionLabel="name"
                    placeholder={frequencies.length > 0 ? frequencies[0].name : "Select"}
                    className="w-full mt-2"
                  />
                </div>

                <div className="col-6">
                            <label htmlFor="uploadDocuments">Upload Supporting Documents</label>
                            <div className="flex align-content-center gap-4 mt-3">
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
                          <div className="col-12">
                            <label htmlFor="additionalNotes" className="font-medium">Additional Notes</label>
                            <InputTextarea
                              id="additionalNotes"
                              value={additionalNotes}
                              onChange={(e) => setAdditionalNotes(e.target.value)}
                              rows={5}
                              cols={10}
                              className="w-full mt-2"
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

export default EditMaintenance;
