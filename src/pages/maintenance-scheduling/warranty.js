
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Warranty = () => {
  const [equipments, setEquipments] = useState([]);
  const [filteredManufacturer, setFilteredManufacturer] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  // State for filters
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedEquipments = [
        { id: 1, name: "Alternator", coverage: "Parts", manufacturer: "Caterpillar", expirationDate: "26/09/2024", status: "Warranty" },
        { id: 2, name: "Lighting Systems", coverage: "Full Warranty", manufacturer: "Viking", expirationDate: "26/09/2024", status: "Out of Warranty" },
        { id: 3, name: "Radar Systems", coverage: "Labor", manufacturer: "Cummins", expirationDate: "26/09/2024", status: "Warranty" },
        { id: 4, name: "Alternator", coverage: "Parts", manufacturer: "Cummins", expirationDate: "26/09/2024", status: "Out of Warranty" },
        { id: 5, name: "Lighting Systems", coverage: "Labor", manufacturer: "Viking", expirationDate: "26/09/2024", status: "Warranty" },
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
    if (selectedDate) {
      filteredData = filteredData.filter((equipment) => equipment.category === selectedDate);
    }
    if (selectedStatus) {
      filteredData = filteredData.filter((equipment) => equipment.status === selectedStatus);
    }

    setFilteredManufacturer(filteredData);
  }, [equipments, selectedManufacturer, selectedDate, selectedStatus]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Dropdown options
  const manufacturer = [
    ...new Set(equipments.map((equipment) => equipment.manufacturer)),
  ].map((manufacturer) => ({ name: manufacturer, value: manufacturer }));

  const date = [
    ...new Set(equipments.map((equipment) => equipment.expirationDate)),
  ].map((expirationDate) => ({
    name: expirationDate,
    value: expirationDate,
  }));

  const statuses = [
    ...new Set(equipments.map((equipment) => equipment.status)),
  ].map((status) => ({ name: status, value: status }));

  const goToAddEquipmentPage = () => {
    navigate("/maintenance-scheduling/warranty/new");
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
            <h3>Warranty</h3>
            <p>list of all Equipment & parts warranty</p>
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
              value={selectedManufacturer}
              options={manufacturer}
              onChange={(e) => setSelectedManufacturer(e.value)}
              optionLabel="name"
              placeholder="Manufacturer"
              className="mr-3 "
            />

            <Dropdown
              value={selectedDate}
              options={date}
              onChange={(e) => setSelectedDate(e.value)}
              optionLabel="name"
              placeholder="Exp Date"
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
              label="Add Warranty"
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
            onRowClick={(e) => navigate(`/maintenance-scheduling/warranty/${e.data.id}`)}
            rowClassName="pointer-row"
          >
            <Column field="name" header="Equipment Name" />
            <Column
              field="status"
              header="Warranty Status"
              body={(rowData) => (
                <span

                >
                  {rowData.status}
                </span>
              )}
            />
            <Column field="coverage" header="Coverage" />
            <Column field="manufacturer" header="Manufacturer" />
            <Column field="expirationDate" header="Expiration Date" />


            <Column body={loading ? skeletonTemplate : actionBodyTemplate} style={{ width: '10%' }} />

          </DataTable>
        </div>
      </div>
    </main>
  );
};

export default Warranty;
