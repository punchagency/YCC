
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

const Invoice = () => {
  const [vendors, setVedors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null); 
  const [date,setDate] = useState(null);

  // State for filters
  const [selectedName, setselectedName] = useState(null);
   const [selectedDate,setSelectedDate] =  useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedVessels = [
        { id: 1, vendorName: "Lürssen", invoiceNo: "#YC98564", amountDue: "$2200", date: "30/10/2024",  status: "Paid" },
        { id: 2, vendorName: "Nobiskrug", invoiceNo: "#YC98563", amountDue: "$1200", date: "16/10/2024",  status: "Overdue" },
        { id: 3, vendorName: "Oceanco", invoiceNo: "#YC98561", amountDue: "$2200", date: "18/10/2024",  status: "Unpaid" },
        { id: 4, vendorName: "Lürssen", invoiceNo: "#YC98564", amountDue: "$6200", date: "30/10/2024",  status: "Paid" },

    ];
      setVedors(fetchedVessels);
      setFilteredVendors(fetchedVessels); // Initially, all vessels are displayed
      setLoading(false);
    }, 500);
  }, []);

  // Handle filter logic
  const applyFilters = useCallback(() => {
    let filteredData = vendors;

    if (selectedName) {
      filteredData = filteredData.filter((vendor) => vendor.name === selectedName);
    }
  
    if (selectedDate) {
        filteredData = filteredData.filter((vendor) => vendor.date === selectedDate);
      }
    if (selectedStatus) {
      filteredData = filteredData.filter((vendor) => vendor.status === selectedStatus);
    }

    setFilteredVendors(filteredData);
  }, [vendors , selectedDate, selectedStatus]);

  // Apply filters when dependencies change
   useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Dropdown options
  const vendorNames = [
    ...new Set(vendors.map((vendor) => vendor.vendorName)),
  ].map((vendorName) => ({ name: vendorName, value: vendorName }));

  const dates = [
    ...new Set(vendors.map((vendor) => vendor.date)),
  ].map((date) => ({ name: date, value: date }));

  const statuses = [
    ...new Set(vendors.map((vendor) => vendor.status)),
  ].map((status) => ({ name: status, value: status }));

  const goToAddInvoicePage = () => {
    navigate("/finance-management/invoice/new");
  };

  const statusStyles = {
    Paid: {
      backgroundColor: "#94E0ED",
      color: "#047F94",
    },
    Overdue: {
      backgroundColor: "#F59E0B",
      color: "#FFFFFF",
    },
    Unpaid: {
      backgroundColor: "#EF4444",
      color: "#FFFFFF",
    },
   
    Default: {
      backgroundColor: "#F0F0F0",
      color: "#000000",
    },
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
            <h3>Invoices</h3>
            <p>list of all invoice </p>
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
              value={selectedName}
              options={vendorNames}
              onChange={(e) => setselectedName(e.value)}
              optionLabel="name"
              placeholder="Vendor"
              className="mr-3 "
            />
         
               <Dropdown
              value={date}
              options={dates}
              onChange={(e) => setSelectedDate(e.value)}
              optionLabel="name"
              placeholder="Date"
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
              label="Add Invoice"
              icon="pi pi-plus"
              onClick={goToAddInvoicePage}
              className="p-button-primary"
            />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <DataTable
            value={filteredVendors}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            onRowClick={(e) => navigate(`/finance-management/invoice/${e.data.id}`)}
            rowClassName="pointer-row"
          >
            <Column field="invoiceNo" header="Invoice Number" />
            <Column field="vendorName" header="Vendor Name" />
            <Column field="amountDue" header="Amount Due" />
            <Column field="date" header="Due Date" />
        
            <Column
              field="status"
              header="Status"
              body={(rowData) => {
                const styles = statusStyles[rowData.status] || statusStyles.Default; 
                return (
                  <span
                    style={{
                      ...styles,
                      fontWeight: "bold",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      display: "inline-block",
                    }}
                  >
                    {rowData.status}
                  </span>
                );
              }}
            />
            <Column body={loading ? skeletonTemplate : actionBodyTemplate} style={{ width: '10%' }} />
          </DataTable>
        </div>
      </div>
    </main>
  );
};

export default Invoice
