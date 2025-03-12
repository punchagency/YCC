import React from 'react';
import { Link } from 'react-router-dom';

const CrewSidebar = () => {
  return (
    <div className="crew-sidebar">
      <nav>
        <ul>
          <li>
            <Link to="/crew/dashboard">
              <i className="pi pi-home"></i>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/crew/documentation">
              <i className="pi pi-file"></i>
              Documentation Access
            </Link>
          </li>
          <li>
            <Link to="/crew/tasks">
              <i className="pi pi-calendar"></i>
              Task Schedule
            </Link>
          </li>
          <li>
            <Link to="/crew/settings">
              <i className="pi pi-cog"></i>
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CrewSidebar; 