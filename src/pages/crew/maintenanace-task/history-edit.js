import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';


const CrewHistoryEdit = () => {

    const [startDate, setstartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [report, setReport] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [time, setTime] = useState(null);
    const [status, setStatus] = useState(null);
    const currentDate = new Date().toLocaleDateString("en-US");

    const navigate = useNavigate()

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



    const statuses = [
        { name: "Active" },
        { name: "Inactive" }
    ]

    const goTaskPage = () => {
        navigate("/crew/maintenance-task/mytask");
    };




    return (
        <main className="flex h-screen page">
            {/* <LeftMenu role="Crew Member" /> */}
            <div className="w-full right-panel-component">
                {/* <AdminHeader /> */}
                <div className="flex align-items-center justify-content-between sub-header-panel">
                    <div className="sub-header-left sub-header-left-with-arrow">
                        <div className="arrow">
                            <Link to="/crew/maintenance-task/history">
                                <i className="pi pi-angle-left"></i>
                            </Link>
                        </div>
                        <div className="content">
                            <h3>Oil Change</h3>
                            <p>Assigned by Robert Fox</p>
                        </div>
                    </div>
                    <div className="sub-header-right">
                        <Button
                            onClick={goTaskPage}
                            label="Cancel"
                            icon="pi pi-times-circle"
                            severity="secondary"
                            outlined
                            className="p-button-secondary mr-3"
                        />
                        <Button
                            onClick={goTaskPage}
                            label="Save"
                            icon="pi pi-save"
                            className="p-button-primary"
                            type="button"
                        />
                    </div>
                </div>
                <div className='card-wrapper-gap'>
                    <div className="card">
                        <div className="card-wraper">
                            <div className="form-container">
                                <h5>Log Hours</h5>
                                <hr className='horizontalLine'></hr>
                                <form>
                                    <div className="grid">
                                        <div className="col-12 md:col-6">
                                            <label htmlFor="startDate">Start Date</label>
                                            <Calendar
                                                id="startDate"
                                                value={startDate}
                                                onChange={(e) => setstartDate(e.value)}
                                                showIcon
                                                placeholder={currentDate}
                                                className="w-full mt-2 p-input-calender"
                                            />
                                        </div>


                                        <div className="col-12 md:col-6">
                                            <label htmlFor="endDate">End Date</label>
                                            <Calendar
                                                id="endDate"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.value)}
                                                showIcon
                                                placeholder={currentDate}
                                                className="w-full mt-2 p-input-calender"
                                            />
                                        </div>


                                        <div className="col-12 md:col-6">
                                            <label htmlFor="endDate">Start Time</label>
                                            <Calendar
                                                id="startTime"
                                                value={time}
                                                onChange={(e) => setTime(e.value)}
                                                showTime
                                                hourFormat="12"
                                                showSeconds={false}
                                                showIcon={true} 
                                                timeOnly
                                                icon="pi pi-clock"  
                                                style={{ width: '100%' }}
                                                placeholder='09:30AM'
                                            />
                                        </div>

                                        <div className="col-12 md:col-6">
                                            <label htmlFor="endDate">End Time</label>
                                            <Calendar
                                                id="startTime"
                                                value={time}
                                                onChange={(e) => setTime(e.value)}
                                                showTime
                                                hourFormat="12"
                                                showSeconds={false}
                                                showIcon={true}  
                                                timeOnly
                                                icon="pi pi-clock"  
                                                style={{ width: '100%' }}
                                                placeholder='09:30AM'
                                            />
                                        </div>




                                    </div>
                                </form>
                            </div>


                            <div className="form-container">
                                <div className='parts flex justify-content-between align-items-center'>
                                <h5 className='mt-3'>Parts Used</h5>
                              
                                <Button label="Add parts" icon="pi pi-plus" className="p-button-sm" />
                                </div>
                               
                                <form>
                                    <div className="grid">
                                        <Card>

                                        
                                            <div className="p-fluid grid">
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="partsName">Parts name</label>
                                                    <InputText id="partsName" placeholder="Enter parts name" />
                                                </div>
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="serialNumber">Serial Number</label>
                                                    <InputText id="serialNumber" placeholder="Enter serial number" />
                                                </div>
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="modelNumber">Manufacturer</label>
                                                    <InputText id="modelNumber" placeholder="Enter Manufacturer" />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="modelNumber">Model Number</label>
                                                    <InputText id="modelNumber" placeholder="Enter model number" />
                                                </div>

                                            </div>
                                        </Card>




                                    </div>
                                </form>
                            </div>

                            <div className="form-container">
                                <h5>Maintenance Report</h5>
                                <hr className='horizontalLine'></hr>
                                <form>
                                    <div className="grid">
                                        <div className="col-12">
                                            <label htmlFor="report">Detailed description ( Work performed, any issues encountered, and recommendations for future actions )</label>
                                            <InputTextarea
                                                id="report"
                                                value={report}
                                                onChange={(e) => setReport(e.target.value)}
                                                rows={5}
                                                cols={10}
                                                className="w-full mt-2"
                                            />
                                        </div>


                                        <div className="col-12 md:col-6">
                                            <label htmlFor="uploadDocuments">Upload Supporting Documents</label>
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

                                        <div className="col-12 md:col-6">
                                            <label htmlFor="status">Status</label>
                                            <Dropdown
                                                id="status"
                                                value={status}
                                                onChange={(e) => setStatus(e.value)}
                                                options={statuses}
                                                optionLabel="name"
                                                placeholder="Choose Status"
                                                className="w-full mt-2"
                                            />
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

export default CrewHistoryEdit;
