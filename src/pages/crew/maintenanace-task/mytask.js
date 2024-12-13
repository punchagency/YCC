import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const MyTask = () => {
    const [myTask, setMyTask] = useState([
        { id: 1, name: 'Oil Change', assign: 'Courtney Henry', date: '26/10/2024', priority: 'High', status: 'Pending' },
        { id: 2, name: 'Filter Replacement', assign: 'Theresa Webb', date: '23/10/2024', priority: 'Medium', status: 'Completed' },
        { id: 3, name: 'Oil Change', assign: 'Bessie Cooper', date: '12/10/2024', priority: 'Low', status: 'InProgress' },
        { id: 4, name: 'Filter Replacement', assign: 'Robert Fox', date: '08/10/2024', priority: 'High', status: 'Pending' },
        { id: 5, name: 'Engine Inspection', assign: 'Ronald Richards', date: '20/09/2024', priority: 'Medium', status: 'Completed' },
        { id: 6, name: 'Engine Inspection', assign: 'Floyd Miles', date: '03/08/2024', priority: 'Low', status: 'InProgress' },
    ]);

    const [filteredTask, setFilteredTask] = useState(myTask);
    const [date, setDate] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    const navigate = useNavigate();

    const filterTasks = (status) => {
        return filteredTask.filter((task) => task.status === status);
    };

    const applyFilters = useCallback(() => {
        let filteredData = myTask;

        // Filter by search text
        if (searchText.trim()) {
            filteredData = filteredData.filter((task) =>
                Object.values(task)
                    .some((value) => String(value).toLowerCase().includes(searchText.toLowerCase()))
            );
        }

        // Filter by date
        if (date) {
            const formattedDate = new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(date);

            filteredData = filteredData.filter((task) => task.date === formattedDate);
        }

        setFilteredTask(filteredData);
    }, [myTask, searchText, date]);

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

    const getActiveTabClass = () => {
        if (activeIndex === 0) return 'in-progress';
        if (activeIndex === 1) return 'pending';
        if (activeIndex === 2) return 'completed';
        return '';
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

    const renderTaskTable = (filteredTasks) => (
        <DataTable value={filteredTasks} paginator rows={5}>
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

    React.useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    return (
        <main className="flex h-screen page">
            <div className="w-full right-panel-component">
                <div className="flex align-items-center justify-content-between sub-header-panel">
                    <div className="sub-header-left sub-header-left-with-arrow">
                        <div className="content">
                            <h3>My Task</h3>
                            <p>All information is below</p>
                        </div>
                    </div>
                    <div className="sub-header-right">
                        <div className="p-input-icon-left search mr-3">
                            <i className="pi pi-search" />
                            <InputText
                                type="search"
                                placeholder="Search"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <Calendar
                            value={date}
                            onChange={(e) => setDate(e.value)}
                            className="p-calendar"
                            placeholder="Date"
                            style={{ maxWidth: '111px' }}
                            showIcon
                        />
                    </div>
                </div>

                <div className="card-wrapper-gap">
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className={`tabview-${getActiveTabClass()}`}>
                        <TabPanel header="InProgress" className='progressHeading'>
                            {renderTaskTable(filterTasks('InProgress'))}
                        </TabPanel>
                        <TabPanel header="Pending" className='pendingHeading'>
                            {renderTaskTable(filterTasks('Pending'))}
                        </TabPanel>
                        <TabPanel header="Completed" className='completeHeading'>
                            {renderTaskTable(filterTasks('Completed'))}
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </main>
    );
};

export default MyTask;
