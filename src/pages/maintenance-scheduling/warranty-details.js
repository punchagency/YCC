import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import PDFIcon from "../../assets/images/pdf.svg";

const WarrantyDetails = () => {
  // Access the userId from the URL
  useParams();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploadedFiles] = useState([
    {
      name: "example.pdf",
      type: "application/pdf",
      url: "path/to/example.pdf",
    },
  ]);
  const downloadAllFiles = () => {
    uploadedFiles.forEach((file) => {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      a.click();
    });
  };

  const editWarrantyPage = () => {
    navigate("/maintenance-scheduling/warranty/new");
  };

  // You can now use the userId to fetch or display the specific user details
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="arrow">
            <Link to="/maintenance-scheduling/warranty">
              <i className="pi pi-angle-left"></i>
            </Link>
          </div>
          <div className="content">
            <h3>Main Engine</h3>
            <p>All informations are below</p>
          </div>
        </div>
        <div className="sub-header-right">
          <Button
            label="Edit"
            icon="pi pi-user-edit"
            severity="secondary"
            outlined
            className="p-button-secondary"
            onClick={editWarrantyPage}
          />
        </div>
      </div>
      <div className="card-wrapper-gap">
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          className="tabview-detaols"
        >
          <TabPanel header="Overview">
            <div className="card-wraper">
              <div className="p-p-4">
                <div>
                  <h5 className="text-base">General Information</h5>
                  <div style={{ lineHeight: "2" }}>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Equipment</span>
                      <span className="labelValue">Alternator</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Serial Number</span>{" "}
                      <span className="labelValue">12345-CAT</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Manufacturer</span>{" "}
                      <span className="labelValue">Viking</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName"> Coverage</span>{" "}
                      <span className="labelValue">Parts</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Supplier name</span>
                      <span className="labelValue">Robert</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Supplier phone no</span>
                      <span className="labelValue">+01 6789 7890</span>
                    </div>
                    <div className="detail-item flex gap-4">
                      <span className="labelName">
                        Warranty Expiration Date
                      </span>
                      <span className="labelValue">22/10/2024</span>
                    </div>
                    <div className="detail-item flex gap-4">
                      <span className="labelName">Warranty Status</span>{" "}
                      <span className="labelValue" style={{ color: "green" }}>
                        Warranty
                      </span>
                    </div>
                    <div className="detail-item flex gap-4">
                      <span className="labelName">
                        Warranty expiration Soon Threshold ( Reminder)
                      </span>{" "}
                      <span className="labelValue">10/15/2024 </span>
                    </div>
                    <div className="detail-item flex">
                      <div className="p-grid p-dir-col p-mt-3">
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
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default WarrantyDetails;
