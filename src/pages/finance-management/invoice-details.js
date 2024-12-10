import React, { useState } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from 'primereact/card';
import { color } from "chart.js/helpers";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
import { Icon } from '@iconify/react';
import wallimage from '../../assets/images/wall-clock.svg';



const InvoiceDetails = () => {
  const navigate = useNavigate();
  useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const data = [
    { userName: "Floyd Miles", date: "2/10/2026", time: "4:10 PM", activity: "View" },
    { userName: "Ralph Edwards", date: "5/10/2026", time: "12:10 PM", activity: "Edit" },
    { userName: "Arlene McCoy", date: "7/10/2026", time: "8:10 AM", activity: "Edit" },
    { userName: "Devon Lane", date: "9/10/2026", time: "9:10 PM", activity: "View" }
];
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






const editInvoicePage = () => {
    navigate("/finance-management/invoice/edit");
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
                <h3>#YC98564</h3>
                <p>All informations are below</p>
              </div>
            </div>
            <div className="sub-header-right">
              <Button label="Edit" icon="pi pi-user-edit" severity="secondary" outlined className="p-button-secondary mr-3" onClick={editInvoicePage} />
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
                      <span>Invoice Number</span>#YC98564
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Vendor</span> 12/10/2024
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Amount</span> $200
                    </div>
                    <div className="detail-item flex gap-6">
                      <span> Invoice Date</span> 12/10/2024
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Due Date</span> 22/10/2024
                    </div>
                    <div className="detail-item flex gap-6">
                      <span>Amount Due</span> $200
                    </div>
                    <div className="detail-item flex gap-4">
                      <span>Vendor/Payee</span> Mazagon
                    </div>
                    <div className="detail-item flex gap-4">
                      <span>Payment Status</span> Paid
                 </div>
                
                    <div className="detail-item flex gap-4">
                      <span>Service/Item Description</span> Nullam eu varius augue. Suspendisse vel mauris et elit maximus egestas.
                    </div>

                    <div className="detail-item flex gap-4">
                      <span>Due Soon Threshold ( Reminder)</span> 2 Days
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

export default InvoiceDetails;
