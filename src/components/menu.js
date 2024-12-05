import React from "react";
import { useNavigate } from 'react-router-dom'; 
import { PanelMenu } from "primereact/panelmenu";
import logo from '../assets/images/logo-login.png';

export default function LeftMenu() {
    const navigate = useNavigate();
    const menuItems = [
        { 
            label: "Dashboard", 
            icon: "pi pi-home", 
            command: () => {
                navigate('/dashboard'); // Navigate to the dashboard
            }
        },
        { 
            label: "User Management", 
            icon: "pi pi-users", 
            items: [
                { 
                    label: "Role", 
                    command: () => {
                        navigate('/user-management/role'); // Navigate to the dashboard
                    }
                },
                {   
                    label: "User", 
                    command: () => {
                        navigate('/user-management/users'); // Navigate to the dashboard
                    }
                },
            ]
        },
        { 
            label: "Vessel Management", 
            icon: (
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" className="custom-icon" xmlns="http://www.w3.org/2000/svg">
                    <g mask="url(#mask0_88_13229)">
                        <path d="M3.11719 11.7305L0.615234 16.6523H14.0399C17.0216 16.6523 19.6616 14.6231 20.3848 11.7305H3.11719Z" stroke="#37404C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2.50195 14.1914H11.7305" stroke="#37404C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.11719 9.26953H15.4219L18.2673 11.7305" stroke="#37404C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.57812 4.34766V11.7305" stroke="#37404C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9.26953 9.26953V11.7305" stroke="#37404C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.9609 9.26953V11.7305" stroke="#37404C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.57812 6.80859H10.5L12.9609 9.26953" stroke="#37404C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M4.34766 4.34766H6.80859" stroke="#37404C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                </svg>
            ), 
            items: [
                { 
                    label: "Vessel", 
                    command: () => {
                        navigate('/vessel-management/vessels'); 
                    }
                }
            ]
        },
        { 
            label: "Document Management", 
            icon: "pi pi-file", 
            command: () => console.log("Document clicked")
        },
        { 
            label: "Maintenance scheduling", 
            icon: (
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" className="custom-icon-maintenance" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.355 18.1563C4.69 18.1563 4.06 17.8938 3.57875 17.4213C2.59875 16.4413 2.59875 14.8575 3.57875 13.8775L8.4 9.05626C7.9625 7.35876 8.435 5.53001 9.6775 4.28751C10.9288 3.03626 12.7663 2.54626 14.4725 3.01001C14.7 3.07126 14.875 3.24626 14.9363 3.47376C14.9975 3.70126 14.9362 3.93751 14.77 4.10376L12.6263 6.24751L13.0813 7.91876L14.7525 8.37376L16.8963 6.23001C17.0625 6.06376 17.3075 6.00251 17.5263 6.06376C17.7538 6.12501 17.9288 6.30001 17.99 6.52751C18.4538 8.23376 17.9725 10.0713 16.7125 11.3225C15.47 12.565 13.6413 13.0375 11.9438 12.6L7.1225 17.4213C6.65 17.8938 6.02 18.1563 5.355 18.1563ZM12.845 4.17376C12.005 4.24376 11.2088 4.61126 10.5963 5.22376C9.59875 6.22126 9.275 7.68251 9.75625 9.03001C9.84375 9.26626 9.7825 9.53751 9.59875 9.71251L4.4975 14.8138C4.03375 15.2775 4.03375 16.0388 4.4975 16.5025C4.725 16.73 5.0225 16.8525 5.34625 16.8525C5.66125 16.8525 5.9675 16.73 6.18625 16.5025L11.2875 11.4013C11.4713 11.2175 11.7338 11.165 11.97 11.2438C13.3175 11.7163 14.7788 11.4013 15.7763 10.4038C16.3888 9.79126 16.7475 8.99501 16.8263 8.15501L15.4 9.58126C15.2338 9.74751 14.9888 9.80876 14.7613 9.74751L12.3638 9.09126C12.1363 9.03001 11.9613 8.85501 11.9 8.62751L11.2438 6.23001C11.1825 6.00251 11.2438 5.75751 11.41 5.59126L12.8363 4.16501L12.845 4.17376Z" fill="#424242"/>
                </svg>
            ), 
            items: [
                { label: "Create task", command: () => console.log("Create task clicked") },
                { label: "Schedule calendar", command: () => console.log("Schedule calendar ") },
                { label: "Equipment & parts", command: () => console.log("Schedule calendar ") },
                { label: "Warranty", command: () => console.log("Warranty ") }
            ]
        },
        { 
            label: "Financial management", 
            icon: "pi pi-dollar", 
            items: [
                { label: "Expense", command: () => console.log("Expense clicked") },
                { label: "Invoice", command: () => console.log("Invoice calendar ") }
            ]
        },
        { 
            label: "Compliance tracking", 
            icon: "pi pi-folder-open"
        },
        { 
            label: "Reports", 
            icon: "pi pi-chart-pie"
        },
        { 
            label: "Settings", 
            icon: "pi pi-cog"
        },
    ];

    return (
        <div className="left-menu">
            <div className='flex justify-content-center align-items-center logo-wraper'>
                <div className='logo'>
                    <a href="/dashboard">
                        <img src={logo} alt="Company logo" className='image-full' />
                    </a>
                </div>
            </div>
            <PanelMenu model={menuItems} />
        </div>
    );
}
