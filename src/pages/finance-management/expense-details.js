import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import PDFIcon from "../../assets/images/pdf.svg";

const ExpenseDetails = () => {
  const navigate = useNavigate();
  useParams();
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

  const editEquipmentPage = () => {
    navigate("/finance-management/expense/edit");
  };

  // You can now use the userId to fetch or display the specific user details
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="arrow">
            <Link to="/finance-management/expense">
              <i className="pi pi-angle-left"></i>
            </Link>
          </div>
          <div className="content">
            <h3>Fuel</h3>
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
            onClick={editEquipmentPage}
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
                      <span className="labelName">Vessel Name</span>
                      <span className="labelValue">Sea Dreamer</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Expense Category</span>{" "}
                      <span className="labelValue">12/10/2024</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Amount</span>{" "}
                      <span className="labelValue">$200</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName"> Payment Method</span>
                      <span className="labelValue">Credit Card</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Vendor/Payee</span>
                      <span className="labelValue">Mazagon</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Payment Status</span>{" "}
                      <span className="labelValue">Paid</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">Department</span>{" "}
                      <span className="labelValue">Engineering</span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">
                        Expense Description (Notes)
                      </span>
                      <span className="labelValue">
                        Nullam eu varius augue. Suspendisse vel mauris et elit
                        maximus egestas.
                      </span>
                    </div>
                    <div className="detail-item flex gap-6">
                      <span className="labelName">
                        Warranty expiration Soon Threshold ( Reminder)
                      </span>
                      <span className="labelValue">10/15/2024 </span>
                    </div>

                    <div className="detail-item flex gap-6">
                      <span className="labelName">Frequency</span>
                      <span className="labelValue">Recurring Expense</span>
                    </div>

                    <div className="detail-item flex gap-6">
                      <span className="labelName">Start Date</span>
                      <span className="labelValue"> 12/10/2024</span>
                    </div>

                    <div className="detail-item flex gap-6">
                      <span className="labelName">End Date</span>
                      <span className="labelValue"> 13/10/2024</span>
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
                                    <img src={PDFIcon} alt=""/>
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
                          className="p-button-outlined p-button-sm"
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

export default ExpenseDetails;
