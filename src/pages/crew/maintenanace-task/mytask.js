import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

const MyTask = () => {
  const [filteredTask, setFilteredTask] = useState([]);
  const [date, setDate] = useState(null); // State to store the selected date

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const [tasks] = useState([
    {
      id: 1,
      name: "Oil Change",
      assign: "Courtney Henry",
      date: "26/10/2024",
      priority: "High",
      status: "Pending",
    },
    {
      id: 2,
      name: "Filter Replacement",
      assign: "Theresa Webb",
      date: "23/10/2024",
      priority: "Medium",
      status: "Completed",
    },
    {
      id: 3,
      name: "Oil Change",
      assign: "Bessie Cooper",
      date: "12/10/2024",
      priority: "Low",
      status: "InProgress",
    },
    {
      id: 4,
      name: "Filter Replacement",
      assign: "Robert Fox",
      date: "08/10/2024",
      priority: "High",
      status: "Pending",
    },
    {
      id: 5,
      name: "Engine Inspection",
      assign: "Ronald Richards",
      date: "20/09/2024",
      priority: "Medium",
      status: "Completed",
    },
    {
      id: 6,
      name: "Engine Inspection",
      assign: "Floyd Miles",
      date: "03/08/2024",
      priority: "Low",
      status: "InProgress",
    },
    {
      id: 7,
      name: "Engine Inspection",
      assign: "Floyd Miles",
      date: "03/08/2024",
      priority: "Low",
      status: "Pending",
    },
    {
      id: 8,
      name: "Engine Inspection",
      assign: "Floyd Miles",
      date: "03/08/2024",
      priority: "Low",
      status: "Completed",
    },
    {
      id: 9,
      name: "Engine Inspection",
      assign: "Floyd Miles",
      date: "03/08/2024",
      priority: "Low",
      status: "Pending",
    },
    {
      id: 10,
      name: "Engine Inspection",
      assign: "Floyd Miles",
      date: "03/08/2024",
      priority: "Low",
      status: "Completed",
    },
  ]);

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
      <span style={{ color, fontWeight: "bold" }}>{rowData.priority}</span>
    );
  };

  const handleRowClick = (event) => {
    const { id } = event.data;
    navigate(`/crew/maintenance-task/mytask/${id}`); // Corrected path
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

  const getActiveTabClass = () => {
    if (activeIndex === 0) return "in-progress";
    if (activeIndex === 1) return "pending";
    if (activeIndex === 2) return "completed";
    return "";
  };


  

  const renderTaskTable = (filteredTasks) => (
    <DataTable
      value={filteredTasks}
      paginator
      rows={5}
      onRowClick={handleRowClick}
      rowClassName="pointer-row"
    >
      <Column field="name" header="Task Name" />
      <Column field="assign" header="Assign By" />
      <Column field="date" header="Date" />
      <Column field="priority" header="Priority" body={priorityTemplate} />
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
    </DataTable>
  );

  const applyFilters = useCallback(() => {
    let filteredData = tasks; // Use tasks as the source for filtering
  
    // Apply search text filter
    if (searchText.trim()) {
      filteredData = filteredData.filter((task) =>
        Object.values(task).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  
    // Apply date filter
    if (date) {
      const selectedDate = new Date(date).setHours(0, 0, 0, 0); // Normalize selected date
      filteredData = filteredData.filter((task) => {
        const taskDate = new Date(task.date.split("/").reverse().join("-")).setHours(0, 0, 0, 0); // Parse and normalize task date
        return taskDate === selectedDate;
      });
    }
  
    setFilteredTask(filteredData);
  }, [tasks, searchText, date]);
  
  useEffect(() => {
    applyFilters();
  }, [searchText, date, applyFilters]); // Call whenever searchText or date changes
  



  return (
    <main className="flex h-screen page">
      {/* <LeftMenu role="Crew Member" /> */}
      <div className="w-full right-panel-component">
        {/* <AdminHeader /> */}
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            {/* <div className="arrow">
                            <Link to="/maintenance-scheduling/maintenance">
                                <i className="pi pi-angle-left"></i>
                            </Link>
                        </div> */}

            <div className="content">
              <h3>My Task</h3>
              <p>All informations are below</p>
            </div>
          </div>
          <div className="sub-header-right">
            <div className="p-input-icon-left search mr-3">
              <i className="pi pi-search" />
              <InputText type="search" placeholder="Search" />
            </div>
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              className="p-calendar w-8rem"
              placeholder="Date"
              showIcon
            />
          </div>
        </div>

        <div className="card-wrapper-gap">
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            className={`tabview-${getActiveTabClass()} tab-with-table`}
          >
            <TabPanel header="InProgress" headerClassName="progressHeading">
            {renderTaskTable(filteredTask.filter((task) => task.status === "InProgress"))}
            </TabPanel>
            <TabPanel header="Pending" headerClassName="pendingHeading">
            {renderTaskTable(filteredTask.filter((task) => task.status === "Pending"))}
            </TabPanel>
            <TabPanel header="Completed" headerClassName="completeHeading">
            {renderTaskTable(filteredTask.filter((task) => task.status === "Completed"))}
            </TabPanel>
          </TabView>
        </div>
      </div>
    </main>
  );
};

export default MyTask;
