
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

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null); 

  // State for filters
  const [selectedName, setselectedName] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
   const [selectedDate,setSelectedDate] =  useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedVessels = [
        { id: 1, name: "Sea Dreamer", expenseCategory: "Fuel Costs", amount: "$200", date: "26/10/2024", vendor: "Mazagon",paymentMethod:"Credit Card", status: "Paid" },
        { id: 2, name: "The Black Pearl", expenseCategory: "Crew Salaries", amount: "$300", date: "26/10/2024", vendor: "Mazagon",paymentMethod:"Bank Transfer", status: "Unpaid" },
        { id: 3, name: "Aquaholic", expenseCategory: "Insurance Premiums", amount: "$400", date: "26/10/2024", vendor: "Mazagon",paymentMethod:"Cash", status: "Paid" },
        { id: 4, name: "Aquaholic", expenseCategory: "Insurance Premiums", amount: "$400", date: "26/10/2024", vendor: "Mazagon",paymentMethod:"Cash", status: "Paid" },
        { id: 5, name: "Aquaholic", expenseCategory: "Insurance Premiums", amount: "$400", date: "27/10/2024", vendor: "Mazagon",paymentMethod:"Cash", status: "Paid" },
        { id: 6, name: "Aquaholic", expenseCategory: "Insurance Premiums", amount: "$400", date: "26/10/2024", vendor: "Mazagon",paymentMethod:"Cash", status: "Paid" },
        { id: 7, name: "Aquaholic", expenseCategory: "Insurance Premiums", amount: "$400", date: "28/10/2024", vendor: "Mazagon",paymentMethod:"Cash", status: "Paid" },
        { id: 8, name: "Aquaholic", expenseCategory: "Insurance Premiums", amount: "$400", date: "26/10/2024", vendor: "Mazagon",paymentMethod:"Cash", status: "Paid" },

    ];
      setExpenses(fetchedVessels);
      setFilteredExpenses(fetchedVessels); // Initially, all vessels are displayed
      setLoading(false);
    }, 500);
  }, []);

  // Handle filter logic
  const applyFilters = useCallback(() => {
    let filteredData = expenses;
  
    if (selectedName) {
      filteredData = filteredData.filter((expense) => expense.name === selectedName);
    }
    if (selectedCategory) {
      filteredData = filteredData.filter((expense) => expense.expenseCategory === selectedCategory);
    }
    if (selectedDate) {
      filteredData = filteredData.filter((expense) => {
        const expenseDate = new Date(expense.date.split('/').reverse().join('-'));
        const filterDate = new Date(selectedDate.split('/').reverse().join('-'));
        return expenseDate.getTime() === filterDate.getTime();
      });
    }
    if (selectedStatus) {
      filteredData = filteredData.filter((expense) => expense.status === selectedStatus);
    }
  
    setFilteredExpenses(filteredData);
  }, [selectedName, selectedCategory, selectedDate, selectedStatus, expenses]);
  

  // Apply filters when dependencies change
   useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Dropdown options
  const vesselNames = [
    ...new Set(expenses.map((expense) => expense.name)),
  ].map((name) => ({ name: name, value: name }));

  const category = [
    ...new Set(expenses.map((expense) => expense.expenseCategory)),
  ].map((expenseCategory) => ({ name: expenseCategory, value: expenseCategory }));

  const statuses = [
    ...new Set(expenses.map((expense) => expense.status)),
  ].map((status) => ({ name: status, value: status }));

  const date = [
    ...new Set(expenses.map((expense) => expense.date)),
  ].map((date) => ({ name: date, value: date }));
  

  const goToAddExpensePage = () => {
    navigate("/finance-management/expense/new");
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
      <LeftMenu />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Expenses</h3>
            <p>list of all expense </p>
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
              options={vesselNames}
              onChange={(e) => setselectedName(e.value)}
              optionLabel="name"
              placeholder="Vessel Name"
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
              value={selectedDate}
              options={date}
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
              label="Add Expense"
              icon="pi pi-plus"
              onClick={goToAddExpensePage}
              className="p-button-primary"
            />
          </div>
        </div>

        
        <div className="card-wrapper-gap">
          <DataTable
            value={filteredExpenses}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            onRowClick={(e) => navigate(`/finance-management/expense/${e.data.id}`)}
            rowClassName="pointer-row"
            
          >
            <Column field="name" header="Vessel Name" />
            <Column field="expenseCategory" header="Expense Category" />
            <Column field="amount" header="Amount" />
            <Column field="date" header="Date" />
            <Column field="vendor" header="Vendor" />
            <Column field="paymentMethod" header="Payment Method" />
            <Column
              field="status"
              header="Status"
              body={(rowData) => (
                <span
                  style={{
                    backgroundColor: rowData.status === "Paid" ? "#94E0ED" : "#EF4444",
                    color: rowData.status === "Paid" ? "##047F94" : "#FFFFFF",
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

export default Expense
