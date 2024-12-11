import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import PDFIcon from "../../assets/images/pdf.svg";
const ComplianceDetails = () => {
  // Access the userId from the URL
  useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploadedFiles] = useState([
    {
      name: "Crew Certification (STCW)",
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

  // You can now use the userId to fetch or display the specific user details
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="arrow">
            <Link to="/user-management/users">
              {" "}
              {/* Replace "/previous-page" with your target route */}
              <i className="pi pi-angle-left"></i>
            </Link>
          </div>
          <div className="content">
            <h3>Sea Dreamer</h3>
            <p>All informations are below</p>
          </div>
        </div>
        <div className="sub-header-right">
          <Button
            label="Edit"
            icon="pi pi-user-edit"
            severity="secondary"
            outlined
            className="p-button-secondary mr-3"
          />
          <Button
            label="Assign task"
            icon="pi pi-clipboard"
            className="p-button-primary"
          />
        </div>
      </div>
      <div className="card-wrapper-gap">
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          className="tabview-detaols"
        >
          <TabPanel header="General Information">
            <div className="v-grid v-grid-two-column">
              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>Inspection Details</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">Vessel Name</div>
                        <div className="details-content-text">Sea Dreamer</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Inspection Type
                        </div>
                        <div className="details-content-text">
                          Flag State Inspection
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Issuing Authority
                        </div>
                        <div className="details-content-text">USCG</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Inspection Date
                        </div>
                        <div className="details-content-text">20/10/2024</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Inspector’s Name
                        </div>
                        <div className="details-content-text">Rohit Watson</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Affiliated Organization
                        </div>
                        <div className="details-content-text">
                          Affiliated Organization name
                        </div>
                      </div>

                      <div className="details-content">
                        <div className="details-content-lable">Phone no</div>
                        <div className="details-content-text">
                          +01 9879 56782
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>Inspection Outcome</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">Vessel Name</div>
                        <div className="details-content-text">Sea Dreamer</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Observation Report{" "}
                        </div>
                        <div className="details-content-text">
                          Maecenas consectetur urna et lorem porttitor, vel
                          rutrum neque lacinia.
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Categories</div>
                        <div className="details-content-text">
                          Environmental
                        </div>
                      </div>

                      <div className="details-content">
                        <div className="details-content-lable">
                          Severity of Deficiency
                        </div>
                        <div className="details-content-text">Major</div>
                      </div>

                      <div className="details-content">
                        <div className="details-content-lable">
                          Inspector’s Name
                        </div>
                        <div className="details-content-text">2023</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Action Description
                        </div>
                        <div className="details-content-text">
                          Maecenas porttitor iaculis massa ac rutrum.
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Phone no</div>
                        <div
                          className="details-content-text"
                          style={{ color: "#22C55E" }}
                        >
                          Active
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>Corrective Action Plan</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">Description</div>
                        <div className="details-content-text">
                          Maecenas consectetur urna et lorem porttitor, vel
                          rutrum neque lacinia. Maecenas porttitor iaculis massa
                          ac rutrum.
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Responsible Person/Department
                        </div>
                        <div className="details-content-text">
                          Chief Engineer
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Target Completion Date
                        </div>
                        <div className="details-content-text">26/10/2024</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Status</div>
                        <div className="details-content-text">Ongoing</div>
                      </div>

                      <div className="details-content">
                        <div className="details-content-lable">
                          Follow-Up Inspection Date
                        </div>
                        <div className="details-content-text">30/10/2024</div>
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
                                      <img
                                        src={PDFIcon}
                                        className="file-icon mr-2"
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

              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>Compliance Verification</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">
                          Return to Compliance
                        </div>
                        <div className="details-content-text">Yes</div>
                      </div>
                    </div>

                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">
                          Verification Officer Name (Optional)
                        </div>
                        <div className="details-content-text">
                          Robert Stephen
                        </div>
                      </div>
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
                                    <img
                                      src={PDFIcon}
                                      className="file-icon mr-2"
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
                      <div className="p-d-flex p-jc-end">
                        <Button
                          icon="pi pi-download"
                          label="Download"
                          className="p-button-outlined p-button-sm p-mt-3 ml-6 download-btn"
                          onClick={downloadAllFiles}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>Next Scheduled</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">Date</div>
                        <div className="details-content-text">30/10/2024</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Password</div>
                        <div className="details-content-text">Welcome#123</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Account Type
                        </div>
                        <div className="details-content-text">Admin</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default ComplianceDetails;
