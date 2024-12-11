import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';


const AddWarranty = () => {

    const [warranty, setWarranty] = useState(null);
    const [date, setDate] = useState(null);
    const [day, setDay] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const currentDate = new Date().toLocaleDateString("en-US");

    const navigate = useNavigate();


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

    const warranties = [
        { name: "Warranty" },
        { name: "Warranty 2" }
    ];

    const days = [
        { name: "Days" },
        { name: "Months" }
    ]

    const goEquipmentPage = () => {

        navigate("/maintenance-scheduling/warranty");
    };



    return (
        <main className="flex h-screen page">
            <LeftMenu />
            <div className="w-full right-panel-component">
                <AdminHeader />
                <div className="flex align-items-center justify-content-between sub-header-panel">
                    <div className="sub-header-left sub-header-left-with-arrow">
                        <div className="arrow">
                            <Link to="/maintenance-scheduling/warranty">
                                <i className="pi pi-angle-left"></i>
                            </Link>
                        </div>
                        <div className="content">
                            <h3>Add New Warranty</h3>
                            <p>All all details here</p>
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
                            onClick={goEquipmentPage}
                            label="Save"
                            icon="pi pi-save"
                            className="p-button-primary mr-3"
                            type="button"
                        />
                        <Button
                            onClick={goEquipmentPage}
                            label="Save & Add Another"
                            icon="pi pi-save"
                            className="p-button-primary mr-3"
                            type="button"
                        />
                    </div>
                </div>
                <div className='card-wrapper-gap'>
                    <div className="card">
                        <div className="card-wraper">
                            <div className="form-container">
                                <h5>Add Warranty</h5>
                                <form>
                                    <div className="grid">
                                        <div className="col-6">
                                            <label htmlFor="equipmentName">Equipment/Part Name</label>
                                            <InputText
                                                id="equipmentName"
                                                placeholder="Alternator"
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
                                            <label htmlFor="warranty">Warranty Status</label>
                                            <Dropdown
                                                id="warranty"
                                                value={warranty}
                                                onChange={(e) => setWarranty(e.value)}
                                                options={warranties}
                                                optionLabel="name"
                                                placeholder={warranties.length > 0 ? warranties[0].name : "Select"}
                                                className="w-full mt-2"
                                            />
                                        </div>
                                        <div className="col-6">
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
                                        <div className="col-6">
                                            <label htmlFor="warrantyCoverage">Warranty Coverage</label>
                                            <InputText
                                                id="warrantyCoverage"
                                                placeholder="Parts"
                                                className="w-full mt-2 p-inputtext p-component"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="manufacturer">Manufacturer</label>
                                            <InputText
                                                id="manufacturer"
                                                placeholder="Viking"
                                                className="w-full mt-2 p-inputtext p-component"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="supplierName">Supplier name</label>
                                            <InputText
                                                id="supplierName"
                                                placeholder="Robert"
                                                className="w-full mt-2 p-inputtext p-component"
                                            />
                                        </div>

                                        <div className="col-6">
                                            <label htmlFor="supplierNo">Supplier phone no</label>
                                            <InputText
                                                id="supplierNo"
                                                placeholder="+01 6789 7890"
                                                className="w-full mt-2 p-inputtext p-component"
                                            />
                                        </div>

                                        <div className="col-6">
                                            <label htmlFor="warrantyTime">Warranty expiration Soon Threshold ( Reminder)</label>
                                            <InputText
                                                id="warrantyTime"
                                                placeholder="2"
                                                className="w-full mt-2 p-inputtext p-component"
                                            />
                                        </div>



                                        <div className="col-6 mt-3">

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
                                        <div className="upload-container">
  <div className="flex align-items-center justify-content-center mt-3">
    <label htmlFor="file-upload" className="custom-upload-button">
      <i className="pi pi-upload mr-2"></i> Upload Warranty Document
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
  <p className="mt-4 font-semibold text-lg text-center">Select Files to Upload</p>
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
            <img src={file.url} alt={file.name} className="file-icon" />
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
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AddWarranty;
