import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import PDFIcon from "../../assets/images/pdf.svg";

const MaintenanceDetails = () => {
  const navigate = useNavigate();
  const [uploadedFiles] = useState([
    {
      name: "example.pdf",
      type: "application/pdf",
      url: "path/to/example.pdf",
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  // const handleEdit = () => {
  //   setIsEditing(!isEditing);
  // };

  const downloadAllFiles = () => {
    uploadedFiles.forEach((file) => {
      const a = document.createElement("a");
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
          <Button
            label="Edit"
            icon="pi pi-user-edit"
            severity="secondary"
            outlined
            className="p-button-secondary"
            onClick={editMaintenancePage}
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
                  <h5 className="text-base m-0 mb-3">General Information</h5>
                  <div style={{ lineHeight: "2" }}>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Task Title</span>
                      <span className="labelValue">Oil Change</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Vessle Name</span>{" "}
                      <span className="labelValue">Sea Dreamer</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Equipment Name</span>{" "}
                      <span className="labelValue">Fuel System</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName"> Assigned Crew </span>{" "}
                      <span className="labelValue">Courtney Henry</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Date</span>{" "}
                      <span className="labelValue">12/10/2024</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Priority Level</span>
                      <span className="labelValue">High</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Maintenance Frequency</span>{" "}
                      <span className="labelValue">Weekly</span>
                    </div>

                    <div className="detail-item flex gap-6">
                      <span className="labelName">Status</span>{" "}
                      <span className="labelValue" style={{ color: "#22C55E" }}>
                        In Progress
                      </span>
                    </div>

                    <div className="detail-item flex gap-6">
                      <span className="labelName">Note</span>{" "}
                      <span className="labelValue">
                        Regular oil changes are essential to keep engines
                        running smoothly and prevent wear on internal components
                      </span>
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
                                      alt="PDF Icon"
                                      className="file-icon p-mr-2"
                                      style={{ fontSize: "2rem" }}
                                    />
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
                          className="p-button-outlined p-button-sm download-btn p-button p-component"
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

export default MaintenanceDetails;
