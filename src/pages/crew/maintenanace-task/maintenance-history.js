
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
import { Calendar } from 'primereact/calendar';

const MaintenanceHistory = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocument, setFilteredDocument] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [date, setDate] = useState(null); // State to store the selected date

  const menuRef = useRef(null);
  // State for filters
  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedDocument = [
        { id: 1, name: "Oil Change", assign: "Robert Fox", logDate: "12/10/2024", workingHours: "8 hours" },
        { id: 2, name: "Check Fuel and Oil Levels", assign: "Brooklyn Simmons", logDate: "13/10/2024", workingHours: "5 hours" },
        { id: 3, name: "Visual Inspection of Engine Room", assign: "Jacob Jones", logDate: "14/10/2024", workingHours: "12 hours" },
        { id: 4, name: "Check Bilge", assign: "Arlene McCoy", logDate: "15/10/2024", workingHours: "4 hours" },
        { id: 5, name: "Safety Gear", assign: "Ronald Richards", logDate: "17/10/2024", workingHours: "2 hours" },

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
  }, [documents, searchText]);


  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);





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
      {/* <LeftMenu role="Crew Member" /> */}
      <div className="w-full right-panel-component">
        {/* <AdminHeader /> */}
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Maintenance History</h3>
            <p>list of all Maintenance task history</p>
          </div>
          <div className="sub-header-right">
            <div className="p-input-icon-left search mr-3">
              <i className="pi pi-search" />
              <InputText type="search" placeholder="Search" />
            </div>
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              className="p-calendar"
              placeholder="Date"
              style={{ maxWidth: '111px' }}
              showIcon
            />          </div>
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


            
          </DataTable>
        </div>
      </div>
    </main>
  );
};

export default MaintenanceHistory;
