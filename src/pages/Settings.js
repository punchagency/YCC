import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';


const Settings = () => {

  const navigate = useNavigate()
  const goDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <main className="flex h-screen page">
      {/* <LeftMenu role="Captain" /> */}
      <div className="w-full right-panel-component">
        {/* <AdminHeader /> */}
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="arrow">
              <Link to="/dashboard">
                <i className="pi pi-angle-left"></i>
              </Link>
            </div>
            <div className="content">
              <h3>Settings</h3>
              
            </div>
          </div>
          <div className="sub-header-right">
            <Button
              onClick={goDashboard}
              label="Cancel"
              icon="pi pi-times-circle"
              severity="secondary"
              outlined
              className="p-button-secondary mr-3"
            />
            <Button
              onClick={goDashboard}
              label="Save"
              icon="pi pi-save"
              className="p-button-primary"
              type="button"
            />
          </div>
        </div>
        <div className='card-wrapper-gap'>
          <div className="card">
            <div className="card-wraper">
              <div className="form-container">
                <h5>Change Password</h5>
                <form>
                  <div className="grid">
                    <div className="col-12">
                      <label htmlFor="oldPassword">Old Password</label>
                      <InputText
                        id="oldPassword"
                        placeholder="Enter Old Password"
                        className="w-full mt-2 p-inputtext p-component"
                      />
                    </div>

                    <div className="col-12 md:col-6">
                      <label htmlFor="newPassword">New Password</label>
                      <InputText
                        id="oldPassword"
                        placeholder="Enter New Password"
                        className="w-full mt-2 p-inputtext p-component"
                      />
                    </div>

                    <div className="col-12 md:col-6">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <InputText
                        id="confirmPassword"
                        placeholder="Rewnter your Password"
                        className="w-full mt-2 p-inputtext p-component"
                      />
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
