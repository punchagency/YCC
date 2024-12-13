import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { color } from "chart.js/helpers";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
import { Icon } from "@iconify/react";
import wallimage from "../../assets/images/wall-clock.svg";
import PDFIcon from "../../assets/images/pdf.svg";

const DocumentDetails = () => {
  // Access the userId from the URL
  const navigate = useNavigate();
  useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const data = [
    {
      userName: "Floyd Miles",
      date: "2/10/2026",
      time: "4:10 PM",
      activity: "View",
    },
    {
      userName: "Ralph Edwards",
      date: "5/10/2026",
      time: "12:10 PM",
      activity: "Edit",
    },
    {
      userName: "Arlene McCoy",
      date: "7/10/2026",
      time: "8:10 AM",
      activity: "Edit",
    },
    {
      userName: "Devon Lane",
      date: "9/10/2026",
      time: "9:10 PM",
      activity: "View",
    },
  ];

  const activityTemplate = (rowData) => {
    return <span className="activity-button">{rowData.activity}</span>;
  };

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

  const cardStyle = {
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const headerStyle = {
    fontSize: "16px",
    fontWeight: "bold",
  };

  const renewalStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.5rem",
    fontSize: "14px",
    color: "#555",
  };

  const imageStyle = {
    width: "20px",
    height: "20px",
  };

  // You can now use the userId to fetch or display the specific user details
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="arrow">
            <Link to="/document-management/documents">
              {" "}
              {/* Replace "/previous-page" with your target route */}
              <i className="pi pi-angle-left"></i>
            </Link>
          </div>
          <div className="content">
            <h3>Crew Certification (STCW)</h3>
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
            onClick={(e) => navigate(`/document-management/documents/edit`)}
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
            <div className="v-grid v-grid-two-column">
              <div className="item">
                <div className="card flex justify-content-center">
                  <Card
                    className="details-card"
                    title={
                      <div className="card-header">
                        <span>General Information</span>
                        <div className="three-dot-menu"></div>
                      </div>
                    }
                  >
                    <div className="details-overview">
                      <div className="details-content">
                        <div className="details-content-lable">
                          Document Name
                        </div>
                        <div className="details-content-text">
                          Crew Certification (STCW)
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Document Name
                        </div>
                        <div className="details-content-text">
                          Certification
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Associated vessel
                        </div>
                        <div className="details-content-text">
                          The Black Pearl
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">
                          Issuing Authority
                        </div>
                        <div className="details-content-text">
                          devon@yachtcrewcenter.com
                        </div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Issue Date</div>
                        <div className="details-content-text">12/10/2024</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Expiry Date</div>
                        <div className="details-content-text">26/12/2025</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Upload Date</div>
                        <div className="details-content-text">26/12/2025</div>
                      </div>
                      <div className="details-content">
                        <div className="details-content-lable">Status</div>
                        <div
                          className="details-content-text"
                          style={{ color: "#22C55E" }}
                        >
                          Valid
                        </div>
                      </div>

                      <div className="detail-item flex align-items-center">
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
                <div className="activity-log p-d-flex p-flex-column p-gap-2">
                  <Card title="Activity Log">
                    <DataTable
                      value={data}
                      autoLayout
                    >
                      <Column field="userName" header="User Name" />
                      <Column field="date" header="Date" />
                      <Column field="time" header="Time" />
                      <Column header="Activity" body={activityTemplate} />
                    </DataTable>
                  </Card>
                </div>
              </div>

              <div className="item">
                <div className="card flex justify-content-center">
                  <Card style={cardStyle}>
                    <div style={headerStyle}>Reminder</div>
                    <Divider />
                    <div style={renewalStyle}>
                      <span>Next Renewal on</span>
                      <span>12/10/2024</span>
                      <img
                        src={wallimage}
                        alt="Clock Icon"
                        style={imageStyle}
                      />
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

export default DocumentDetails;
