import React, { useState } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from "primereact/tabview";

const EquipmentDetails = () => {
  // Access the userId from the URL
  useParams();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const editEquipmentPage = () => {
    navigate("/maintenance-scheduling/equipment/edit");
  };

  // You can now use the userId to fetch or display the specific user details
  return (
    <main className="flex h-screen page">
      <LeftMenu role="Captain/Manager" />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className='arrow'>
              <Link to="/maintenance-scheduling/equipment">
                <i className="pi pi-angle-left"></i>
              </Link>
            </div>
            <div className='content'>
              <h3>Main Engine</h3>
              <p>All informations are below</p>
            </div>
          </div>
          <div className="sub-header-right">
            <Button label="Edit" icon="pi pi-user-edit" severity="secondary" outlined className="p-button-secondary" onClick={editEquipmentPage} />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="tabview-detaols">
            <TabPanel header="Overview">
              <div className="card-wraper">
                <div className="p-p-4">
                  <div>
                    <h5 className='text-base'>General Information</h5>
                    <div style={{ lineHeight: '2' }}>
                      <div className="detail-item flex gap-6">
                        <span className='labelName'>Equipment</span><span className='labelValue'>Main Engine</span>
                      </div>
                      <div className="detail-item flex gap-6">
                        <span className='labelName'>Category</span> <span className='labelValue'>Engine</span>
                      </div>
                      <div className="detail-item flex gap-6">
                        <span className='labelName'>Manufacturer</span> <span className='labelValue'>Caterpillar</span>
                      </div>
                      <div className="detail-item flex gap-6">
                        <span className='labelName'> Model Number </span> <span className='labelValue'>3516E</span>
                      </div>
                      <div className="detail-item flex gap-6">
                        <span className='labelName'>Serial Number</span> <span className='labelValue'>12345-CAT</span>
                      </div>
                      <div className="detail-item flex gap-6">
                        <span className='labelName'>Last Service Date</span><span className='labelValue'>10/15/2024	</span>
                      </div>
                      <div className="detail-item flex gap-4">
                        <span className='labelName'>Status</span> <span className='labelValue' style={{ color: "#22C55E" }}>In Use</span>
                      </div>



                      <div className="detail-item flex gap-4">
                        <span className='labelName'>Note</span> <span className='labelValue'>Regular oil changes are essential to keep engines running smoothly and prevent wear on internal components</span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>


            </TabPanel>
          </TabView>
        </div>
      </div>
    </main>
  );
};

export default EquipmentDetails;
