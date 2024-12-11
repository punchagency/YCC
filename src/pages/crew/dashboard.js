import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';
import Doc from '../../assets/images/doc.svg';
import Pdf from '../../assets/images/pdf.svg';
import Xls from '../../assets/images/xls.svg';


const DashboardCrew = () => {
  const menuRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [document, setDocument] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { label: 'Refresh', icon: 'pi pi-refresh', command: () => console.log('Refresh clicked') },
    { label: 'Settings', icon: 'pi pi-cog', command: () => console.log('Settings clicked') },
    { label: 'Help', icon: 'pi pi-question', command: () => console.log('Help clicked') },
  ];
  const data = {
    labels: ['Paid (50%)', 'Unpaid (34%)', 'Overdue (26%)'],
    datasets: [
      {
        data: [50, 30, 20],
        backgroundColor: ['#2aa8fa', '#494ab9', '#1ddc6e'],
        hoverBackgroundColor: ['#2aa8fa', '#494ab9', '#1ddc6e']
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };
  const [selectedFilter, setSelectedFilter] = useState('Last 30 days');
  const [selectedFilter1, setSelectedFilter1] = useState('Last 30 days');
  const [selectedFilter2, setSelectedFilter2] = useState('Last 30 days');

  const filterOptions = [
    { label: 'Last 30 days', value: 'Last 30 days' },
    { label: 'Last 7 days', value: 'Last 7 days' },
    { label: 'Last 6 months', value: 'Last 6 months' },
  ];

  const filterOptions1 = [
    { label: 'Last 30 days', value: 'Last 30 days' },
    { label: 'Last 7 days', value: 'Last 7 days' },
    { label: 'Last 6 months', value: 'Last 6 months' },
  ];

  const filterOptions2 = [
    { label: 'Last 30 days', value: 'Last 30 days' },
    { label: 'Last 7 days', value: 'Last 7 days' },
    { label: 'Last 6 months', value: 'Last 6 months' },
  ];

  useEffect(() => {
    setTimeout(() => {
      const fetchedTasks = [
        { id: 1, name: 'Oil change', priority: 'High', date: '23/01/2025' },
        { id: 2, name: 'Filter Replacement', priority: 'High', date: '22/01/2025' },
        { id: 3, name: 'Engine Inspection', priority: 'High', date: '21/01/2025' },
        { id: 4, name: 'Oil change', priority: 'Medium', date: '20/01/2025' },
        { id: 5, name: 'Oil change', priority: 'Medium', date: '19/01/2025' }
      ];
      setTasks(fetchedTasks.slice(0, 20));
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const fetchedDocument = [
        { id: 1, name: 'Engine Maintenance Guide', date: '26/10/2024', imageUrl: Doc },
        { id: 2, name: 'Safety Protocol', date: '26/10/2024', imageUrl: Pdf },
        { id: 3, name: 'Engine Manual', date: '26/10/2024', imageUrl: Xls },
      ];
      setDocument(fetchedDocument.slice(0, 20));
      setLoading(false);
    }, 500);
  }, []);

  const skeletonTemplate = () => (
    <>
      <Skeleton width="33%" className="mr-2" />
      <Skeleton width="33%" className="mr-2" />
      <Skeleton width="33%" className="mr-2" />
    </>
  );


  const onFilterChange = (e) => {
    setSelectedFilter(e.value);
    // Add any logic to fetch or update data based on the selected filter here
    console.log('Selected filter:', e.value);
  };

  const onFilterChange1 = (e) => {
    setSelectedFilter1(e.value);
    console.log('Selected filter 2:', e.value);
  };

  const onFilterChange2 = (e) => {
    setSelectedFilter2(e.value);
    console.log('Selected filter 2:', e.value);
  };

  const barData = {
    labels: ['Manuals', 'Schernatics', 'Technical Docs', 'Maintenance Logs', 'Inspection Reports'],
    datasets: [
      {
        label: 'Payments',
        data: [120, 85, 135, 90, 100],
        backgroundColor: [
          'rgba(65, 59, 108, 1)',
          'rgba(53, 92, 117, 1)',
          'rgba(44, 120, 116, 1)',
          'rgba(63, 156, 111, 1)',
          'rgba(134, 187, 85, 1)'
        ],
        borderColor: [
          'rgb(65, 59, 108)',
          'rgb(53, 92, 117)',
          'rgb(44, 120, 116)',
          'rgb(63, 156, 111)',
          'rgb(134, 187, 85)'
        ],
        borderWidth: 1
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false // Hide the legend (label)
      }
    },
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // X-axis labels
    datasets: [
      {
        label: 'Revenue',
        data: [40, 59, 80, 81, 56, 75, 80], // Data points for the line
        fill: false, // Set to true if you want the area under the line to be filled
        borderColor: '#0023f8', // Line color
        tension: 0.4, // Smoothness of the line
        borderWidth: 2, // Line width
        pointBackgroundColor: '#0023f8', // Point color
        pointBorderColor: '#fff', // Point border color
        pointBorderWidth: 3, // Point border width
        pointRadius: 5, // Radius of points
      },
    ],
  };

  // Chart options to customize the chart appearance
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true, // Start x-axis at 0
      },
      y: {
        beginAtZero: true, // Start y-axis at 0
        ticks: {
          stepSize: 20, // Y-axis step size
        },
      },
    },
  };

  const priorityTemplate = (rowData) => {
    const priorityColors = {
      High: '#FF3D32',
      Medium: '#C79807',
      Low: '#046616',
    };

    return (
      <span style={{ color: priorityColors[rowData.priority] || 'black' }}>
        {rowData.priority}
      </span>
    );
  };


  // Custom template to render File Type (image) column
  const priorityTemplateImage = (rowData) => (
    <div>
      <img
        src={rowData.imageUrl}
        alt=""
        style={{
          width: '25px',
          height: '25px',
          objectFit: 'cover',
        }}
      />
    </div>
  );


  return (
    <main className="flex h-screen page">
      <LeftMenu role="Crew Member" />
      <div className='w-full right-panel-component'>
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          {/* Left Section: Heading and Subheading */}
          <div className="sub-header-left">
            <h3>Dashboard</h3>
            <p>Overview of all important data</p>
          </div>

          {/* Right Section: Action Button */}
          <div className="sub-header-right">
            {/* <Button label="Action" icon="pi pi-plus" className="p-button-primary" /> */}
          </div>
        </div>
        <div className='card-wrapper-gap'>
          <div className='v-grid v-grid-two-column'>
            <div className='item'>
              <div className='card flex justify-content-center'>
                <Card title={
                  <div className="card-header">
                    <span>Task Overview</span>
                    <div className="filter-dropdown">
                      <Dropdown
                        value={selectedFilter}
                        options={filterOptions}
                        onChange={onFilterChange}
                        placeholder="Select a filter"
                        className="p-dropdown-sm"
                      />
                    </div>
                  </div>
                }
                >
                  <div className='pie-chart-wraper'> {/* Custom width and height */}
                    <Chart type="pie" data={data} options={options} />
                  </div>
                </Card>
              </div>
            </div>

            <div className='item'>
              <div className="card flex justify-content-center">
                <Card title={
                  <div className="card-header">
                    <span>Total No of Task</span>
                    <div className="three-dot-menu">
                      <Menu model={menuItems} popup ref={menuRef} className="right-aligned-menu" />
                      <Button
                        icon="pi pi-ellipsis-v"
                        className="p-button-rounded p-button-text"
                        aria-label="Options"
                        onClick={(e) => menuRef.current.toggle(e)}
                      />
                    </div>
                  </div>
                }
                >
                  <div className="dashboard-overview dashboard-overview-three-row">
                    <div className="dashboard-overview-item">
                      250
                      <p>In progress</p>
                    </div>
                    <div className="dashboard-overview-item">
                      170
                      <p>Pending</p>
                    </div>
                    <div className="dashboard-overview-item">
                      130
                      <p>Completed</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className='item'>
              <div className="card flex justify-content-center">
                <Card title={
                  <div className="card-header">
                    <span>Total No of Document</span>
                    <div className="three-dot-menu">
                      <Menu model={menuItems} popup ref={menuRef} className="right-aligned-menu" />
                      <Button
                        icon="pi pi-ellipsis-v"
                        className="p-button-rounded p-button-text"
                        aria-label="Options"
                        onClick={(e) => menuRef.current.toggle(e)}
                      />
                    </div>
                  </div>
                }
                >
                  <div className="dashboard-overview dashboard-overview-three-row">
                    <div className="dashboard-overview-item">
                      30
                      <p>Technical Doc</p>
                    </div>
                    <div className="dashboard-overview-item">
                      20
                      <p>Schematics</p>
                    </div>
                    <div className="dashboard-overview-item">
                      16
                      <p>Safety Docs</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className='item'>
              <div className='card flex justify-content-center'>
                <Card title={
                  <div className="card-header">
                    <span>Monthly Maintenance Trend</span>
                    <div className="filter-dropdown">
                      <Dropdown
                        value={selectedFilter2}
                        options={filterOptions2}
                        onChange={onFilterChange2}
                        placeholder="Select a filter"
                        className="p-dropdown-sm"
                      />
                    </div>
                  </div>
                }
                >
                  <div className="bar-chart-wrapper">
                    <Chart type="line" data={lineData} options={lineOptions} />
                  </div>
                </Card>
              </div>
            </div>

            <div className='item'>
              <div className='card flex justify-content-center'>
                <Card title={
                  <div className="card-header">
                    <span>Document Access Frequency</span>
                    <div className="filter-dropdown">
                      <Dropdown
                        value={selectedFilter1}
                        options={filterOptions1}
                        onChange={onFilterChange1}
                        placeholder="Select a filter"
                        className="p-dropdown-sm"
                      />
                    </div>
                  </div>
                }
                >
                  <div className="bar-chart-wrapper">
                    <Chart type="bar" data={barData} options={barOptions} />
                  </div>
                </Card>
              </div>
            </div>

            <div className='item'>
              <div className='card flex justify-content-center'>
                <Card title={
                  <div className="card-header">
                    <span>Upcoming Task</span>
                    <div className="filter-dropdown">
                      <Dropdown
                        value={selectedFilter1}
                        options={filterOptions1}
                        onChange={onFilterChange1}
                        placeholder="Select a filter"
                        className="p-dropdown-sm"
                      />
                    </div>
                  </div>
                }
                >
                  <div className="dashboard-overview">
                    <DataTable
                      value={tasks}
                      rows={10}
                      tableStyle={{ minWidth: '20rem' }}
                      rowClassName="pointer-row"
                    >
                      <Column field="name" header="Task name" style={{ width: '33%' }} body={loading ? skeletonTemplate : null} />
                      <Column field="priority" header="Priority" style={{ width: '33%' }} body={(rowData) => priorityTemplate(rowData)} />
                      <Column field="date" header="Due date" style={{ width: '33%' }} body={loading ? skeletonTemplate : null} />
                    </DataTable>
                  </div>
                </Card>
              </div>
            </div>


            <div className='item'>
              <div className='card flex justify-content-center'>
                <Card title={
                  <div className="card-header">
                    <span>Recent Document</span>
                    <div className="filter-dropdown">
                      <Dropdown
                        value={selectedFilter1}
                        options={filterOptions1}
                        onChange={onFilterChange1}
                        placeholder="Select a filter"
                        className="p-dropdown-sm"
                      />
                    </div>
                  </div>
                }
                >
                  <div className="dashboard-overview">
                    <DataTable
                      value={document}
                      rows={10}
                      tableStyle={{ minWidth: '20rem' }}
                      rowClassName="pointer-row"
                    >
                      <Column field="name" header="Document Name" style={{ width: '33%' }} />
                      <Column field="date" header="Date Added" style={{ width: '33%' }} />
                      <Column field="imageUrl" header="File Type" style={{ width: '33%' }} body={priorityTemplateImage} />
                    </DataTable>
                  </div>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardCrew;