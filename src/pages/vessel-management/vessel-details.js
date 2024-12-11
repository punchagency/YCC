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
    const editMaintenancePage = () => {
        navigate("/maintenance-scheduling/maintenance/edit");
    };

    return (
        <>
                <div className="flex align-items-center justify-content-between sub-header-panel">
                    <div className="sub-header-left sub-header-left-with-arrow">
                        <div className="arrow">
                            <Link to="/maintenance-scheduling/maintenance">
                                <i className="pi pi-angle-left"></i>
                            </Link>
                        </div>
                        <div className="content">
                            <h3>Oil Change</h3>
                            <p>All informations are below</p>
                        </div>
                    </div>
                    <div className="sub-header-right">

                        <Button label="Edit" icon="pi pi-user-edit" severity="secondary" outlined className="p-button-secondary" onClick={editMaintenancePage} />

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
                                                    <div className="details-content-text" style={{color:"#22C55E"}}>
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
                            kjgkj

                        </TabPanel>
                        <TabPanel header="Maintenance Information">
                            kjgkj

                        </TabPanel>
                        <TabPanel header="Financial Information">
                            kjgkj

                        </TabPanel>
                    </TabView>
                </div>
        </>
    );
};

export default VesselDetails;
