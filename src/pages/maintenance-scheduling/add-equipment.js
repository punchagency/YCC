import React, { useState } from "react";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

const Addequipment = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [crew, setCrews] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [status, setStatus] = useState(null);
  const [category, setCategory] = useState(null);
  const [manufacturer, setManufacturer] = useState(null);
  const currentDate = new Date().toLocaleDateString("en-US");
  const [warranty, setWarranty] = useState(null);
  const [day, setDay] = useState(null);

  const goEquipmentPage = () => {
    navigate("/maintenance-scheduling/equipment");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.value);
  };
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newUploadedFiles = files.map((file) => ({
      name: file.name,
      type: file.type || "",
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

  const categories = [{ name: "Engine" }, { name: "Engine 1" }];

  const manufacturers = [{ name: "Caterpillar" }, { name: "Caterpillar 1" }];

  const statuses = [{ name: "In Use" }, { name: "Not Use" }];

  const days = [{ name: "Days" }, { name: "Months" }];

  const warranties = [{ name: "Warranty" }, { name: "Warranty 2" }];

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="arrow">
            <Link to="/maintenance-scheduling/equipment">
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
            onClick={goEquipmentPage}
            label="Cancel"
            icon="pi pi-times-circle"
            severity="secondary"
            outlined
            className="p-button-secondary mr-3"
          />
          <Button
            onClick={goEquipmentPage}
            label="Save"
            icon="pi pi-save"
            className="p-button-primary"
            type="button"
          />
        </div>
      </div>
      <div className="card-wrapper-gap">
        <div
          className="form-container border-round-sm"
          style={{ backgroundColor: "#FFFFFF", padding: "28px" }}
        >
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

              <div className="col-12 md:col-6">
                <label htmlFor="category">Category </label>
                <Dropdown
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.value)}
                  options={categories}
                  optionLabel="name"
                  placeholder={
                    categories.length > 0 ? categories[0].name : "Select"
                  }
                  className="w-full mt-2"
                />
              </div>

              <div className="col-12 md:col-6">
                <label htmlFor="manufacturer">Manufaturer </label>
                <Dropdown
                  id="manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.value)}
                  options={manufacturers}
                  optionLabel="name"
                  placeholder={
                    manufacturers.length > 0 ? manufacturers[0].name : "Select"
                  }
                  className="w-full mt-2"
                />
              </div>

              <div className="col-12 md:col-6">
                <label htmlFor="modelNo">Model Number</label>
                <InputText
                  id="modelNo"
                  placeholder="3516E"
                  className="w-full mt-2 p-inputtext p-component"
                />
              </div>

              <div className="col-12 md:col-6">
                <label htmlFor="serialNo">Serial Number</label>
                <InputText
                  id="serialNo"
                  placeholder="12345-CAT"
                  className="w-full mt-2 p-inputtext p-component"
                />
              </div>
              <div className="col-12 md:col-6">
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

              <div className="col-12 md:col-6">
                <label htmlFor="status">Status</label>
                <Dropdown
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.value)}
                  options={statuses}
                  optionLabel="name"
                  placeholder={
                    statuses.length > 0 ? statuses[0].name : "Select"
                  }
                  className="w-full mt-2"
                />
              </div>
              <div className="col-12 md:col-6">
                <label htmlFor="warranty">Warranty Status</label>
                <Dropdown
                  id="warranty"
                  value={warranty}
                  onChange={(e) => setWarranty(e.value)}
                  options={warranties}
                  optionLabel="name"
                  placeholder={
                    warranties.length > 0 ? warranties[0].name : "Select"
                  }
                  className="w-full mt-2"
                />
              </div>
              <div className="col-12 md:col-6">
                <label htmlFor="date">Warranty Expiration Date</label>
                <Calendar
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.value)}
                  showIcon
                  placeholder={currentDate}
                  className="w-full mt-2 p-input-calender"
                />
              </div>
              <div className="col-12 md:col-6">
                <label htmlFor="warrantyCoverage">Warranty Coverage</label>
                <InputText
                  id="warrantyCoverage"
                  placeholder="Parts"
                  className="w-full mt-2 p-inputtext p-component"
                />
              </div>
              <div className="col-12 md:col-6">
                <label htmlFor="supplierName">Supplier name</label>
                <InputText
                  id="supplierName"
                  placeholder="Robert"
                  className="w-full mt-2 p-inputtext p-component"
                />
              </div>

              <div className="col-12 md:col-6">
                <label htmlFor="supplierNo">Supplier phone no</label>
                <InputText
                  id="supplierNo"
                  placeholder="+01 6789 7890"
                  className="w-full mt-2 p-inputtext p-component"
                />
              </div>

              <div className="col-12 md:col-6">
                <label htmlFor="warrantyTime">
                  Warranty expiration Soon Threshold ( Reminder)
                </label>
                <div className="grid">
                  <div className="col-6">
                    <InputText
                      id="warrantyTime"
                      placeholder="2"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>
                  <div className="col-6">
                    <Dropdown
                      id="day"
                      value={day}
                      onChange={(e) => setDay(e.value)}
                      options={days}
                      optionLabel="name"
                      placeholder={days.length > 0 ? days[0].name : "Select"}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              </div>
              <div className="upload-container">
                <div className="flex align-items-center justify-content-center mt-3">
                  <label htmlFor="file-upload" className="custom-upload-button">
                    <i className="pi pi-upload mr-2"></i> Upload Warranty
                    Document
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
                <p className="mt-4 font-semibold text-lg text-center">
                  Select Files to Upload
                </p>
                <p className="text-sm text-gray-500 text-center">
                  or Drag and Drop, Copy and Paste Files
                </p>
                <div className="flex flex-wrap gap-3 mt-4 justify-content-center">
                  {uploadedFiles.map((file, index) => {
                    const isImage =
                      file.type.includes("image") ||
                      file.name.toLowerCase().endsWith(".jpg") ||
                      file.name.toLowerCase().endsWith(".jpeg") ||
                      file.name.toLowerCase().endsWith(".png") ||
                      file.name.toLowerCase().endsWith(".gif");

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
                        <span
                          className="uploadfiles"
                          onClick={() => removeFile(file.name)}
                        >
                          <i className="pi pi-times"></i>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Addequipment;
