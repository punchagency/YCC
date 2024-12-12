import React from 'react'
import LeftMenu from '../../components/menu'
import AdminHeader from '../../components/header'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';



const RoleDetails = () => {
    const navigate = useNavigate();

    const goRolePage = () => {
        navigate("/user-management/role");
      };
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="arrow">
            <Link to="/user-management/role">
              <i className="pi pi-angle-left"></i>
            </Link>
          </div>
          <div className="content">
            <h3>Captain/Manager</h3>
            <p>All informations are below</p>
          </div>
        </div>
        <div className="sub-header-right">
       
        <Button
              onClick={goRolePage}
              label="Save"
              icon="pi pi-save"
              className="p-button-primary"
              type="button"
            />
        </div>
      </div>
      <div className="card-wrapper-gap">
    <div className="card-wraper">
    <div className="p-p-4">
<div>
  <h5 className='text-base m-0 mb-2'>Role Information</h5>
  <div style={{ lineHeight: '2' }}>
    <div className="detail-item flex gap-6">
      <span className='labelName'>Role Name</span><span className='labelValue'>Captain/Manager</span>
    </div>
    <div className="detail-item flex gap-6">
    <span className='labelName'>Permission</span> <span className='labelValue'>demo permission</span>
    </div>
 


    <div className="detail-item flex gap-4">
    <span className='labelName'>Status</span> <span className='labelValue' style={{color:"#22C55E"}}>Active</span>
    </div>




  
 
  </div>
</div>
</div>
    </div>
    </div>
    </>
  )
}

export default RoleDetails