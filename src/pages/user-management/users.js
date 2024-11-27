import React from 'react';
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';


const Users = () => {
  return (
    <main className="flex h-screen page">
      <LeftMenu />
      <div className='w-full right-panel-component'>
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          {/* Left Section: Heading and Subheading */}
          <div className="sub-header-left">
            <h3>Users</h3>
            <p>list of all users assigned to each role. You can also add new users to a specific role.</p>
          </div>

          {/* Right Section: Action Button */}
          <div className="sub-header-right">
            <div className="p-input-icon-left search mr-3">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    placeholder="Search"
                />
            </div>
            <Button label="Add User" icon="pi pi-plus" className="p-button-primary" />
          </div>
        </div>
        <div className='card-wrapper-gap'>
            dsfsd
        </div>  
      </div>
    </main>
  );
};

export default Users;