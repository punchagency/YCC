import React, { useState } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from 'primereact/card';

const EquipmentDetails = () => {
  // Access the userId from the URL
  useParams();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploadedFiles] = useState([
    {
      name: 'example.pdf',
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

  const editEquipmentPage = () => {
    navigate("/maintenance-scheduling/equipment/edit");
  };

  // You can now use the userId to fetch or display the specific user details
  return (
    <main className="flex h-screen page">
       <LeftMenu />
       <div className="w-full right-panel-component">
          <AdminHeader />
          <div className="flex align-items-center justify-content-between sub-header-panel">
            <div className="sub-header-left sub-header-left-with-arrow">
              <div className='arrow'>
                  <Link to="/user-management/users"> 
                    <i className="pi pi-angle-left"></i>
                  </Link>
              </div>
              <div className='content'>
                <h3>Devon Lane</h3>
                <p>User’s all type of information</p>
              </div>
            </div>
            <div className="sub-header-right">
              <Button label="Edit" icon="pi pi-user-edit" severity="secondary" outlined className="p-button-secondary mr-3" onClick={editEquipmentPage} />
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
                      <span>Equipment</span>Alternator
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Serial Number</span> 12345-CAT
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Manufacturer</span> Viking
                    </div>
                    <div className="detail-item flex gap-6">
                      <span> Coverage</span> Parts
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Supplier name</span> Robert
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Supplier phone no</span> +01 6789 7890
                    </div>
                    <div className="detail-item flex gap-4">
                      <span>Warranty Expiration Date</span> 22/10/2024
                    </div>
                    <div className="detail-item flex gap-4">
                      <span>Warranty Status</span> <span style={{ color: 'green' }}>Warranty</span>
                    </div>
                    <div className="detail-item flex gap-4">
                      <span>Warranty expiration Soon Threshold ( Reminder)</span> 10/15/2024	
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

export default EquipmentDetails;
