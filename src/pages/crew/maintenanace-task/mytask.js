import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import LeftMenu from "../../../components/menu";
import AdminHeader from '../../../components/header';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const MyTask = () => {
    const [myTask, setMyTask] = useState([]);
    const [filteredTask, setFilteredTask] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const menuRef = useRef(null);
    const [uploadedFiles] = useState([
        {
            name: 'example.pdf',
            type: 'application/pdf',
            url: 'path/to/example.pdf',
        }
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const tasks = [
        { id: 1,name: 'Oil Change', assign: 'Courtney Henry', date: '26/10/2024', priority: 'High', status: 'Pending' },
        { id: 2,name: 'Filter Replacement', assign: 'Theresa Webb', date: '23/10/2024', priority: 'Medium', status: 'Completed' },
        { id: 3,name: 'Oil Change', assign: 'Bessie Cooper', date: '12/10/2024', priority: 'Low', status: 'In Progress' },
        { id: 4,name: 'Filter Replacement', assign: 'Robert Fox', date: '08/10/2024', priority: 'High', status: 'Pending' },
        { id: 5,name: 'Engine Inspection', assign: 'Ronald Richards', date: '20/09/2024', priority: 'Medium', status: 'Completed' },
        { id: 6,name: 'Engine Inspection', assign: 'Floyd Miles', date: '03/08/2024', priority: 'Low', status: 'Pending' },
    ];
    const filterTasks = (status) => tasks.filter((task) => task.status === status);


    const renderTaskTable = (filteredTasks) => (
        <DataTable value={filteredTasks} paginator rows={5}>
            <Column field="name" header="Task Name" />
            <Column field="assign" header="Assign By" />
            <Column field="date" header="Date" />
            <Column field="priority" header="Priority" body={(rowData) => <span className={`priority-${rowData.priority.toLowerCase()}`}>{rowData.priority}</span>} />
            <Column field="status" header="Status" />
        </DataTable>
    );

    const applyFilters = useCallback(() => {
        let filteredData = myTask;
        if (searchText.trim()) {
            filteredData = filteredData.filter((doc) =>
                Object.values(doc)
                    .some((value) =>
                        String(value).toLowerCase().includes(searchText.toLowerCase())
                    )
            );
        }
        setFilteredTask(filteredData);
    }, [myTask, searchText]);

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
        <main className="flex h-screen page">
            <LeftMenu role="Crew Member"/>
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
                            <h3>My Task</h3>
                            <p>All informations are below</p>
                        </div>
                    </div>
                    <div className="sub-header-right">

                        <Button label="Edit" icon="pi pi-user-edit" severity="secondary" outlined className="p-button-secondary" onClick={editMaintenancePage} />

                    </div>
                </div>


                <div className="card-wrapper-gap">
                    {/* <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="tabview-detaols">
                        <TabPanel header="In Progress" headerStyle={{ color: '#188A42' }}>
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

                        <TabPanel header="Pending" headerStyle={{color:'#D9712A'}}>
                            kjgkj

                        </TabPanel>
                        <TabPanel header="Completed" headerStyle={{color:"#337E89"}}>
                            kjgkj

                        </TabPanel>
                   
                    </TabView> */}

                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel header="In Progress" style={{color:"#188A42"}}>
                            {renderTaskTable(filterTasks('In Progress'))}
                        </TabPanel>
                        <TabPanel header="Pending" style={{color:"#D9712A"}}>
                            {renderTaskTable(filterTasks('Pending'))}
                        </TabPanel>
                        <TabPanel header="Completed" style={{color:"#337E89"}}>
                            {renderTaskTable(filterTasks('Completed'))}
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </main>
    );
};

export default MyTask;
