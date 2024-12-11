
import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import { useNavigate } from "react-router-dom";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from 'primereact/skeleton';
import { OverlayPanel } from 'primereact/overlaypanel';

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [filteredVessels, setFilteredVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null); 

  // State for filters
  const [selectedType, setSelectedType] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedRoles = [
        { id: 1, name: "Captain/Manager",permission:"demo permission", status: "Active" },
        { id: 2, name: "Crew Manager",permission:"demo permission", status: "Inactive" },
        { id: 3, name: "HOD",permission:"demo permission", status: "Active" },

       ];
       
   
       setRoles(fetchedRoles);
       setFilteredVessels(fetchedRoles); 
       setLoading(false);
     }, 500);;
  }, []);




  const goToRolePage = () => {
    navigate("/user-management/roles");
  };

  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-rounded p-button-text"
        onClick={(e) => menuRef.current.toggle(e)}
      />
      <OverlayPanel ref={menuRef} dismissable className="datatable-overlaypanel">
        <Button
          label="Edit"
          icon="pi pi-pencil"
          className="p-button-text w-full"
          onClick={() => console.log('Edit', rowData)}
        />
           <Button
          label="Update"
          icon="pi pi-list-check"
          className="p-button-text w-full"
          onClick={() => console.log('Update', rowData)}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-text w-full"
          onClick={() => console.log('Delete', rowData)}
        />
         <Button
          label="Renew"
          icon="pi pi-refresh"
          className="p-button-text w-full"
          onClick={() => console.log('Renew', rowData)}
        />
        
      </OverlayPanel>
    </>
  );

  const skeletonTemplate = () => (
    <>
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="10%" />
    </>
  );

  return (
    <main className="flex h-screen page">
      <LeftMenu role="Captain/Manager" />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Roles</h3>
            <p>List of all Roles</p>
          </div>
          <div className="sub-header-right flex align-items-center">
           
            <Button
              label="Save"
              icon="pi pi-save"
              onClick={goToRolePage}
              className="p-button-primary"
            />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <DataTable
            value={filteredVessels}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            onRowClick={(e) => navigate(`/vessel-management/vessels/${e.data.id}`)}
            rowClassName="pointer-row"
          >
            <Column field="name" header="Role Name" />
            <Column field="permission" header="Permission" />
           
            <Column
              field="status"
              header="Status"
              body={(rowData) => (
                <span
                  style={{
                    backgroundColor: rowData.status === "Active" ? "#CAF1D8" : "#EF4444",
                    color: rowData.status === "Active" ? "#256029" : "#FFFFFF",
                    fontWeight: "bold",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    display: "inline-block",
                  }}
                >
                  {rowData.status}
                </span>
              )}
            />
            <Column body={loading ? skeletonTemplate : actionBodyTemplate} style={{ width: '10%' }} />
          </DataTable>
        </div>
      </div>
    </main>
  );
};

export default Role;
