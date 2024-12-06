
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
import { InputText } from 'primereact/inputtext';

const Maintenance = () => {
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
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
      const fetchedVessels = [
        { id: 1, name: "Sea Dreamer", number: "CA 1234 AB", type: "Sailing Yacht", manufacturer: "Feadship", yearbuilt: "2024", status: "Active",attachment: "file1.pdf" },
        { id: 2, name: "Excellence", number: "FL 5678 CD", type: "Motor Yacht", manufacturer: "Benetti", yearbuilt: "2024", status: "Inactive", attachment: "file1.pdf"},
        { id: 3, name: "Serenity", number: "CA 1234 AB", type: "Catamaran", manufacturer: "Lürssen", yearbuilt: "2021", status: "Active",attachment: "file1.pdf" },
        { id: 4, name: "Odyssey", number: "FL 5678 CD", type: "Motor Yacht", manufacturer: "Gulf Craft", yearbuilt: "2020", status: "Active",attachment: "file1.pdf" },
        { id: 5, name: "Harmony", number: "CA 1234 AB", type: "Expedition Yacht", manufacturer: "Hatteras Yachts", yearbuilt: "2024", status: "Active",attachment: "file1.pdf" },
        { id: 6, name: "Ocean Pearl", number: "HODCA 1234 AB", type: "Luxury Yacht", manufacturer: "Westport Yachts", yearbuilt: "2023", status: "Inactive",attachment: "file1.pdf" },
        { id: 7, name: "Sea Breeze", number: "FL 5678 CD", type: "Trimaran", manufacturer: "Viking Yachts", yearbuilt: "2024", status: "Active",attachment: "file1.pdf" },
      ];
      setMaintenanceTasks(fetchedVessels);
      setFilteredVessels(fetchedVessels); 
      setLoading(false);
    }, 500);
  }, []);

  // Handle filter logic
  const applyFilters = useCallback(() => {
    let filteredData = maintenanceTasks;

    if (selectedType) {
      filteredData = filteredData.filter((vessel) => vessel.type === selectedType);
    }
    if (selectedYear) {
      filteredData = filteredData.filter((vessel) => vessel.yearbuilt === selectedYear);
    }
    if (selectedStatus) {
      filteredData = filteredData.filter((vessel) => vessel.status === selectedStatus);
    }

    setFilteredVessels(filteredData);
  }, [maintenanceTasks, selectedType, selectedYear, selectedStatus]);

  // Apply filters when dependencies change
   useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Dropdown options
  const vesselTypes = [
    ...new Set(maintenanceTasks.map((vessel) => vessel.type)),
  ].map((type) => ({ name: type, value: type }));

  const years = [
    ...new Set(maintenanceTasks.map((vessel) => vessel.yearbuilt)),
  ].map((year) => ({ name: year, value: year }));

  const statuses = [
    ...new Set(maintenanceTasks.map((vessel) => vessel.status)),
  ].map((status) => ({ name: status, value: status }));

  const goToAddVesselPage = () => {
    navigate("/maintenance-scheduling/maintenance/new");
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
          label="Delete"
          icon="pi pi-trash"
          className="p-button-text w-full"
          onClick={() => console.log('Delete', rowData)}
        />
      </OverlayPanel>
    </>
  );
  const attachmentTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-paperclip"
        className="p-button-text"
        tooltip={`Download ${rowData.attachment}`}
        tooltipOptions={{ position: 'top' }}
      />
    );
  };
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
      <LeftMenu />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Maintenance Task</h3>
            <p>list of all Maintenance Task</p>
          </div>
          <div className="sub-header-right flex align-items-center">
          <div className="flex align-items-center relative">
      <i className="pi pi-search absolute left-0 ml-2 text-gray-500"></i>
      <InputText 
        placeholder="Search" 
        className="pl-4 mr-3"
      />
    </div>
            

         
            <Dropdown
              value={selectedType}
              options={vesselTypes}
              onChange={(e) => setSelectedType(e.value)}
              optionLabel="name"
              placeholder="Vessel Type"
              className="mr-3 "
            />
            
            <Dropdown
              value={selectedYear}
              options={years}
              onChange={(e) => setSelectedYear(e.value)}
              optionLabel="name"
              placeholder="Year Built"
              className="mr-3"
            />
            <Dropdown
              value={selectedStatus}
              options={statuses}
              onChange={(e) => setSelectedStatus(e.value)}
              optionLabel="name"
              placeholder="Status"
              className="mr-3"
            />
            <Button
              label="Add Vessels"
              icon="pi pi-plus"
              onClick={goToAddVesselPage}
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
            onRowClick={(e) => navigate(`/maintenance-scheduling/maintenance/${e.data.id}`)}
            rowClassName="pointer-row"
          >
            <Column field="name" header="Vessel Name" />
            <Column field="number" header="Registration Number" />
            <Column field="type" header="Vessel Type" />
            <Column field="manufacturer" header="Manufacturer" />
            <Column field="yearbuilt" header="Year Built" />
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
                        <Column header="Attachment" body={attachmentTemplate}></Column>

            <Column body={loading ? skeletonTemplate : actionBodyTemplate} style={{ width: '10%' }} />

          </DataTable>
        </div>
      </div>
    </main>
  );
};

export default Maintenance;
