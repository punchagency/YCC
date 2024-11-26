import React from 'react';

const SubHeaderPanel = () => {
    return (
        <div className="flex align-items-center justify-content-between sub-header-panel">
            {/* Left Section: Heading and Subheading */}
            <div className="sub-header-left">
                <h3>Dashboard</h3>
                <p>Overview of all important data</p>
            </div>

            {/* Right Section: Action Button */}
            <div className="sub-header-right">
                {/* <Button label="Action" icon="pi pi-plus" className="p-button-primary" /> */}
            </div>
        </div>
    );
};

export default SubHeaderPanel;

