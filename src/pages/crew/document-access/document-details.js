import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";

import PDFIcon from "../../../assets/images/pdf.svg";

const CrewDocumentDetails = () => {
  const navigate = useNavigate();
  const [uploadedFiles] = useState([
    {
      name: "example.pdf",
      type: "application/pdf",
      url: "path/to/example.pdf",
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

 

  const downloadAllFiles = () => {
    uploadedFiles.forEach((file) => {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      a.click();
    });
  };

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="arrow">
            <Link to="/crew/maintenance-task/document">
              <i className="pi pi-angle-left"></i>
            </Link>
          </div>
          <div className="content">
            <h3>Engine Maintenance Guide</h3>
            <p>All informations are below</p>
          </div>
        </div>
        <div className="sub-header-right">
     
        </div>
      </div>
      <div className="card-wrapper-gap">
      
          
            <div className="card-wraper">
              <div className="p-p-4">
                <div>
                  <h5 className="text-base m-0 mb-3">General Information</h5>
                  <div style={{ lineHeight: "2" }}>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Document Name</span>
                      <span className="labelValue">Engine Maintenance Guide</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Category</span>{" "}
                      <span className="labelValue">Manual</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Associated vessel</span>{" "}
                      <span className="labelValue">Sea Dreamer</span>
                    </div>
                   
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Date Added</span>{" "}
                      <span className="labelValue">12/10/2024</span>
                    </div>
                 

                    <div className="detail-item flex gap-6">
                      <div className="labelName">
                        {uploadedFiles.map((file, index) => {
                          const isPdf =
                            file.type === "application/pdf" ||
                            file.name.toLowerCase().endsWith(".pdf");

                          return (
                            <div
                              key={index}
                              className="p-col-12 p-md-6 p-lg-4 p-d-flex p-ai-center p-jc-between"
                            >
                              <div className="p-d-flex p-ai-center flex">
                                {isPdf ? (
                                  <>
                                    {/* <i className="pi pi-file-pdf file-icon p-mr-2" style={{ fontSize: '2rem' }}></i> */}
                                    <img
                                      src={PDFIcon}
                                      className="file-icon p-mr-2"
                                      style={{ fontSize: "2rem" }}
                                    ></img>
                                    <span className="flex align-items-center">
                                      {file.name}
                                    </span>
                                  </>
                                ) : (
                                  <img
                                    src={file.url}
                                    alt={file.name}
                                    className="file-icon p-mr-2"
                                    style={{ width: "50px", height: "50px" }}
                                  />
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
                          className="p-button-outlined p-button-sm download-btn"
                          onClick={downloadAllFiles}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        
      </div>
    </>
  );
};

export default CrewDocumentDetails;
