import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import LeftMenu from '../../../components/menu';
import AdminHeader from '../../../components/header';
import PDFIcon from '../../../assets/images/pdf.svg';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';


const MaintenanceHistoryDetails = () => {
    const navigate = useNavigate();
 

    const [isEditing, setIsEditing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [uploadedFiles] = useState([
        {
            name: 'Crew Certification (STCW)',
            type: 'application/pdf',
            url: 'path/to/example.pdf',
        }
    ]);
    const downloadAllFiles = () => {
        uploadedFiles.forEach((file) => {
            const a = document.createElement('a');
            a.href = file.url;
            a.download = file.name;
            a.click();
        });
    };


   
    const editVesselPage = () => {
        // navigate("/vessel-management/vessels/new");
    };

    return (
        <main className="flex h-screen page">
            {/* <LeftMenu role="Crew Member" /> */}
            <div className="w-full right-panel-component">
                {/* <AdminHeader /> */}
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
                    
                            <div className='v-grid v-grid-two-column'>
                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Log Hours</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-overview">
                                                <div className="details-content">
                                                    <div className="details-content-lable">Start Date</div>
                                                    <div className="details-content-text">
                                                        12/11/2024
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">End Date</div>
                                                    <div className="details-content-text">
                                                        14/12/2024
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Vessel Type</div>
                                                    <div className="details-content-text">
                                                        Motor Yacht
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">Start Time</div>
                                                    <div className="details-content-text">
                                                       08:45PM
                                                    </div>
                                                </div>
                                                <div className="details-content">
                                                    <div className="details-content-lable">End Time</div>
                                                    <div className="details-content-text">
                                                    09:45PM                                                    </div>
                                                </div>
                                          

                                            </div>
                                        </Card>
                                    </div>
                                </div>





                                <div className='item'>
                                    <div className="card flex justify-content-center">
                                        <Card className="details-card" title={
                                            <div className="card-header">
                                                <span>Document</span>
                                                <div className="three-dot-menu">

                                                </div>
                                            </div>
                                        }
                                        >
                                            <div className="details-content">
                                            <div className="detail-item flex align-items-center">
                                                    <div className="p-grid p-dir-col p-mt-3">
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
                                                    <div className="p-d-flex p-jc-end">
                                                        <Button
                                                            icon="pi pi-download"
                                                            label="Download"
                                                            className="p-button-outlined p-button-sm p-mt-3 ml-6 download-btn"
                                                            onClick={downloadAllFiles}
                                                        />
                                                    </div>
                                                </div>
                                   

                                            </div>


                                        </Card>
                                    </div>
                                </div>

                              
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
                                                <div className="field col-6">
                                                    <label htmlFor="partsName">Parts name</label>
                                                    <InputText id="partsName" placeholder="Enter parts name" />
                                                </div>
                                                <div className="field col-6">
                                                    <label htmlFor="serialNumber">Serial Number</label>
                                                    <InputText id="serialNumber" placeholder="Enter serial number" />
                                                </div>
                                                <div className="field col-6">
                                                    <label htmlFor="modelNumber">Manufacturer</label>
                                                    <InputText id="modelNumber" placeholder="Enter Manufacturer" />
                                                </div>

                                                <div className="field col-6">
                                                    <label htmlFor="modelNumber">Model Number</label>
                                                    <InputText
                                                     id="modelNumber" placeholder="Enter model number" />
                                                </div>

                                            </div>
                                        </Card>




                                    </div>
                                </form>
                            </div>
                   

                       
                </div>
            </div>
        </main>
    );
};

export default MaintenanceHistoryDetails;
