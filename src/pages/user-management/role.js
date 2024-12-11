import React from 'react';
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import captain from '../../assets/images/captain1.svg'; 
import crew from '../../assets/images/mechanic1.svg'; 
import hod from '../../assets/images/HOD.svg'; 


const Role = () => {
  return (
    <main className="flex h-screen page">
      <LeftMenu role="Captain/Manager" />
      <div className='w-full right-panel-component'>
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          {/* Left Section: Heading and Subheading */}
          <div className="sub-header-left">
            <h3>Roles</h3>
            <p>Lists of different roles with accessibility </p>
          </div>

          {/* Right Section: Action Button */}
          <div className="sub-header-right">
            <Button label="Add Roles" icon="pi pi-plus" className="p-button-primary" />
          </div>
        </div>
        <div className='card-wrapper-gap'>
          <div className="card">
            <div className="card-wraper">
              <Card className="mb-4 role-card">
                <div className="card-header flex align-items-center">
                  <img src={captain} alt="Icon" className="card-icon" />
                  <div className="card-heading">
                    <h3 className="title m-0">Captain/Manager</h3>
                    <p className="subtitle m-0">Role</p>
                  </div>
                </div>
                <p className="m-0 card-content">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                </p>
              </Card>
              <Card className="mb-4 role-card">
                <div className="card-header flex align-items-center">
                  <img src={crew} alt="Icon" className="card-icon" />
                  <div className="card-heading">
                    <h3 className="title m-0">Crew Member</h3>
                    <p className="subtitle m-0">Role</p>
                  </div>
                </div>
                <p className="m-0 card-content">
                  Crew has access mainly related to task execution and maintenance management, along with access to necessary documentation and notifications.
                </p>
              </Card>
              <Card className="role-card">
                <div className="card-header flex align-items-center">
                  <img src={hod} alt="Icon" className="card-icon" />
                  <div className="card-heading">
                    <h3 className="title m-0">Head of Department</h3>
                    <p className="subtitle m-0">Role</p>
                  </div>
                </div>
                <p className="m-0 card-content">
                    The Yacht Head of Department (HOD) is responsible for overseeing their department's operations, ensuring all tasks are executed efficiently, safely, and to the highest standard of service. They manage crew members, coordinate schedules, and ensure compliance with yacht protocols while maintaining seamless communication with the captain and other departments.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Role;