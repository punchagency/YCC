import React, { useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import avatar from '../assets/images/avatar.svg';
import { Menu } from 'primereact/menu';

const AdminHeader = () => {
    const menuRight = useRef(null);
    const items = [
        {
            label: 
                <div className='flex align-items-center justify-content-between'>
                    <h4>Notifications</h4>
                    <Button label="Mark all read" text />
                </div>,
            items: [
                {
                    label: 'Refresh',
                    icon: 'pi pi-refresh'
                },
                {
                    label: 'Export',
                    icon: 'pi pi-upload'
                }
            ]
        }
    ];
    const start = (
        <div className="flex align-items-center profile">
            <img src={avatar} alt="Profile" className='profile-image'/>
            <span className="profile-name">Welcome, <strong>Christopher</strong></span>
        </div>
    );

    const end = (
        // <Button icon="pi pi-bell" rounded text aria-label="Notifications" className='notifications'/>
        <>
            <Menu className="notification-menu" model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
            <Button 
                icon="pi pi-bell" 
                className="notifications" 
                onClick={(event) => menuRight.current.toggle(event)} 
                aria-controls="popup_menu_right" 
                aria-haspopup
                rounded 
            />
        </>
    );

    return <Menubar start={start} end={end} />;
};

export default AdminHeader;
