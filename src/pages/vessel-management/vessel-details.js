import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import PDFIcon from '../../assets/images/pdf.svg';
import { Card } from 'primereact/card';


const VesselDetails = () => {
    const navigate = useNavigate();
    const [uploadedFiles] = useState([
        {
            name: 'example.pdf',
            type: 'application/pdf',
            url: 'path/to/example.pdf',
        }
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);


    const handleEdit = () => {
        setIsEditing(!isEditing);
        console.log(isEditing ? 'Editing disabled' : 'Editing enabled');
    };

    const downloadAllFiles = () => {
        uploadedFiles.forEach((file) => {
            const a = document.createElement('a');
            a.href = file.url;
            a.download = file.name;
            a.click();
        });
    };
    const editVesselPage = () => {
        navigate("/vessel-management/vessels/new");
    };

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
                            <h3>Oil Change</h3>
                            <p>All informations are below</p>
                        </div>
                    </div>
                    <div className="sub-header-right">

                        <Button label="Edit" icon="pi pi-user-edit" severity="secondary" outlined className="p-button-secondary" onClick={editVesselPage} />

                    </div>
                </div>


                <div className="card-wrapper-gap">
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="tabview-detaols">
                        <TabPanel header="General Information">
                            <div className='v-grid v-grid-two-column'>
                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Inspection Details</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-overview">
                                                <div className="details-content">
                                                    <div className="details-content-lable">Vessel Name</div>
                                                    <div className="details-content-text">
                                                        United States of America (USA)
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Registration No</div>
                                                    <div className="details-content-text">
                                                        USA6789
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Vessel Type</div>
                                                    <div className="details-content-text">
                                                        Motor Yacht
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Year Built</div>
                                                    <div className="details-content-text">
                                                        2023
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Manufacturer</div>
                                                    <div className="details-content-text">
                                                        Feadship                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Vessel Status</div>
                                                    <div className="details-content-text" style={{ color: "#22C55E" }}>
                                                        Active
                                                    </div>
                                                </div>


                                            </div>
                                        </Card>
                                    </div>
                                </div>





                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Dimensions</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-content">
                                                <div className="details-content-lable">Length</div>
                                                <div className="details-content-text">
                                                    10 meters
                                                </div>

                                            </div>


                                            <div className="details-content">
                                                <div className="details-content-lable">Beam</div>
                                                <div className="details-content-text">
                                                    5 meters
                                                </div>
                                            </div>

                                            <div className="details-content">
                                                <div className="details-content-lable">Draft</div>
                                                <div className="details-content-text">
                                                    2.1 meters
                                                </div>
                                            </div>

                                            <div className="details-content">
                                                <div className="details-content-lable">Gross Tonnage</div>
                                                <div className="details-content-text">
                                                    200 GT
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Engine Information & Capacity</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-content">
                                                <div className="details-content-lable">Engine Type and Power</div>
                                                <div className="details-content-text">
                                                    10 Gas Turbine
                                                </div>

                                            </div>


                                            <div className="details-content">
                                                <div className="details-content-lable">Number of Engines:</div>
                                                <div className="details-content-text">
                                                    2
                                                </div>
                                            </div>

                                            <div className="details-content">
                                                <div className="details-content-lable">Engine Power</div>
                                                <div className="details-content-text">
                                                    895 kilowatts (kW)
                                                </div>
                                            </div>


                                        </Card>
                                    </div>
                                </div>
                            </div>


                        </TabPanel>

                        <TabPanel header="Compliance Information">
                            <div className='v-grid v-grid-two-column'>
                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Inspection Details</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-overview">
                                                <div className="details-content">
                                                    <div className="details-content-lable">Inspection Details</div>
                                                    <div className="details-content-text">
                                                        Flag state
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Issuing Authority</div>
                                                    <div className="details-content-text">
                                                        USCG
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Email address</div>
                                                    <div className="details-content-text">
                                                        abc@gmail.com
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Year Built</div>
                                                    <div className="details-content-text">
                                                        2023
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Affiliated Organization</div>
                                                    <div className="details-content-text">
                                                        Demo
                                                    </div>
                                                </div>

                                                <div className="details-content">
                                                    <div className="details-content-lable">
                                                        Inspection Date</div>
                                                    <div className="details-content-text">
                                                        22/03/2024
                                                    </div>
                                                </div>

                                                <div className="details-content">
                                                    <div className="details-content-lable">
                                                        Inspector’s Name
                                                    </div>
                                                    <div className="details-content-text">
                                                        Demo Name
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Phone no</div>
                                                    <div className="details-content-text">
                                                        8768767687
                                                    </div>
                                                </div>

                                                <div className="details-content">
                                                    <div className="details-content-lable">
                                                        Outcome</div>
                                                    <div className="details-content-text">
                                                        demo outcome
                                                    </div>
                                                </div>

                                                <div className="details-content">
                                                    <div className="details-content-lable">
                                                        Observation Report</div>
                                                    <div className="details-content-text">
                                                        demo report
                                                    </div>
                                                </div>

                                                <div className="details-content">
                                                    <div className="details-content-lable">
                                                        Categories</div>
                                                    <div className="details-content-text">
                                                        Environmental
                                                    </div>
                                                </div>

                                                <div className="details-content">
                                                    <div className="details-content-lable">
                                                        Severity of Deficiency</div>
                                                    <div className="details-content-text">
                                                        Environmental
                                                    </div>
                                                </div>

                                                <div className="details-content">
                                                    <div className="details-content-lable">
                                                        Action Required</div>
                                                    <div className="details-content-text">
                                                        Yes
                                                    </div>
                                                </div>

                                                <div className="details-content">
                                                    <div className="details-content-lable">
                                                        Action Description</div>
                                                    <div className="details-content-text">
                                                        demo description
                                                    </div>
                                                </div>




                                            </div>
                                        </Card>
                                    </div>
                                </div>


                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Compliance Verification</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-content">
                                                <div className="details-content-lable">Return to Compliance</div>
                                                <div className="details-content-text">
                                                    Yes
                                                </div>

                                            </div>


                                            <div className="details-content">
                                                <div className="details-content-lable">Verification Officer Name</div>
                                                <div className="details-content-text">
                                                    demo officer
                                                </div>
                                            </div>
                                            <div className="details-content">
                                                <div className="details-content-lable">
                                                    {uploadedFiles.map((file, index) => {
                                                        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

                                                        return (
                                                            <div key={index} className="p-col-12 p-md-6 p-lg-4 p-d-flex p-ai-center p-jc-between">
                                                                <div className="p-d-flex p-ai-center flex">
                                                                    {isPdf ? (
                                                                        <>


                                                                            <img src={PDFIcon} className="file-icon mr-2" />
                                                                            <span className="flex align-items-center">{file.name}</span>
                                                                        </>
                                                                    ) : (
                                                                        <img src={file.url} alt={file.name} className="file-icon p-mr-2" style={{ width: '50px', height: '50px' }} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="details-content-text">
                                                    <Button
                                                        icon="pi pi-download"
                                                        label="Download"
                                                        className="p-button-outlined p-button-sm download-btn"
                                                        onClick={downloadAllFiles}
                                                    />
                                                </div>
                                            </div>

                                        </Card>
                                    </div>
                                </div>



                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Corrective Action Plan</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-content">
                                                <div className="details-content-lable">Description</div>
                                                <div className="details-content-text">
                                                    demo description
                                                </div>

                                            </div>


                                            <div className="details-content">
                                                <div className="details-content-lable">Responsible Person/Department</div>
                                                <div className="details-content-text">
                                                    Chief Engineer
                                                </div>
                                            </div>

                                            <div className="details-content">
                                                <div className="details-content-lable">Target Completion Date</div>
                                                <div className="details-content-text">
                                                    12/11/2024
                                                </div>
                                            </div>

                                            <div className="details-content">
                                                <div className="details-content-lable">Status</div>
                                                <div className="details-content-text">
                                                    Not started
                                                </div>
                                            </div>
                                            <div className="details-content">
                                                <div className="details-content-lable">Follow-Up Inspection Date</div>
                                                <div className="details-content-text">
                                                    12/11/2024
                                                </div>
                                            </div>
                                            <div className="details-content">
                                                <div className="details-content-lable">
                                                    {uploadedFiles.map((file, index) => {
                                                        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

                                                        return (
                                                            <div key={index} className="p-col-12 p-md-6 p-lg-4 p-d-flex p-ai-center p-jc-between">
                                                                <div className="p-d-flex p-ai-center flex">
                                                                    {isPdf ? (
                                                                        <>


                                                                            <img src={PDFIcon} className="file-icon mr-2" />
                                                                            <span className="flex align-items-center">{file.name}</span>
                                                                        </>
                                                                    ) : (
                                                                        <img src={file.url} alt={file.name} className="file-icon p-mr-2" style={{ width: '50px', height: '50px' }} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="details-content-text">
                                                    <Button
                                                        icon="pi pi-download"
                                                        label="Download"
                                                        className="p-button-outlined p-button-sm download-btn"
                                                        onClick={downloadAllFiles}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Next Scheduled</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-content">
                                                <div className="details-content-lable">Date</div>
                                                <div className="details-content-text">
                                                    12/11/2024
                                                </div>

                                            </div>


                                            <div className="details-content">
                                                <div className="details-content-lable">Type</div>
                                                <div className="details-content-text">
                                                    PSC Inspection
                                                </div>
                                            </div>

                                            <div className="details-content">
                                                <div className="details-content-lable">Automatic Reminder</div>
                                                <div className="details-content-text">
                                                    12/11/2024
                                                </div>
                                            </div>


                                        </Card>
                                    </div>
                                </div>
                            </div>

                        </TabPanel>
                        <TabPanel header="Maintenance Information">
                            <div className='v-grid v-grid-two-column'>
                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Maintenance Logs</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-overview">
                                                <div className="details-content">
                                                    <div className="details-content-lable">Task Title</div>
                                                    <div className="details-content-text">
                                                        demo task
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Task Category</div>
                                                    <div className="details-content-text">
                                                        Engine System
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Date of Maintenance</div>
                                                    <div className="details-content-text">
                                                        12/11/2024
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Service Provide Type</div>
                                                    <div className="details-content-text">
                                                        Internal Crew
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Date of Maintenance</div>
                                                    <div className="details-content-text">
                                                        12/02/2024  
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Description of Work Done</div>
                                                    <div className="details-content-text">
                                                        description work
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">
                                                        {uploadedFiles.map((file, index) => {
                                                            const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

                                                            return (
                                                                <div key={index} className="p-col-12 p-md-6 p-lg-4 p-d-flex p-ai-center p-jc-between">
                                                                    <div className="p-d-flex p-ai-center flex">
                                                                        {isPdf ? (
                                                                            <>


                                                                                <img src={PDFIcon} className="file-icon mr-2" />
                                                                                <span className="flex align-items-center">{file.name}</span>
                                                                            </>
                                                                        ) : (
                                                                            <img src={file.url} alt={file.name} className="file-icon p-mr-2" style={{ width: '50px', height: '50px' }} />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="details-content-text">
                                                        <Button
                                                            icon="pi pi-download"
                                                            label="Download"
                                                            className="p-button-outlined p-button-sm download-btn"
                                                            onClick={downloadAllFiles}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </Card>
                                    </div>
                                </div>





                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Spare Parts and Inventory</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-content">
                                                <div className="details-content-lable">Parts Name</div>
                                                <div className="details-content-text">
                                                    Inverters and Converters
                                                </div>

                                            </div>


                                            <div className="details-content">
                                                <div className="details-content-lable">Date of Replacement</div>
                                                <div className="details-content-text">
                                                    12/11/2024
                                                </div>
                                            </div>

                                            <div className="details-content">
                                                <div className="details-content-lable">Service Provide Type</div>
                                                <div className="details-content-text">
                                                    Internal Crew
                                                </div>
                                            </div>

                                            <div className="details-content">
                                                <div className="details-content-lable">Supplier phone</div>
                                                <div className="details-content-text">
                                                    8587568756756
                                                </div>
                                            </div>
                                            <div className="details-content">
                                                <div className="details-content-lable">
                                                    {uploadedFiles.map((file, index) => {
                                                        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

                                                        return (
                                                            <div key={index} className="p-col-12 p-md-6 p-lg-4 p-d-flex p-ai-center p-jc-between">
                                                                <div className="p-d-flex p-ai-center flex">
                                                                    {isPdf ? (
                                                                        <>


                                                                            <img src={PDFIcon} className="file-icon mr-2" />
                                                                            <span className="flex align-items-center">{file.name}</span>
                                                                        </>
                                                                    ) : (
                                                                        <img src={file.url} alt={file.name} className="file-icon p-mr-2" style={{ width: '50px', height: '50px' }} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="details-content-text">
                                                    <Button
                                                        icon="pi pi-download"
                                                        label="Download"
                                                        className="p-button-outlined p-button-sm download-btn"
                                                        onClick={downloadAllFiles}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>


                            </div>

                        </TabPanel>
                        <TabPanel header="Financial Information">
                            <div className='v-grid v-grid-two-column'>
                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Operational Expenses</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-overview">
                                                <div className="details-content">
                                                    <div className="details-content-lable">Category</div>
                                                    <div className="details-content-text">
                                                        Maintenance
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Date</div>
                                                    <div className="details-content-text">
                                                        12/11/2024
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Amount</div>
                                                    <div className="details-content-text">
                                                        $300
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Description</div>
                                                    <div className="details-content-text">
                                                        demo description
                                                    </div>
                                                </div>

                                                <div className="details-content">
                                                    <div className="details-content-lable">
                                                        {uploadedFiles.map((file, index) => {
                                                            const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

                                                            return (
                                                                <div key={index} className="p-col-12 p-md-6 p-lg-4 p-d-flex p-ai-center p-jc-between">
                                                                    <div className="p-d-flex p-ai-center flex">
                                                                        {isPdf ? (
                                                                            <>


                                                                                <img src={PDFIcon} className="file-icon mr-2" />
                                                                                <span className="flex align-items-center">{file.name}</span>
                                                                            </>
                                                                        ) : (
                                                                            <img src={file.url} alt={file.name} className="file-icon p-mr-2" style={{ width: '50px', height: '50px' }} />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="details-content-text">
                                                        <Button
                                                            icon="pi pi-download"
                                                            label="Download"
                                                            className="p-button-outlined p-button-sm download-btn"
                                                            onClick={downloadAllFiles}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </Card>
                                    </div>
                                </div>





                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Revenue</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-content">
                                                <div className="details-content-lable">Revenue Source</div>
                                                <div className="details-content-text">
                                                    Charter
                                                </div>

                                            </div>


                                            <div className="details-content">
                                                <div className="details-content-lable">
                                                    Amount</div>
                                                <div className="details-content-text">
                                                    $400
                                                </div>
                                            </div>

                                            <div className="details-content">
                                                <div className="details-content-lable">Date</div>
                                                <div className="details-content-text">
                                                    12/11/2024
                                                </div>
                                            </div>

                                            <div className="details-content">
                                                <div className="details-content-lable">Description</div>
                                                <div className="details-content-text">
                                                    demo description
                                                </div>
                                            </div>
                                            <div className="details-content">
                                                <div className="details-content-lable">
                                                    {uploadedFiles.map((file, index) => {
                                                        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

                                                        return (
                                                            <div key={index} className="p-col-12 p-md-6 p-lg-4 p-d-flex p-ai-center p-jc-between">
                                                                <div className="p-d-flex p-ai-center flex">
                                                                    {isPdf ? (
                                                                        <>


                                                                            <img src={PDFIcon} className="file-icon mr-2" />
                                                                            <span className="flex align-items-center">{file.name}</span>
                                                                        </>
                                                                    ) : (
                                                                        <img src={file.url} alt={file.name} className="file-icon p-mr-2" style={{ width: '50px', height: '50px' }} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="details-content-text">
                                                    <Button
                                                        icon="pi pi-download"
                                                        label="Download"
                                                        className="p-button-outlined p-button-sm download-btn"
                                                        onClick={downloadAllFiles}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>


                            </div>

                        </TabPanel>
                    </TabView>
                </div>
        </>
    );
};

export default VesselDetails;
