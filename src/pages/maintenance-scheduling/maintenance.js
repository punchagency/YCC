
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
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchText, setSearchText] = useState("");

  const menuRef = useRef(null);

  // State for filters
  const [selectedVesselName, setSelectedVesselName] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null)


  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedTasks = [
        { id: 1, taskName: "Oil Change", vesselName: "Sea Dreamer", assignPersonal: "Courtney Henry", date: "26/10/2024", priority: "High", status: "Completed", attachment: "file1.pdf" },
        { id: 2, taskName: "Filter Replacement", vesselName: "AquaHolic", assignPersonal: "Theresa Webb", date: "23/10/2024", priority: "Medium", status: "InProgress", attachment: "file1.pdf" },
        { id: 3, taskName: "Oil Change", vesselName: "Andiamo", assignPersonal: "Bessie Cooper", date: "12/10/2024", priority: "Low", status: "Completed", attachment: "file1.pdf" },
        { id: 4, taskName: "Oil Change", vesselName: "Andiamo", assignPersonal: "Bessie Cooper", date: "12/10/2024", priority: "Low", status: "Completed", attachment: "file1.pdf" },
        { id: 5, taskName: "Oil Change", vesselName: "Andiamo", assignPersonal: "Bessie Cooper", date: "12/10/2024", priority: "Low", status: "Completed", attachment: "file1.pdf" },
        { id: 6, taskName: "Oil Change", vesselName: "Sea Dreamer", assignPersonal: "Courtney Henry", date: "26/10/2024", priority: "High", status: "Pending", attachment: "file1.pdf" },
        { id: 7, taskName: "Filter Replacement", vesselName: "AquaHolic", assignPersonal: "Theresa Webb", date: "23/10/2024", priority: "Medium", status: "InProgress", attachment: "file1.pdf" },

      ];
      setMaintenanceTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
      setLoading(false);
    }, 500);
  }, []);

  // Handle filter logic
  const applyFilters = useCallback(() => {
    let filteredData = maintenanceTasks;

    if (selectedVesselName) {
      filteredData = filteredData.filter((vessel) => vessel.vesselName === selectedVesselName);
    }
    if (selectedDate) {
      filteredData = filteredData.filter((expense) => {
        const expenseDate = new Date(expense.date.split('/').reverse().join('-'));
        const filterDate = new Date(selectedDate.split('/').reverse().join('-'));
        return expenseDate.getTime() === filterDate.getTime();
      });
    }
    if (selectedStatus) {
      filteredData = filteredData.filter((vessel) => vessel.status === selectedStatus);
    }
    
    if (searchText.trim()) {
      filteredData = filteredData.filter((doc) =>
        Object.values(doc)
          .some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          )
      );
    }
    setFilteredTasks(filteredData);
  }, [maintenanceTasks, selectedVesselName, selectedDate, selectedStatus,searchText]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);


  // Dropdown options (unique values from maintenanceTasks)
  const vesselName = [
      ...new Set(maintenanceTasks.map((vessel) => vessel.vesselName)),
  ].map((vesselName) => ({ name: vesselName, value: vesselName }));

  const date = [
      ...new Set(maintenanceTasks.map((vessel) => vessel.date)),
  ].map((date) => ({ name: date, value: date }));

  const statuses = [
      ...new Set(maintenanceTasks.map((vessel) => vessel.status)),
  ].map((status) => ({ name: status, value: status }));

  const op = useRef(null);

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

  const priorityTemplate = (rowData) => {
    let color = "";
    switch (rowData.priority) {
        case "High":
            color = "#FF3D32";
            break;
        case "Medium":
            color = "#C79807";
            break;
        case "Low":
            color = "#8183F4";
            break;
        default:
            color = "black";
    }

    return (
        <span style={{ color, fontWeight: "bold" }}>
            {rowData.priority}
        </span>
    );
};

const statusStyles = {
  Completed: {
    backgroundColor: "#94E0ED",
    color: "#047F94",
  },
  InProgress: {
    backgroundColor: "#CAF1D8",
    color: "#188A42",
  },
  Pending: {
    backgroundColor: "#FEDDC7",
    color: "#D46213",
  },
  Default: {
    backgroundColor: "#FEDDC7",
    color: "#000000",
  },
};

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
      <LeftMenu role="Captain/Manager" />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left">
            <h3>Maintenance Task</h3>
            <p>list of all Maintenance Task</p>
          </div>
          <div className="sub-header-right sub-header-big-desktop ">
            {/* <div className="flex align-items-center relative">
                <i className="pi pi-search absolute left-0 ml-2 text-gray-500"></i>
                <InputText
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search"
                  className="pl-4 mr-3"
                />
            </div> */}

            <div className="p-input-icon-left search mr-3">
              <i className="pi pi-search" />
              <InputText type="search" placeholder="Search" />
            </div>

            <Dropdown
              value={selectedVesselName}
              options={vesselName}
              onChange={(e) => setSelectedVesselName(e.value)}
              optionLabel="name"
              placeholder="Vessel Name"
              className="mr-3 "
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
              label="Create New Tasks"
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
                  value={selectedVesselName}
                  options={vesselName}
                  onChange={(e) => setSelectedVesselName(e.value)}
                  optionLabel="name"
                  placeholder="Vessel Name"
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
              </div>
            </OverlayPanel>
            <div className="p-input-icon-left search mr-3">
              <i className="pi pi-search" />
              <InputText type="search" placeholder="Search" />
            </div>
            <Button
                label="Create New Tasks"
                icon="pi pi-plus"
                onClick={goToAddVesselPage}
                className="p-button-primary"
              />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <DataTable
            value={filteredTasks}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            onRowClick={(e) => navigate(`/maintenance-scheduling/maintenance/${e.data.id}`)}
            rowClassName="pointer-row"
          >
            <Column field="taskName" header="Task Name" />
            <Column field="vesselName" header="Vessel Name" />
            <Column field="assignPersonal" header="Assign Personal" />
            <Column field="date" header="Date" />
        
            <Column field="priority" header="Priority" body={priorityTemplate} />

            <Column
              field="status"
              header="Status"
              body={(rowData) => {
                const styles = statusStyles[rowData.status] || statusStyles.Default; // Fallback to Default if no match
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
            <Column header="Attachment" body={attachmentTemplate}></Column>

            <Column body={loading ? skeletonTemplate : actionBodyTemplate} style={{ width: '10%' }} />

          </DataTable>
        </div>
      </div>
    </main>
  );
};

export default Maintenance;
