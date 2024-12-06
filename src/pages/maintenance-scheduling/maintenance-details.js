
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";

import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { TabPanel, TabView } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const MaintenanceDetails = () => {


  return (
    <main className="flex h-screen page">
      <LeftMenu />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="arrow">
              <Link to="/maintenance-scheduling/maintenance">
                <i className="pi pi-angle-left"></i>
              </Link>
            </div>
            <div className="content">
              <h3>Add New Task</h3>
              <p>Enter the user detail and create an user</p>
            </div>
          </div>
        </div>
        <div className="card-wrapper-gap">
    

        <TabView>
  <TabPanel header="Overview">
   
    <div className="task-details-container">
            <Card className="task-details-card">
                <div className="task-details-grid">
                    {/* Left Column */}
                    <div className="task-details-column">
                        <div className="task-details-item">
                            <strong>Task Title:</strong>
                            <span>Oil Change</span>
                        </div>
                        <div className="task-details-item">
                            <strong>Equipment Name:</strong>
                            <span>Fuel System</span>
                        </div>
                        <div className="task-details-item">
                            <strong>Date:</strong>
                            <span>12/10/2024</span>
                        </div>
                        <div className="task-details-item">
                            <strong>Maintenance Frequency:</strong>
                            <span>Weekly</span>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="task-details-column">
                        <div className="task-details-item">
                            <strong>Vessel Name:</strong>
                            <span>Sea Dreamer</span>
                        </div>
                        <div className="task-details-item">
                            <strong>Assigned Crew:</strong>
                            <span>Courtney Henry</span>
                        </div>
                        <div className="task-details-item">
                            <strong>Priority Level:</strong>
                            <span>High</span>
                        </div>
                        <div className="task-details-item">
                            <strong>Status:</strong>
                            <Tag value="In Progress" severity="info" />
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                <div className="task-details-notes">
                    <strong>Notes:</strong>
                    <p>
                        Regular oil changes are essential to keep engines running smoothly and prevent wear on internal
                        components.
                    </p>
                </div>

                {/* Download Section */}
                <div className="task-details-download">
                    <i className="pi pi-file-pdf task-details-icon"></i>
                    <Button
                        label="Download"
                        icon="pi pi-download"
                        className="p-button-outlined p-button-secondary"
                    />
                </div>
            </Card>
        </div>
 
  </TabPanel>
</TabView>



        </div>
      </div>
    </main>
  );
};

export default MaintenanceDetails;
