import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import avatar from '../assets/images/avatar.svg';

const AdminHeader = () => {
    const start = (
        <div className="flex align-items-center profile">
            <img src={avatar} alt="Profile" className='profile-image'/>
            <span className="profile-name">Welcome, <strong>Christopher</strong></span>
        </div>
    );

    const end = (
        <Button icon="pi pi-bell" rounded text aria-label="Notifications" className='notifications'/>
    );

    return <Menubar start={start} end={end} />;
};

export default AdminHeader;
