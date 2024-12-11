import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';


const MaintenanceDetails = () => {
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
              <h3>Oil Change</h3>
              <p>All informations are below</p>
            </div>
          </div>
          <div className="sub-header-right">
         
       <Button label="Edit" icon="pi pi-user-edit" severity="secondary" outlined className="p-button-secondary mr-3" onClick={editMaintenancePage}/>

          </div>
        </div>

        <div className="card-wrapper-gap">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="tabview-detaols">
                <TabPanel header="Overview">
                    <div className="card-wraper">
                    <div className="p-p-4">
                <div>
                  <h5 className='text-base'>General Information</h5>
                  <div style={{ lineHeight: '2' }}>
                    <div className="detail-item flex gap-6">
                      <span>Task Title</span>Oil Change
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Vessle Name</span> Sea Dreamer
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Equipment Name</span> Fuel System
                    </div>
                    <div className="detail-item flex gap-6">
                      <span> Assigned Crew </span> Courtney Henry
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Date</span> 12/10/2024
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Priority Level</span>High
                    </div>
                    <div className="detail-item flex gap-4">
                      <span>Maintenance Frequency</span> Weekly
                    </div>
               
                
                    <div className="detail-item flex gap-4">
                      <span>Status</span> <span style={{color:"#22C55E"}}>In Progress</span>
                    </div>

                    <div className="detail-item flex gap-4">
                      <span>Note</span> Regular oil changes are essential to keep engines running smoothly and prevent wear on internal components
                    </div>

                

                    <div className="detail-item flex">
                      <div className="p-grid p-dir-col p-mt-3">
                        {uploadedFiles.map((file, index) => {
                          const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

                          return (
                            <div key={index} className="p-col-12 p-md-6 p-lg-4 p-d-flex p-ai-center p-jc-between">
                              <div className="p-d-flex p-ai-center flex">
                                {isPdf ? (
                                  <>
                                    <i className="pi pi-file-pdf file-icon p-mr-2" style={{ fontSize: '2rem' }}></i>
                                    <span>{file.name}</span>
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
                        className="p-button-outlined p-button-sm p-mt-3 ml-6"
                        onClick={downloadAllFiles}
                      />
                    </div>
                    </div>
                 
                  </div>
                </div>
              </div>
                    </div>
               
                  
                </TabPanel>
            </TabView>
          </div>
      </div>
    </main>
  );
};

export default MaintenanceDetails;
