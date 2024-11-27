import React, { useRef, useState } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import LeftMenu from '../components/menu';
import AdminHeader from '../components/header';
import SubHeaderPanel from '../components/sub-header';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';

const Dashboard = () => {
  const menuRef = useRef(null);

  const menuItems = [
    { label: 'Refresh', icon: 'pi pi-refresh', command: () => console.log('Refresh clicked') },
    { label: 'Settings', icon: 'pi pi-cog', command: () => console.log('Settings clicked') },
    { label: 'Help', icon: 'pi pi-question', command: () => console.log('Help clicked') },
  ];
  const data = {
    labels: ['Paid (39%)', 'Unpaid (34%)', 'Overdue (26%)'],
    datasets: [
        {
            data: [39, 34, 26],
            backgroundColor: ['#2aa8fa', '#494ab9', '#fc5d35'],
            hoverBackgroundColor: ['#0d7cc1', '#2e3096', '#d64420']
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
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Payments',
        data: [30, 40, 25, 60, 55, 70, 50, 65, 80, 90, 100, 110],
        backgroundColor: [
          'rgba(255, 196, 87, 0.2)',
          'rgba(253, 88, 121, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(200, 202, 205, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgb(255, 196, 87)',
          'rgb(253, 88, 121)',
          'rgb(255, 159, 64)',
          'rgb(200, 202, 205)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)'
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
        borderColor: '#fd5879', // Line color
        tension: 0.4, // Smoothness of the line
        borderWidth: 2, // Line width
        pointBackgroundColor: '#fd5879', // Point color
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

  return (
    <main className="flex h-screen page">
      <LeftMenu />
      <div className='w-full right-panel-component'>
        <AdminHeader />
        <SubHeaderPanel />
        <div className='card-wrapper-gap'>
          <div className='v-grid v-grid-two-column'>
            <div className='item'>
              <div className="card flex justify-content-center">
                <Card title={
                    <div className="card-header">
                      <span>Vessels Overview</span>
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
                  <div className="dashboard-overview">
                    <div className="dashboard-overview-item">
                      220
                      <p>Total no of Vessels</p>
                    </div>
                    <div className="dashboard-overview-item">
                      296
                      <p>Active Vessels</p>
                    </div>
                    <div className="dashboard-overview-item">
                      20
                      <p>Inactive Vessels</p>
                    </div>
                    <div className="dashboard-overview-item">
                      04
                      <p>Out of Services</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div className='item'>
              <div className="card flex justify-content-center">
                <Card title={
                    <div className="card-header">
                      <span>Vessles Type</span>
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
                  <div className="dashboard-overview">
                    <div className="dashboard-overview-item">
                      99
                      <p>Motor Yacht</p>
                    </div>
                    <div className="dashboard-overview-item">
                      121
                      <p>Sailing Yacht</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div className='item'>
              <div className="card flex justify-content-center">
                <Card title={
                    <div className="card-header">
                      <span>Inspection Outcome</span>
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
                  <div className="dashboard-overview">
                    <div className="dashboard-overview-item">
                      20
                      <p>No issues</p>
                    </div>
                    <div className="dashboard-overview-item">
                      12
                      <p>Passed with Observations</p>
                    </div>
                    <div className="dashboard-overview-item">
                      3
                      <p>Failed</p>
                    </div>
                    <div className="dashboard-overview-item">
                      30
                      <p>Passed with Deficiencies</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div className='item'>
              <div className="card flex justify-content-center">
                <Card title={
                    <div className="card-header">
                      <span>Payment reminders</span>
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
                  <div className="dashboard-overview">
                    <div className="dashboard-overview-item">
                      0
                      <p>Overdue</p>
                    </div>
                    <div className="dashboard-overview-item">
                      2
                      <p>Due Soon</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div className='item'>
              <div className='card flex justify-content-center'>
                <Card title={
                    <div className="card-header">
                      <span>Invoice payment status</span>
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
              <div className='card flex justify-content-center'>
                <Card title={
                    <div className="card-header">
                      <span>Monthly Expenses</span>
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
                      <span>Total revenue</span>
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

          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;