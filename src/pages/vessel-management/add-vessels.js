import React, { useState } from "react";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

const AddVassel = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [selectedFlug, setSelectedFlug] = useState(null);
  const [selectedVesselType, setVesselType] = useState(null);
  const [selectedVesselStatus, setVesselStatus] = useState(null);
  const [selectedEngineType, setSelectedEngineType] = useState(null);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [selectedAuthority, setSelectedAuthority] = useState(null);


  const goVasselPage = () => {
    console.log("Navigating to /user-management/users");
    navigate("/user-management/users");
  };

  const nationalities = [
    { name: "American", code: "US" },
    { name: "Indian", code: "IN" },
    { name: "British", code: "UK" },
    { name: "Australian", code: "AU" },
  ];

  const vessel = [
    { name: "Motor Yacht" },
    { name: "Sailboat Yacht" }
  ];

  const status = [
    { name: "Active" },
    { name: "Inactive" }
  ];

  const engine = [
    { name: "Gas Turbine" },
    { name: "Oil Turbine" }
  ];

  const inspection = [
    { name: "Flag State Inspection 1" },
    { name: "Flag State Inspection 2" }
  ];

  const authority = [
    { name: "USCG" },
    { name: "USCB" }
  ];

  

  return (
    <main className="flex h-screen page">
      <LeftMenu />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="arrow">
              <Link to="/vessel-management/vessels">
                <i className="pi pi-angle-left"></i>
              </Link>
            </div>
            <div className="content">
              <h3>Add New Vessel</h3>
              <p>Enter the user detail and create an user</p>
            </div>
          </div>
          <div className="sub-header-right">
            <Button
              label="Cancel"
              icon="pi pi-times-circle"
              severity="secondary"
              outlined
              className="p-button-secondary mr-3"
            />
            <Button
              onClick={goVasselPage}
              label="Save"
              icon="pi pi-save"
              className="p-button-primary"
              type="button"
            />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <TabView className="v-tab v-tab-two">
            <TabPanel header="General information">
              <div className="form-container">
                <TabView>
                  <TabPanel header="Basic Details">
                      <div className="form-container">
                          <h5>Basic Details</h5>
                          <form>
                              <div className="grid">
                                  <div className="col-6">
                                    <label htmlFor="dreamer">Vessel Name</label>
                                    <InputText
                                      id="dreamer"
                                      placeholder="Sea Dreamer"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label htmlFor="flagState">Flag State</label>
                                    <Dropdown
                                      id="flagState"
                                      value={selectedFlug}
                                      onChange={(e) => setSelectedFlug(e.value)}
                                      options={nationalities}
                                      optionLabel="name"
                                      placeholder="Select a nationality"
                                      className="w-full mt-2"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label htmlFor="registration">Registration Number</label>
                                    <InputText
                                      id="registration"
                                      placeholder="Enter Registration Number"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label htmlFor="vesselType">Vessel Type</label>
                                    <Dropdown
                                      id="vesselType"
                                      value={selectedVesselType}
                                      onChange={(e) => setVesselType(e.value)}
                                      options={vessel}
                                      optionLabel="name"
                                      placeholder="Select a Vessel Type"
                                      className="w-full mt-2"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label htmlFor="yearBuilt">Year Built</label>
                                    <InputText
                                      id="yearBuilt"
                                      placeholder="Enter Year Built"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label htmlFor="manufacturer">Manufacturer</label>
                                    <InputText
                                      id="manufacturer"
                                      placeholder="Enter Manufacturer"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                  </div>
                                  <div className="col-12">
                                    <label htmlFor="vesselStatus">Vessel Status</label>
                                    <Dropdown
                                      id="vesselStatus"
                                      value={selectedVesselStatus}
                                      onChange={(e) => setVesselStatus(e.value)}
                                      options={status}
                                      optionLabel="name"
                                      placeholder="Select a Vessel Status"
                                      className="w-full mt-2"
                                    />
                                  </div>
                              </div>
                          </form>
                      </div>  
                  </TabPanel>
                  <TabPanel header="Dimensions">
                     <div className="form-container">
                          <h5>Dimensions</h5>
                          <form>
                              <div className="grid">
                                <div className="col-6">
                                    <label htmlFor="length">Length</label>
                                    <InputText
                                      id="length"
                                      placeholder="10 meters"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="beam">Beam</label>
                                    <InputText
                                      id="beam"
                                      placeholder="5 meters"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="draft">Draft</label>
                                    <InputText
                                      id="draft"
                                      placeholder="2.1 meters"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="tonnage">Gross Tonnage</label>
                                    <InputText
                                      id="tonnage"
                                      placeholder="200 GT"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                </div>
                            </div>
                          </form>
                     </div> 
                  </TabPanel>
                  <TabPanel header="Engine Information & Capacity">
                      <div className="form-container">
                          <h5>Engine Information & Capacity</h5>
                          <form>
                              <div className="grid">
                                  <div className="col-6">
                                    <label htmlFor="engineType">Engine Type and Power</label>
                                    <Dropdown
                                      id="engineType"
                                      value={selectedEngineType}
                                      onChange={(e) => setSelectedEngineType(e.value)}
                                      options={engine}
                                      optionLabel="name"
                                      placeholder="Select Engine Type and Power"
                                      className="w-full mt-2"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label htmlFor="engines">Number of Engines</label>
                                    <InputText
                                      id="engines"
                                      placeholder="Enter Number of Engines"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                  </div> 
                                  <div className="col-12">
                                    <label htmlFor="power">Engine Power</label>
                                    <InputText
                                      id="power"
                                      placeholder="Enter Engine Power"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                  </div>
                              </div>
                          </form>
                      </div>  
                  </TabPanel>
                </TabView>
              </div>
            </TabPanel>
            <TabPanel header="Compliance">
              <div className="form-container">
                <TabView>
                  <TabPanel header="Inspection Details & Outcome">
                      <div className="form-container">
                          <h5>Inspection Details</h5>
                          <form>
                              <div className="grid">
                                  <div className="col-6">
                                    <label htmlFor="inspection">Inspection Details</label>
                                    <Dropdown
                                      id="inspection"
                                      value={selectedInspection}
                                      onChange={(e) => setSelectedInspection(e.value)}
                                      options={inspection}
                                      optionLabel="name"
                                      placeholder="Select a Flag State Inspection"
                                      className="w-full mt-2"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label htmlFor="flagState">Inspection Date</label>
                                    <Calendar
                                      id="dob"
                                      value={date}
                                      onChange={(e) => setDate(e.value)}
                                      showIcon
                                      placeholder="Date of birth"
                                      className="w-full mt-2 p-input-calender"
                                    />
                                  </div>

                                  <div className="col-6">
                                    <label htmlFor="authority">Issuing Authority</label>
                                    <Dropdown
                                      id="authority"
                                      value={selectedAuthority}
                                      onChange={(e) => setSelectedAuthority(e.value)}
                                      options={authority}
                                      optionLabel="name"
                                      placeholder="Select a Issuing Authority"
                                      className="w-full mt-2"
                                    />
                                  </div>

                                  <div className="col-6">
                                    <label htmlFor="inspectorName">Inspector’s Name</label>
                                    <InputText
                                      id="inspectorName"
                                      placeholder="Enter Inspector’s Name"
                                      className="w-full mt-2 p-inputtext p-component"
                                    />
                                  </div>
                              </div>
                          </form>
                      </div>  
                  </TabPanel>
                  <TabPanel header="Corrective Action Plan">
                     ssdfdsf
                  </TabPanel>
                  <TabPanel header="Compliance Verification">
                     ghjghjgh
                  </TabPanel>
                  <TabPanel header="Next Scheduled">
                     yoiuioui
                  </TabPanel>
                </TabView>
              </div>
            </TabPanel>
            <TabPanel header="Maintenance history">
              <div className="form-container">
                <h3>Medical Information</h3>
                <form className="grid"></form>
              </div>
            </TabPanel>
            <TabPanel header="Financial Information">
              <div className="form-container">
                <h3>Emergency Contact</h3>
                <form className="grid"></form>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </main>
  );
};

export default AddVassel;
