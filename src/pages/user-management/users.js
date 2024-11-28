import React, { useState, useEffect, useRef } from 'react'; // Ensure useRef is imported
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Skeleton } from 'primereact/skeleton';

const Users = () => {
  const [users, setUsers] = useState([]); // Store paginated users
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null); // `useRef` is now correctly imported

  useEffect(() => {
    // Simulate a fetch call
    setTimeout(() => {
      const fetchedUsers = [
        { id: 1, name: 'John Doe', role: 'Admin', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', role: 'Editor', email: 'jane@example.com' },
        { id: 3, name: 'Emily Davis', role: 'Viewer', email: 'emily@example.com' },
        { id: 4, name: 'Michael Brown', role: 'Admin', email: 'michael@example.com' },
        { id: 5, name: 'Sarah Wilson', role: 'Editor', email: 'sarah@example.com' },
        { id: 6, name: 'Chris Evans', role: 'Viewer', email: 'chris@example.com' },
        { id: 7, name: 'Laura White', role: 'Editor', email: 'laura@example.com' },
        { id: 8, name: 'Mark Taylor', role: 'Viewer', email: 'mark@example.com' },
        { id: 9, name: 'John Doe', role: 'Admin', email: 'john@example.com' },
        { id: 10, name: 'Jane Smith', role: 'Editor', email: 'jane@example.com' },
        { id: 11, name: 'Emily Davis', role: 'Viewer', email: 'emily@example.com' },
        { id: 12, name: 'Michael Brown', role: 'Admin', email: 'michael@example.com' },
        { id: 13, name: 'Sarah Wilson', role: 'Editor', email: 'sarah@example.com' },
        { id: 14, name: 'Chris Evans', role: 'Viewer', email: 'chris@example.com' },
        { id: 15, name: 'Laura White', role: 'Editor', email: 'laura@example.com' },
        { id: 16, name: 'Mark Taylor', role: 'Viewer', email: 'mark@example.com' },
      ];
      setUsers(fetchedUsers.slice(0, 10)); // Initialize the first page with 10 users
      setLoading(false);
    }, 1000); // Simulates a 1-second delay
  }, []);

  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-rounded p-button-text"
        onClick={(e) => menuRef.current.toggle(e)}
      />
      <OverlayPanel ref={menuRef} dismissable>
        <Button
          label="Edit"
          icon="pi pi-pencil"
          className="p-button-text w-full"
          onClick={() => console.log('Edit', rowData)}
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
      <Skeleton width="10%" className="mr-2" />
      <Skeleton width="30%" className="mr-2" />
      <Skeleton width="30%" className="mr-2" />
      <Skeleton width="20%" className="mr-2" />
      <Skeleton width="10%" />
    </>
  );

  return (
    <main className="flex h-screen page">
      <LeftMenu />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Users</h3>
            <p>List of all users assigned to each role. You can also add new users to a specific role.</p>
          </div>
          <div className="sub-header-right">
            <div className="p-input-icon-left search mr-3">
              <i className="pi pi-search" />
              <InputText type="search" placeholder="Search" />
            </div>
            <Button label="Add User" icon="pi pi-plus" className="p-button-primary" />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <DataTable value={users} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
            <Column field="id" header="ID" style={{ width: '10%' }} body={loading ? skeletonTemplate : null} />
            <Column field="name" header="Name" style={{ width: '30%' }} body={loading ? skeletonTemplate : null} />
            <Column field="email" header="Email" style={{ width: '30%' }} body={loading ? skeletonTemplate : null} />
            <Column field="role" header="Role" style={{ width: '20%' }} body={loading ? skeletonTemplate : null} />
            <Column body={loading ? skeletonTemplate : actionBodyTemplate} style={{ width: '10%' }} />
          </DataTable>
        </div>
      </div>
    </main>
  );
};

export default Users;
