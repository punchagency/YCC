
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import LeftMenu from "../../../components/menu";
import AdminHeader from "../../../components/header";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from 'primereact/skeleton';
import { OverlayPanel } from 'primereact/overlaypanel';
import { type } from '@testing-library/user-event/dist/type';
import { InputText } from 'primereact/inputtext';

const MaintenanceHistory = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocument, setFilteredDocument] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const menuRef = useRef(null);
  // State for filters
  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedDocument = [
        { id: 1, name: "ISM Code Audit Report", assign: "Administrator", logDate: "Sea Dreamer", workingHours: "MCA" },
        { id: 2, name: "ISM Code Audit Report", assign: "Administrator", logDate: "Sea Dreamer", workingHours: "MCA" },
        { id: 3, name: "ISM Code Audit Report", assign: "Administrator", logDate: "Sea Dreamer", workingHours: "MCA" },
        { id: 4, name: "ISM Code Audit Report", assign: "Administrator", logDate: "Sea Dreamer", workingHours: "MCA" },
        { id: 5, name: "ISM Code Audit Report", assign: "Administrator", logDate: "Sea Dreamer", workingHours: "MCA" },

      ];
      setDocuments(fetchedDocument);
      setFilteredDocument(fetchedDocument); // Initially, all vessels are displayed
      setLoading(false);
    }, 500);
  }, []);

  // Handle filter logic
  const applyFilters = useCallback(() => {
    let filteredData = documents;

   

    if (searchText.trim()) {
      filteredData = filteredData.filter((doc) =>
        Object.values(doc)
          .some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          )
      );
    }
    setFilteredDocument(filteredData);
  }, [documents,  searchText]);


  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);



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
      <LeftMenu role="Crew Member" />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Maintenance History</h3>
            <p>list of all Maintenance task history</p>
          </div>
          <div className="sub-header-right flex align-items-center">
            <div className="flex align-items-center relative">
              <i className="pi pi-search absolute left-0 ml-2 text-gray-500" style={{ marginRight: '5px' }}></i>
              <InputText
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                className="pl-6 mr-3"
              />
            </div>

        
          </div>
        </div>
        <div className="card-wrapper-gap">
          <DataTable
            value={filteredDocument}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            onRowClick={(e) => navigate(`/crew/maintenance-task/history/${e.data.id}`)}
            rowClassName="pointer-row"
          >
            <Column field="name" header="Task Name" />
            <Column field="assign" header="Assign By" />
            <Column field="logDate" header="Log Date" />
            <Column field="workingHours" header="Working Hours" />
            
           
            <Column body={loading ? skeletonTemplate : actionBodyTemplate} style={{ width: '10%' }} />
          </DataTable>
        </div>
      </div>
    </main>
  );
};

export default MaintenanceHistory;
