
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

const Vessels = () => {
  const [vessels, setVessels] = useState([]);
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
        { id: 1, name: "Sea Dreamer", number: "CA 1234 AB", type: "Sailing Yacht", manufacturer: "Feadship", yearbuilt: "2024", status: "Active" },
        { id: 2, name: "Excellence", number: "FL 5678 CD", type: "Motor Yacht", manufacturer: "Benetti", yearbuilt: "2024", status: "Inactive" },
        { id: 3, name: "Serenity", number: "CA 1234 AB", type: "Catamaran", manufacturer: "Lürssen", yearbuilt: "2021", status: "Active" },
        { id: 4, name: "Odyssey", number: "FL 5678 CD", type: "Motor Yacht", manufacturer: "Gulf Craft", yearbuilt: "2020", status: "Active" },
        { id: 5, name: "Harmony", number: "CA 1234 AB", type: "Expedition Yacht", manufacturer: "Hatteras Yachts", yearbuilt: "2024", status: "Active" },
        { id: 6, name: "Ocean Pearl", number: "HODCA 1234 AB", type: "Luxury Yacht", manufacturer: "Westport Yachts", yearbuilt: "2023", status: "Inactive" },
        { id: 7, name: "Sea Breeze", number: "FL 5678 CD", type: "Trimaran", manufacturer: "Viking Yachts", yearbuilt: "2024", status: "Active" },
      ];
      setVessels(fetchedVessels);
      setFilteredVessels(fetchedVessels); // Initially, all vessels are displayed
      setLoading(false);
    }, 500);
  }, []);

  // Handle filter logic
  const applyFilters = useCallback(() => {
    let filteredData = vessels;

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
  }, [vessels, selectedType, selectedYear, selectedStatus]);

  // Apply filters when dependencies change
   useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Dropdown options
  const vesselTypes = [
    ...new Set(vessels.map((vessel) => vessel.type)),
  ].map((type) => ({ name: type, value: type }));

  const years = [
    ...new Set(vessels.map((vessel) => vessel.yearbuilt)),
  ].map((year) => ({ name: year, value: year }));

  const statuses = [
    ...new Set(vessels.map((vessel) => vessel.status)),
  ].map((status) => ({ name: status, value: status }));

  const goToAddVesselPage = () => {
    navigate("/vessel-management/vessels/new");
  };

  const op = useRef(null);

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
    <>
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Vessels</h3>
            <p>List of all Vessels. You can also add new vessels.</p>
          </div>
          <div className="sub-header-right sub-header-big-desktop">
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
          <div className="sub-header-right sub-header-small-desktop ">
            <Button
              label="Filters"
              className='mr-3'
              severity="secondary" 
              outlined
              icon="pi pi-chevron-down"
              iconPos="right" // This will place the icon to the right of the text
              onClick={(e) => op.current && op.current.toggle(e)} // Ensure `op.current` is not null
            />
            <OverlayPanel ref={op}>
                <div className="p-d-flex p-flex-column">
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
                </div>  
            </OverlayPanel> 
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
            onRowClick={(e) => navigate(`/vessel-management/vessels/${e.data.id}`)}
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
            <Column body={loading ? skeletonTemplate : actionBodyTemplate} style={{ width: '10%' }} />
          </DataTable>
        </div>
    </>
  );
};

export default Vessels;
