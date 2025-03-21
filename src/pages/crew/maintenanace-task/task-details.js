import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import PDFIcon from '../../../assets/images/pdf.svg';


const CrewTaskDetails = () => {
  const navigate = useNavigate();
  const [uploadedFiles] = useState([
    {
      name: 'example.pdf',
      type: 'application/pdf',
      url: 'path/to/example.pdf',
    }
  ]); 
  const [activeIndex, setActiveIndex] = useState(0);


  const downloadAllFiles = () => {
    uploadedFiles.forEach((file) => {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      a.click();
    });
  };
  const editMaintenancePage = () => {
    navigate("/crew/maintenance-task/mytask/edit");
  };

  return (
    <main className="flex h-screen page">
      {/* <LeftMenu role="Captain" /> */}
      <div className="w-full right-panel-component">
        {/* <AdminHeader /> */}
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="arrow">
              <Link to="/crew/maintenance-task/mytask">
                <i className="pi pi-angle-left"></i>
              </Link>
            </div>
            <div className="content">
              <h3>Oil Change</h3>
              <p>All informations are below</p>
            </div>
          </div>
          <div className="sub-header-right">
         
            <Button label="Log Task" severity="primary" outlined className="p-button-primary" onClick={editMaintenancePage}/>

          </div>
        </div>


        <div className="card-wrapper-gap">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="tabview-detaols">
                <TabPanel header="Overview">
                    <div className="card-wraper">
                    <div className="p-p-4">
                <div>
                  <h5 className='text-base m-0 mb-3'>Task Information</h5>
                  <div style={{ lineHeight: '2' }}>
                    <div className="detail-item flex gap-6">
                      <span className='labelName'>Vessle Name</span><span className='labelValue'>Sea Dreamer</span>
                    </div>
                    <div className="detail-item flex gap-6">
                    <span className='labelName'>Task Category</span> <span className='labelValue'>Engine & Propulsion Systems</span>
                    </div>
                    <div className="detail-item flex gap-6">
                    <span className='labelName'>Equipment Name</span> <span className='labelValue'>Fuel System</span>
                    </div>
                  
                    <div className="detail-item flex gap-6">
                    <span className='labelName'>Start Date</span> <span className='labelValue'>12/10/2024</span>
                    </div>
                    <div className="detail-item flex gap-6">
                    <span className='labelName'>Due Date</span> <span className='labelValue'>13/10/2024</span>
                    </div>
                    <div className="detail-item flex gap-6">
                    <span className='labelName'>Priority Level</span><span className='labelValue'>High</span>
                    </div>
                    <div className="detail-item flex gap-6">
                    <span className='labelName'>Maintenance Frequency</span> <span className='labelValue'>Weekly</span>
                    </div>
               
                
                    <div className="detail-item flex gap-6">
                    <span className='labelName'>Status</span> <span className='labelValue' style={{color:"#22C55E"}}>In Progress</span>
                    </div>

                    <div className="detail-item flex gap-6">
                        <span className='labelName'>Note</span> <span className='labelValue'>Regular oil changes are essential to keep engines running smoothly and prevent wear on internal components</span>
                    </div>

                

                    <div className="detail-item flex gap-6">
                      <div className="labelName">
                        {uploadedFiles.map((file, index) => {
                          const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

                          return (
                            <div key={index} className="p-col-12 p-md-6 p-lg-4 p-d-flex p-ai-center p-jc-between">
                              <div className="p-d-flex p-ai-center flex">
                                {isPdf ? (
                                  <>
                                    {/* <i className="pi pi-file-pdf file-icon p-mr-2" style={{ fontSize: '2rem' }}></i> */}
                                    <img src={PDFIcon} className='file-icon p-mr-2' style={{ fontSize: '2rem' }} alt=''></img>
                                    <span className='flex align-items-center'>{file.name}</span>
                                  </>
                                ) : (
                                  <img src={file.url} alt={file.name} className="file-icon p-mr-2" style={{ width: '50px', height: '50px' }} />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="labelValue">
                      <Button
                        icon="pi pi-download"
                        label="Download"
                        className="p-button-outlined p-button-sm p-mt-3 download-btn"
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

export default CrewTaskDetails;
