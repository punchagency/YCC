import React from "react";
import { useNavigate } from "react-router-dom";
import { PanelMenu } from "primereact/panelmenu";
import { Button } from "primereact/button";
import { useUser } from "../context/userContext";
import logo from "../assets/images/logo-login.png";
import orderLogo from "../assets/images/crew/order1.png";
import financeLogo from "../assets/images/crew/financeLogo.png";
import complianceLogo from "../assets/images/crew/complianceLogo.png";
import reportLogo from "../assets/images/crew/reportLogo.png";
import settingsLogo from "../assets/images/crew/settingsLogo.png";
import homeLogo from "../assets/images/crew/homeLogo.png";
import helpLogo from "../assets/images/crew/info.png";
import contactLogo from "../assets/images/crew/shape.png";
import logoutLogo from "../assets/images/crew/logout.png";

const LeftMenu = ({ role, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  // Define menu items for each role
  const menuItemsCaptain = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      command: () => {
        navigate("/dashboard"); // Navigate to the dashboard
      },
    },
    {
      label: "Crew Management",
      icon: "pi pi-users",
      items: [
        {
          label: "Head of Department",
          command: () => {
            navigate("/crew-management/role"); // Navigate to the dashboard
          },
        },
        {
          label: "Crew",
          command: () => {
            navigate("/crew-management/crews"); // Navigate to the dashboard
          },
        },
      ],
    },
    {
      label: "Vessel Management",
      icon: (
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          className="custom-icon"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g mask="url(#mask0_88_13229)">
            <path
              d="M3.11719 11.7305L0.615234 16.6523H14.0399C17.0216 16.6523 19.6616 14.6231 20.3848 11.7305H3.11719Z"
              stroke="#37404C"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2.50195 14.1914H11.7305"
              stroke="#37404C"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.11719 9.26953H15.4219L18.2673 11.7305"
              stroke="#37404C"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.57812 4.34766V11.7305"
              stroke="#37404C"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.26953 9.26953V11.7305"
              stroke="#37404C"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.9609 9.26953V11.7305"
              stroke="#37404C"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.57812 6.80859H10.5L12.9609 9.26953"
              stroke="#37404C"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.34766 4.34766H6.80859"
              stroke="#37404C"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      ),
      items: [
        {
          label: "Vessel",
          command: () => {
            navigate("/vessel-management/vessels");
          },
        },
        {
          label: "Schedule calendar",
          command: () => {
            navigate("/vessel-management/schedule-calendar");
          },
        },
      ],
    },
    {
      label: "Maintenance",
      icon: (
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          className="custom-icon-maintenance"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.355 18.1563C4.69 18.1563 4.06 17.8938 3.57875 17.4213C2.59875 16.4413 2.59875 14.8575 3.57875 13.8775L8.4 9.05626C7.9625 7.35876 8.435 5.53001 9.6775 4.28751C10.9288 3.03626 12.7663 2.54626 14.4725 3.01001C14.7 3.07126 14.875 3.24626 14.9363 3.47376C14.9975 3.70126 14.9362 3.93751 14.77 4.10376L12.6263 6.24751L13.0813 7.91876L14.7525 8.37376L16.8963 6.23001C17.0625 6.06376 17.3075 6.00251 17.5263 6.06376C17.7538 6.12501 17.9288 6.30001 17.99 6.52751C18.4538 8.23376 17.9725 10.0713 16.7125 11.3225C15.47 12.565 13.6413 13.0375 11.9438 12.6L7.1225 17.4213C6.65 17.8938 6.02 18.1563 5.355 18.1563ZM12.845 4.17376C12.005 4.24376 11.2088 4.61126 10.5963 5.22376C9.59875 6.22126 9.275 7.68251 9.75625 9.03001C9.84375 9.26626 9.7825 9.53751 9.59875 9.71251L4.4975 14.8138C4.03375 15.2775 4.03375 16.0388 4.4975 16.5025C4.725 16.73 5.0225 16.8525 5.34625 16.8525C5.66125 16.8525 5.9675 16.73 6.18625 16.5025L11.2875 11.4013C11.4713 11.2175 11.7338 11.165 11.97 11.2438C13.3175 11.7163 14.7788 11.4013 15.7763 10.4038C16.3888 9.79126 16.7475 8.99501 16.8263 8.15501L15.4 9.58126C15.2338 9.74751 14.9888 9.80876 14.7613 9.74751L12.3638 9.09126C12.1363 9.03001 11.9613 8.85501 11.9 8.62751L11.2438 6.23001C11.1825 6.00251 11.2438 5.75751 11.41 5.59126L12.8363 4.16501L12.845 4.17376Z"
            fill="#424242"
          />
        </svg>
      ),
      items: [
        {
          label: "Create task",
          command: () => {
            navigate("/maintenance-scheduling/maintenance");
          },
        },
        {
          label: "Schedule calendar",
          command: () => {
            navigate("/maintenance-scheduling/schedule-calendar");
          },
        },
        {
          label: "Equipment & parts",
          command: () => {
            navigate("/maintenance-scheduling/equipment");
          },
        },
        // {
        //   label: "Warranty",
        //   command: () => {
        //     navigate("/maintenance-scheduling/warranty");
        //   },
        // },
      ],
    },
    {
      label: "Financial management",
      icon: "pi pi-dollar",
      items: [
        {
          label: "Expense",
          command: () => {
            navigate("/finance-management/expense");
          },
        },
        {
          label: "Invoice",
          command: () => {
            navigate("/finance-management/invoice");
          },
        },
      ],
    },
    {
      label: "Compliance tracking",
      icon: "pi pi-folder-open",
      items: [
        {
          label: "Compliance",
          command: () => {
            navigate("/compliance-management/compliance");
          },
        },
        {
          label: "Document Management",
          command: () => {
            navigate("/document-management/documents");
          },
        },
      ],
    },
    {
      label: "Reports",
      icon: "pi pi-chart-pie",
      command: () => {
        navigate("/reports");
      },
    },
    {
      label: "Settings",
      command: () => {
        navigate("/settings");
      },
      icon: "pi pi-cog",
    },
  ];

  const menuItemsCrew = [
    {
      label: "Dashboard",
      icon: <img src={homeLogo} alt="Dashboard" width={15} height={15} />,
      command: () => {
        navigate("/crew/inventory/dashboard");
      },
    },
    {
      label: "Calendar",
      icon: "pi pi-calendar",
      command: () => {
        navigate("/crew/calendar");
      },
    },
    // Only show these items if user is a supplier
    ...(user?.role === "supplier"
      ? [
          {
            label: "Inventory Management",
            icon: "pi pi-file",
            command: () => {
              navigate("/crew/inventory/inventory");
            },
          },
          {
            label: "Orders",
            icon: <img src={orderLogo} alt="Orders" width={15} height={15} />,
            command: () => {
              navigate("/crew/orders");
            },
          },
        ]
      : []),
      ...(user?.role === "service_provider" ? [
        {
          label: "Bookings",
          icon: <img src={orderLogo} alt="Bookings" width={15} height={15} />,
          command: () => {
            navigate("/crew/bookings");
          },
        },
      ] : []),
    // {
    //   label: "Bookings",
    //   icon: <img src={orderLogo} alt="Bookings" width={15} height={15} />,
    //   command: () => {
    //     navigate("/crew/bookings");
    //   },
    // },
    {
      label: "Financial Management",
      icon: (
        <img
          src={financeLogo}
          alt="Financial Management"
          width={15}
          height={15}
        />
      ),
      command: () => {
        navigate("/crew/financial-management");
      },
    },
    {
      label: "Notifications",
      icon: (
        <img
          src={complianceLogo}
          alt="Compliance Tracking"
          width={15}
          height={15}
        />
      ),
      command: () => {
        navigate("/crew/notifications");
      },
    },
    {
      label: "Reports",
      icon: <img src={reportLogo} alt="Reports" width={15} height={15} />,
      command: () => {
        navigate("/crew/reports");
      },
    },
    {
      label: "Settings",
      icon: <img src={settingsLogo} alt="Settings" width={15} height={15} />,
      command: () => {
        navigate("/crew/settings");
      },
    },
    {
      separator: true,
      style: { margin: "15px 0" },
    },
    {
      label: "Help Centre",
      icon: <img src={helpLogo} alt="Help Centre" width={15} height={15} />,
      command: () => {
        navigate("/crew/help");
      },
    },
    {
      label: "Contact Us",
      icon: <img src={contactLogo} alt="Contact Us" width={15} height={15} />,
      command: () => {
        navigate("/crew/contact");
      },
    },
    {
      label: "Log Out",
      icon: <img src={logoutLogo} alt="Log Out" width={15} height={15} />,
      command: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
      style: { color: "#FF4B4B" },
    },
  ];

  return (
    <div className={`left-menu ${isCollapsed ? "collapsed" : ""}`}>
      <div className="flex justify-content-center align-items-center logo-wraper">
        <div className="logo relative">
          <a href="/dashboard">
            <img src={logo} alt="Company logo" className="image-full" />
          </a>
        </div>
        <Button
          icon="pi pi-times"
          text
          className="p-0 collapse-close-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      {/* <PanelMenu model={menuItems} />
            <PanelMenu model={menuItemsCrew} /> */}
      <div>
        {role === "Captain" ? (
          <PanelMenu model={menuItemsCaptain} />
        ) : role === "Crew Member" ? (
          <PanelMenu model={menuItemsCrew} />
        ) : (
          <p>Role not recognized. Please contact support.</p>
        )}
      </div>
    </div>
  );
};

export default LeftMenu;
