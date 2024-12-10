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


const Addequipment = () => {
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
const [category,setCategory] = useState(null);
 const [manufacturer,setManufacturer] = useState(null);
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

const categories =[
  { name: "Engine" },
  { name: "Engine 1" }
];

const manufacturers =[
  { name: "Caterpillar" },
  { name: "Caterpillar 1" }
]


  const priorities = [
    { name: "High" },
    { name: "Low" }
  ];

  const statuses = [
    { name: "In Use" },
    { name: "Not Use" }
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
      <LeftMenu />
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
              <h3>Add New Equipment</h3>
              <p>All all details here</p>
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

            <h5>Add New Equipment/Part</h5>
            <form>
              <div className="grid">
                
              <div className="col-12">
                  <label htmlFor="equipmentName">Equipment/Part Name</label>
                  <InputText
                    id="equipmentName"
                    placeholder="Main Engine"
                    className="w-full mt-2 p-inputtext p-component"
                  />
                </div>
            
               
                <div className="col-6">
                  <label htmlFor="category">Category </label>
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
                  <label htmlFor="manufacturer">Manufaturer </label>
                  <Dropdown
                    id="manufacturer"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.value)}
                    options={manufacturers}
                    optionLabel="name"
                    placeholder={manufacturers.length > 0 ? manufacturers[0].name : "Select"}
                    className="w-full mt-2"
                  />
                </div>

                <div className="col-6">
                  <label htmlFor="modelNo">Model Number</label>
                  <InputText
                    id="modelNo"
                    placeholder="3516E"
                    className="w-full mt-2 p-inputtext p-component"
                  />
                </div>


                <div className="col-6">
                  <label htmlFor="serialNo">Serial Number</label>
                  <InputText
                    id="serialNo"
                    placeholder="12345-CAT"
                    className="w-full mt-2 p-inputtext p-component"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="date">Last Service Date</label>
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
                  <label htmlFor="status">Status</label>
                  <Dropdown
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.value)}
                    options={statuses}
                    optionLabel="name"
                    placeholder={statuses.length > 0 ? statuses[0].name : "Select"}
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

export default Addequipment;
