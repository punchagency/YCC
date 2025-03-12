import React from "react";

import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";


const CrewSetting = () => {
  const navigate = useNavigate();
  const goCrewDashboardPage = () => {
    navigate("/crew/dashboard");
  };
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Set</h3>
            <p>Overview</p>
          </div>
        </div>
        <div className="sub-header-right">
          {/* <Button
            label="Cancel"
            onClick={goVasselPage}
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
          /> */}
        </div>
      </div>
      <div className="card-wrapper-gap">
        <TabView className="v-tab v-tab-two">
          <TabPanel header="Account Settings">
            <div className="form-container">

            
                <h5>User Profile</h5>
                <form>
                  <div className="grid">
                    <div className="col-12 md:col-6">
                      <label htmlFor="fname">First Name</label>
                      <InputText
                        id="fname"
                        placeholder="Courtney"
                        className="w-full mt-2 p-inputtext p-component"
                      />
                    </div>

                    <div className="col-12 md:col-6">
                      <label htmlFor="lname">Last Name</label>
                      <InputText
                        id="lname"
                        placeholder="Henry"
                        className="w-full mt-2 p-inputtext p-component"
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="email">Email</label>
                      <InputText
                        id="email"
                        placeholder="courtneyhenry@yachtcrewcenter.com"
                        className="w-full mt-2 p-inputtext p-component"
                      />
                    </div>
                    <div className="flex align-items-center justify-content-between ml-auto mt-4">

                      <div className="actions">
                        <Button
                          label="Cancel"
                          onClick={goCrewDashboardPage}
                          icon="pi pi-times-circle"
                          severity="secondary"
                          outlined
                          className="p-button-secondary mr-3"
                        />
                        <Button
                          onClick={goCrewDashboardPage}
                          label="Save Changes"
                          icon="pi pi-save"
                          className="p-button-primary"
                          type="button"
                        />
                      </div>
                    </div>
                  </div>
                </form>
          


            </div>
          </TabPanel>
          <TabPanel header="Change Password">
            <div className="form-container">

                <h5>Change Password</h5>
                <form>
                  <div className="grid">
                    <div className="col-12">
                      <label htmlFor="oldPassword">Current Password</label>
                      <InputText
                        id="oldPassword"
                        placeholder="Enter Old Password"
                        className="w-full mt-2 p-inputtext p-component"
                      />
                    </div>

                    <div className="col-12 md:col-6">
                      <label htmlFor="newPassword">New Password<span>*</span></label>
                      <InputText
                        id="oldPassword"
                        placeholder="Enter New Password"
                        className="w-full mt-2 p-inputtext p-component"
                      />
                    </div>

                    <div className="col-12 md:col-6">
                      <label htmlFor="confirmPassword">Confirm Password<span>*</span></label>
                      <InputText
                        id="confirmPassword"
                        placeholder="Rewnter your Password"
                        className="w-full mt-2 p-inputtext p-component"
                      />
                    </div>
                    <div className="flex align-items-center justify-content-between ml-auto mt-4">

                      <div className="actions">
                        <Button
                          label="Cancel"
                          onClick={goCrewDashboardPage}
                          icon="pi pi-times-circle"
                          severity="secondary"
                          outlined
                          className="p-button-secondary mr-3"
                        />
                        <Button
                          onClick={goCrewDashboardPage}
                          label="Save Changes"
                          icon="pi pi-save"
                          className="p-button-primary"
                          type="button"
                        />
                      </div>
                    </div>
                  </div>
                </form>
         


            </div>
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default CrewSetting;
