import React, { useState, useEffect, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Skeleton } from 'primereact/skeleton';

const Users = () => {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    setTimeout(() => {
      const fetchedUsers = [
        { id: 1, name: 'John Doe', role: 'Engineer', email: 'john@example.com', contact: '(480) 555-0103', department: 'Engineering', vessel: 'Sea Dreamer'},
        { id: 2, name: 'Jane Smith', role: 'Administrator', email: 'jane@example.com', contact: '(480) 555-0112', department: 'Exterior', vessel: 'Excellence' },
        { id: 3, name: 'Emily Davis', role: 'HOD', email: 'emily@example.com', contact: '(480) 555-0144', department: 'Interior', vessel: 'Serenity' },
        { id: 4, name: 'Michael Brown', role: 'Engineer', email: 'michael@example.com', contact: '(480) 555-0106', department: 'Engineering', vessel: 'Odyssey' },
        { id: 5, name: 'Sarah Wilson', role: 'Administrator', email: 'sarah@example.com', contact: '(480) 555-0133', department: 'Interior', vessel: 'Harmony' },
        { id: 6, name: 'Chris Evans', role: 'HOD', email: 'chris@example.com', contact: '(480) 555-0158', department: 'Exterior', vessel: 'Ocean Pearl' },
        { id: 7, name: 'Laura White', role: 'Administrator', email: 'laura@example.com', contact: '(480) 555-0177', department: 'Captain', vessel: 'Sea Breeze' },
        { id: 8, name: 'Mark Taylor', role: 'Engineer', email: 'mark@example.com', contact: '(480) 555-0160', department: 'Chef', vessel: 'Excellence' },
        { id: 9, name: 'John Doe', role: 'HOD', email: 'john@example.com', contact: '(480) 555-0122', department: 'Engineering', vessel: 'Sea Breeze' },
        { id: 10, name: 'Jane Smith', role: 'Engineer', email: 'jane@example.com', contact: '(480) 555-0199', department: 'Exterior', vessel: 'Harmony' },
        { id: 11, name: 'Emily Davis', role: 'HOD', email: 'emily@example.com', contact: '(480) 555-0100', department: 'Chef', vessel: 'Serenity' },
        { id: 12, name: 'Michael Brown', role: 'Administrator', email: 'michael@example.com', contact: '(480) 555-0155', department: 'Interior', vessel: 'Harmony' },
        { id: 13, name: 'Sarah Wilson', role: 'Engineer', email: 'sarah@example.com', contact: '(480) 555-0185', department: 'Engineering', vessel: 'Sea Dreamer' },
        { id: 14, name: 'Chris Evans', role: 'HOD', email: 'chris@example.com', contact: '(480) 555-0125', department: 'Chef', vessel: 'Excellence' },
        { id: 15, name: 'Laura White', role: 'HOD', email: 'laura@example.com', contact: '(480) 555-0124', department: 'Engineering', vessel: 'Sea Breeze' },
        { id: 16, name: 'Mark Taylor', role: 'Engineer', email: 'mark@example.com', contact: '(480) 555-0141', department: 'Interior', vessel: 'Ocean Pearl' },
      ];
      setUsers(fetchedUsers.slice(0, 20)); 
      setLoading(false);
    }, 500);
  }, []);
  const editUser = () => {
    navigate ("/crew-management/crews/edit")
  }

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
          onClick={editUser}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-text w-full"
          onClick={() => console.log('Delete', rowData)}
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

  // Function to handle row click and navigate to user details page
  const handleRowClick = (rowData) => {
    navigate(`/crew-management/crews/${rowData.id}`); // Navigate to the user details page with the user ID
  };

  const goToAddUserPage = () => {
    navigate("/crew-management/crews/new");
  };

  return (
    <>
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Crew</h3>
            <p>List of all users assigned to each role. You can also add new users to a specific role.</p>
          </div>
          <div className="sub-header-right">
            <div className="p-input-icon-left search mr-3 swarch">
              <i className="pi pi-search" />
              <InputText type="search" placeholder="Search" />
            </div>
            <Button label="Add Crew" icon="pi pi-plus" onClick={goToAddUserPage} className="p-button-primary" />
          </div>
          
        </div>
        <div className="card-wrapper-gap">
          <DataTable 
            value={users} 
            paginator 
            rows={10} 
            rowsPerPageOptions={[10, 25, 50]} 
            tableStyle={{ minWidth: '50rem' }}
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            onRowClick={(e) => handleRowClick(e.data)} // Attach handleRowClick to the onRowClick event
            rowClassName="pointer-row"
          >
            <Column field="name" header="Name" style={{ width: '18%' }} body={loading ? skeletonTemplate : null} />
            <Column field="role" header="Job Role" style={{ width: '18%' }} body={loading ? skeletonTemplate : null} />
            <Column field="email" header="Email" style={{ width: '18%' }} body={loading ? skeletonTemplate : null} />
            <Column field="contact" header="Contact no" style={{ width: '18%' }} body={loading ? skeletonTemplate : null} />
            <Column field="department" header="Department" style={{ width: '18%' }} body={loading ? skeletonTemplate : null} />
            <Column field="vessel" header="Vessel Name" style={{ width: '18%' }} body={loading ? skeletonTemplate : null} />
            <Column body={loading ? skeletonTemplate : actionBodyTemplate} style={{ width: '10%' }} />
          </DataTable>
        </div>
    </>
  );
};

export default Users;
