
import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from 'primereact/skeleton';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';

const Equipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [filteredManufacturer, setFilteredManufacturer] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null); 

  // State for filters
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedEquipments = [
        { id: 1, name: "Main Engine", category: "Engine", manufacturer: "Caterpillar", modelNumber: "3516E", serialNumber: "12345-CAT", status: "In Use" },
        { id: 2, name: "Life Raft", category: "Safety", manufacturer: "Viking", modelNumber: "Viking", serialNumber: "VR-67891", status: "Under Warranty" },
        { id: 3, name: "Generator", category: "Electrical", manufacturer: "Cummins", modelNumber: "G-45x", serialNumber: "G4500-XYZ", status: "Out of Warranty" },
        { id: 4, name: "Generator", category: "Electrical", manufacturer: "Cummins", modelNumber: "G-45x", serialNumber: "G4500-XYZ", status: "Out of Warranty" },
        { id: 5, name: "Life Raft", category: "Safety", manufacturer: "Viking", modelNumber: "Viking", serialNumber: "VR-67891", status: "Under Warranty" },
        ];
      setEquipments(fetchedEquipments);
      setFilteredManufacturer(fetchedEquipments); 
      setLoading(false);
    }, 500);
  }, []);

  // Handle filter logic
  const applyFilters = useCallback(() => {
    let filteredData = equipments;

    if (selectedManufacturer) {
      filteredData = filteredData.filter((equipment) => equipment.manufacturer === selectedManufacturer);
    }
    if (selectedCategory) {
      filteredData = filteredData.filter((equipment) => equipment.category === selectedCategory);
    }
    if (selectedStatus) {
      filteredData = filteredData.filter((equipment) => equipment.status === selectedStatus);
    }

    setFilteredManufacturer(filteredData);
  }, [equipments, selectedManufacturer, selectedCategory, selectedStatus]);

  // Apply filters when dependencies change
   useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Dropdown options
  const manufacturer = [
    ...new Set(equipments.map((equipment) => equipment.manufacturer)),
  ].map((manufacturer) => ({ name: manufacturer, value: manufacturer }));

  const category = [
    ...new Set(equipments.map((equipment) => equipment.category)),
  ].map((category) => ({ name: category, value: category }));

  const statuses = [
    ...new Set(equipments.map((equipment) => equipment.status)),
  ].map((status) => ({ name: status, value: status }));

  const op = useRef(null);

  const goToAddEquipmentPage = () => {
    navigate("/maintenance-scheduling/equipment/new");
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
          onClick={(e) => navigate(`/maintenance-scheduling/equipment/edit`)}
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
    <>
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Equipment & parts</h3>
            <p>list of all Equipment or parts</p>
          </div>
          <div className="sub-header-right sub-header-big-desktop">
            <div className="p-input-icon-left search mr-3">
              <i className="pi pi-search" />
              <InputText type="search" placeholder="Search" />
            </div>
            <Dropdown
              value={selectedManufacturer}
              options={manufacturer}
              onChange={(e) => setSelectedManufacturer(e.value)}
              optionLabel="name"
              placeholder="Manufacturer"
              className="mr-3 "
            />
            <Dropdown
              value={selectedCategory}
              options={category}
              onChange={(e) => setSelectedCategory(e.value)}
              optionLabel="name"
              placeholder="Category"
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
              label="Add Equipment"
              icon="pi pi-plus"
              onClick={goToAddEquipmentPage}
              className="p-button-primary"
            />
          </div>
          <div className="sub-header-right sub-header-small-desktop ">
            <Button
              label="Filters"
              className='mr-3'
              severity="secondary" 
              outlined
              icon="pi pi-filter"
              iconPos="right" // This will place the icon to the right of the text
              onClick={(e) => op.current && op.current.toggle(e)} // Ensure `op.current` is not null
            />
            <OverlayPanel ref={op}>
                <div className="p-d-flex p-flex-column">
                    <Dropdown
                      value={selectedManufacturer}
                      options={manufacturer}
                      onChange={(e) => setSelectedManufacturer(e.value)}
                      optionLabel="name"
                      placeholder="Manufacturer"
                      className="mr-3 "
                    />
                    <Dropdown
                      value={selectedCategory}
                      options={category}
                      onChange={(e) => setSelectedCategory(e.value)}
                      optionLabel="name"
                      placeholder="Category"
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
             <div className="p-input-icon-left search mr-3">
              <i className="pi pi-search" />
              <InputText type="search" placeholder="Search" />
             </div>
             <Button
              label="Add Equipment"
              icon="pi pi-plus"
              onClick={goToAddEquipmentPage}
              className="p-button-primary"
            />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <DataTable
            value={filteredManufacturer}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            onRowClick={(e) => navigate(`/maintenance-scheduling/equipment/${e.data.id}`)}
            rowClassName="pointer-row"
          >
            <Column field="name" header="Equipment Name" />
            <Column field="category" header="Category" />
            <Column field="manufacturer" header="Manufacturer" />
            <Column field="modelNumber" header="Model Number" />
            <Column field="serialNumber" header="Serial Number" />
            <Column
              field="status"
              header="Status"
              body={(rowData) => (
                <span
                
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

export default Equipment;
