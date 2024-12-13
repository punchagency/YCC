import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";

import { RadioButton } from "primereact/radiobutton";

const AddExpense = () => {
  const [vesselName, setVesselName] = useState(null);
  const [category, setCategory] = useState(null);
  const [warranty, setWarranty] = useState(null);
  const [date, setDate] = useState(null);
  const [day, setDay] = useState(null);
  const [amount, setAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState();
  const [expenseReport, setExpenseReport] = useState(null);

  const [department, setDepartment] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [maintenanceFrequency, setMaintenanceFrequency] = useState(null);
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

  const categories = [{ name: "Fuel" }, { name: "Crew" }];

  const paymentMethods = [{ name: "Credit Card" }, { name: "Cash" }];

  const paymentStatuses = [{ name: "Paid" }, { name: "Unpaid" }];

  const departments = [{ name: "Engineering" }, { name: "IT Engineer" }];

  const maintenanceFrequencies = [{ name: "Monthly" }, { name: "Yearly" }];

  const goExpensePage = () => {
    navigate("/finance-management/expense");
  };

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
            <h3>Add New Expense</h3>
            <p>All all details here</p>
          </div>
        </div>
        <div className="sub-header-right">
          <Button
          onClick={goExpensePage}
            label="Cancel"
            icon="pi pi-times-circle"
            severity="secondary"
            outlined
            className="p-button-secondary mr-3"
          />
          <Button
            onClick={goExpensePage}
            label="Save"
            icon="pi pi-save"
            className="p-button-primary mr-3"
            type="button"
          />
          <Button
            onClick={goExpensePage}
            label="Save & Add Another"
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
              <h5>Add Expense</h5>
              <form>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <label htmlFor="vesselName">Vessel Name</label>
                    <InputText
                      id="vesselName"
                      placeholder="Enter vessle name"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="category">Expense Category</label>
                    <Dropdown
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.value)}
                      options={categories}
                      optionLabel="name"
                      placeholder={
                        categories.length > 0 ? categories[0].name : "Select"
                      }
                      className="w-full mt-2"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="date">Date of Expense</label>
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
                    <label htmlFor="amount">Amount</label>
                    <InputText
                      id="amount"
                      placeholder="$"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <Dropdown
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.value)}
                      options={paymentMethods}
                      optionLabel="name"
                      placeholder={
                        paymentMethods.length > 0
                          ? paymentMethods[0].name
                          : "Select"
                      }
                      className="w-full mt-2"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="vendor">Vendor/Payee</label>
                    <InputText
                      id="vendor"
                      placeholder="Enter Vendor Name"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="paymentStatus">Payment Status</label>
                    <Dropdown
                      id="paymentStatus"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.value)}
                      options={paymentStatuses}
                      optionLabel="name"
                      placeholder={
                        paymentStatuses.length > 0
                          ? paymentStatuses[0].name
                          : "Select"
                      }
                      className="w-full mt-2"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="department">Department</label>
                    <Dropdown
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.value)}
                      options={departments}
                      optionLabel="name"
                      placeholder={
                        departments.length > 0 ? departments[0].name : "Select"
                      }
                      className="w-full mt-2"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="expenseReport">
                      Expense Description (Notes)
                    </label>
                    <InputTextarea
                      id="expenseReport"
                      value={expenseReport}
                      onChange={(e) => setExpenseReport(e.target.value)}
                      rows={5}
                      cols={10}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="form-container">
              <h5>Frequency</h5>
              <form>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <RadioButton
                      inputId="singleExpense"
                      name="frequency"
                      value="single"
                      onChange={(e) => setFrequency(e.value)}
                      checked={frequency === "single"}
                    />
                    <label htmlFor="singleExpense" className="ml-2">
                      Single Expense
                    </label>
                    <p className="ml-4">A single entry that does not repeat</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <RadioButton
                      inputId="recurringExpense"
                      name="frequency"
                      value="recurring"
                      onChange={(e) => setFrequency(e.value)}
                      checked={frequency === "recurring"}
                    />
                    <label htmlFor="singleExpense" className="ml-2">
                      Recurring Expense
                    </label>
                    <p className="ml-4">Repeats on a monthly or annual basis</p>
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="date">Start Date</label>
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
                    <label htmlFor="date">End Date</label>
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
                    <label htmlFor="maintenanceFrequency">
                      Expense Category
                    </label>
                    <Dropdown
                      id="maintenanceFrequency"
                      value={maintenanceFrequency}
                      onChange={(e) => setCategory(e.value)}
                      options={maintenanceFrequencies}
                      optionLabel="name"
                      placeholder={
                        maintenanceFrequencies.length > 0
                          ? maintenanceFrequencies[0].name
                          : "Select"
                      }
                      className="w-full mt-2"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="uploadDocuments">
                      Upload Supporting Documents
                    </label>
                    <div className="flex align-content-center">
                      <div className="flex flex-wrap gap-1">
                        {uploadedFiles.map((file, index) => {
                          const isImage =
                            file.type.includes("image") ||
                            file.name
                              .toLowerCase()
                              .endsWith((".jpg", ".jpeg", ".png", ".gif"));

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

export default AddExpense;
