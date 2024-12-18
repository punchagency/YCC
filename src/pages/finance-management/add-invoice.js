import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";

const AddInvoice = () => {
  const [date, setDate] = useState(null);
  const [day, setDay] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [invoiceNote, setInvoiceNote] = useState(null);

  const currentDate = new Date().toLocaleDateString("en-US");

  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newUploadedFiles = files.map((file) => ({
      name: file.name,
      type: file.type || "",
      url: URL.createObjectURL(file), // Create a temporary URL for images
    }));

    // Update state with selected files
    setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);
  };

  // Remove a file from the uploaded list
  const removeFile = (fileName) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const statuses = [{ name: "Paid" }, { name: "Unpaid" }];

  const days = [{ name: "Days" }, { name: "Months" }];
  const goInvoicePage = () => {
    navigate("/finance-management/invoice");
  };

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="arrow">
            <Link to="/finance-management/invoice">
              <i className="pi pi-angle-left"></i>
            </Link>
          </div>
          <div className="content">
            <h3>Add New Invoice</h3>
            <p>All all details here</p>
          </div>
        </div>
        <div className="sub-header-right">
          <Button
            label="Cancel"
            onClick={goInvoicePage}
            icon="pi pi-times-circle"
            severity="secondary"
            outlined
            className="p-button-secondary mr-3"
          />

          <Button
            onClick={goInvoicePage}
            label="Save & Add Another"
            icon="pi pi-file-export"
            className="p-button-primary mr-3"
            type="button"
          />
          <Button
            onClick={goInvoicePage}
            label="Save"
            icon="pi pi-save"
            className="p-button-primary mr-3"
            type="button"
          />
        </div>
      </div>
      <div className="card-wrapper-gap">
        <div className="card">
          <div className="card-wraper">
            <div className="form-container">
              <h5>Add Warranty</h5>
              <form>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <label htmlFor="invoiceNo">Invoice number</label>
                    <InputText
                      id="invoiceNo"
                      placeholder="Enter invoice number"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="vendorName">Vendor/Contractor Name</label>
                    <InputText
                      id="vendorName"
                      placeholder="12345-CAT"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="date">Invoice Date</label>
                    <Calendar
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.value)}
                      showIcon
                      placeholder={currentDate}
                      className="w-full mt-2 p-input-calender"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="date">Due Date</label>
                    <Calendar
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.value)}
                      showIcon
                      placeholder={currentDate}
                      className="w-full mt-2 p-input-calender"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="amountDue">Amount Due</label>
                    <InputText
                      id="amountDue"
                      placeholder="$"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="paymentStatus">Payment Status</label>
                    <Dropdown
                      id="paymentStatus"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.value)}
                      options={statuses}
                      optionLabel="name"
                      placeholder="Choose Status"
                      className="w-full mt-2"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="due">Due Soon Threshold ( Reminder)</label>
                    <InputText
                      id="due"
                      placeholder="2"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>

                  <div className="col-12 md:col-6 mt-3">
                    <Dropdown
                      id="day"
                      value={day}
                      onChange={(e) => setDay(e.value)}
                      options={days}
                      optionLabel="name"
                      placeholder={days.length > 0 ? days[0].name : "Select"}
                      className="w-full mt-2"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="invoiceNote">
                      Service/Item Description (Notes)
                    </label>
                    <InputTextarea
                      id="invoiceNote"
                      value={invoiceNote}
                      onChange={(e) => setInvoiceNote(e.target.value)}
                      rows={5}
                      cols={10}
                      className="w-full mt-2"
                    />
                  </div>

                  <div className="upload-container">
                    <label htmlFor="uploadDocuments">
                      Upload Supporting Documents
                    </label>
                    <div className="flex align-content-center mt-3">
                      <div className="flex flex-wrap gap-1">
                        {uploadedFiles.map((file, index) => {
                          const isImage =
                            file.type.includes("image") ||
                            file.name.toLowerCase().endsWith(".jpg") ||
                            file.name.toLowerCase().endsWith(".jpeg") ||
                            file.name.toLowerCase().endsWith(".png") ||
                            file.name.toLowerCase().endsWith(".gif");

                          return (
                            <div key={index} className="file-item">
                              {isImage ? (
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="file-icon"
                                />
                              ) : (
                                <i className="pi pi-file-pdf file-icon"></i>
                              )}
                              <span
                                className="uploadfiles"
                                onClick={() => removeFile(file.name)}
                              >
                                <i className="pi pi-times"></i>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <label
                        htmlFor="file-upload"
                        className="custom-upload-button"
                      >
                        <i className="pi pi-upload mr-2"></i>Upload
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.gif"
                        className="file-upload-input"
                        onChange={handleFileSelect}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddInvoice;
