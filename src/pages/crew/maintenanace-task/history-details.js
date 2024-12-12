import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import LeftMenu from '../../../components/menu';
import AdminHeader from '../../../components/header';
import PDFIcon from '../../../assets/images/pdf.svg';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";



const MaintenanceHistoryDetails = () => {
    const navigate = useNavigate();

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

    const parts = [
        { id: 1, partName: 'Hull', serialNumber: 'H12345', modelNumber: 'YH-100', manufacturer: 'Sunseeker Yachts' },
        { id: 2, partName: 'Deck', serialNumber: 'D23456', modelNumber: 'YD-200', manufacturer: 'Azimut Yachts' },
        { id: 3, partName: 'Stern', serialNumber: 'S45678', modelNumber: 'YS-400', manufacturer: 'Princess Yachts' }
    ];

    const goDocumentPage = () => {
         navigate("/crew/maintenance-task/history");
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

                    <Button
            onClick={goDocumentPage}
            label="Cancel"
            icon="pi pi-times-circle"
            severity="secondary"
            outlined
            className="p-button-secondary mr-3"
          />
          <Button
            onClick={goDocumentPage}
            label="Save Changes"
            icon="pi pi-save"
            className="p-button-primary"
            type="button"
          />
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
                        <div className="card bg-white p-4 border-round-lg">
                            <h5>Parts used</h5>
                            <DataTable value={parts} responsiveLayout="scroll">
                                <Column field="partName" header="Parts Name"></Column>
                                <Column field="serialNumber" header="Serial Number"></Column>
                                <Column field="modelNumber" header="Model Number"></Column>
                                <Column field="manufacturer" header="Manufacturer"></Column>
                            </DataTable>
                        </div>
                    </div>


                    <div className="form-container mt-4">
                        <div className="card bg-white p-4 border-round-lg">
                            <h5>Detailed Description</h5>
                            <div className='content mb-4'>
                                <h6 className='contentHeading font-bold'>Work performed</h6>
                                <p className='contentPara mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt, nisi nec pharetra egestas, sem elit luctus odio, at egestas nibh risus id nisl. Vestibulum non enim sit amet libero dictum cursus id quis felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt, nisi nec pharetra egestas, sem elit luctus odio, at egestas nibh risus id nisl. Vestibulum non enim sit amet libero dictum cursus id quis felis. </p>
                            </div>

                            <div className='content mb-4'>
                                <h6 className='contentHeading font-bold'>Issues encountered</h6>
                                <p className='contentPara mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt, nisi nec pharetra egestas, sem elit luctus odio, at egestas nibh risus id nisl. Vestibulum non enim sit amet libero dictum cursus id quis felis. </p>
                            </div>

                            <div className='content'>
                                <h6 className='contentHeading font-bold'>Recommendations</h6>
                                <p className='contentPara mt-3'>Nullam tincidunt, nisi nec pharetra egestas, sem elit luctus odio, at egestas nibh risus id nisl. Vestibulum non enim sit amet libero dictum cursus id quis felis.  </p>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </main>
    );
};

export default MaintenanceHistoryDetails;
