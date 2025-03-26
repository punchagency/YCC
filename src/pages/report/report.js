import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import lone from "../../assets/images/crew/lone.png";
import upcomingLogo from "../../assets/images/crew/upcomingorderLogo.png";
import iconexpire from "../../assets/images/crew/iconexpire.png";
import iconcareer from "../../assets/images/crew/iconcareer.png";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import sourceData from "../../data/sourceData.json";
import analyticsData from "../../data/analyticsData.json";
import sort from "../../assets/images/crew/sort.png";
import editLogo from "../../assets/images/crew/editLogo.png";
import deleteLogo from "../../assets/images/crew/deleteLogo.png";
import plus from "../../assets/images/crew/plus.png";
import lockLogo from "../../assets/images/crew/lockLogo.png";
import dropdown from "../../assets/images/crew/dropdown.png";
import cart from "../../assets/images/crew/cart.png";
import iconcontainer from "../../assets/images/crew/iconContainer.png";
import neworder from "../../assets/images/crew/neworder.png";
import doctor from "../../assets/images/crew/doctor.png";
import wavyline from "../../assets/images/crew/wavyline.png";
import wavyback from "../../assets/images/crew/wavyback.png";
import profileReport from "../../assets/images/crew/profile-report.png";
import profileReport2 from "../../assets/images/crew/profile-report2.png";

const Reports = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goCrewDashboardPage = () => {
    navigate("/crew/dashboard");
  };
  const goInventorySummaryPage = () => {
    navigate("/crew/inventory/summary");
  };

  const activityChartData = {
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
    datasets: [
      {
        data: [320, 280, 150, 200, 350, 290, 220, 190, 280, 390, 250, 380],
        backgroundColor: "#1B59F8",
        barThickness: 8,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 400,
        ticks: {
          stepSize: 100,
          font: {
            size: 10,
          },
          color: "#666",
        },
        grid: {
          color: "#F2F7FF",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          color: "#666",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.4,
      },
    },
  };

  // Render mobile order summary cards
  const renderMobileOrderSummary = () => {
    return (
      <div style={{ padding: '0 10px', marginBottom: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '10px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <img src={lockLogo} alt="lockLogo" style={{ width: '20px', height: '20px' }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ margin: '0 5px 0 0', fontSize: '14px' }}>This week</p>
              <img src={dropdown} alt="dropdown" style={{ width: '12px', height: '12px' }} />
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px',
            textAlign: 'center'
          }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>All Orders</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>0</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>Pending</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>0</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>Completed</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>0</p>
            </div>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '10px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <img src={lockLogo} alt="lockLogo" style={{ width: '20px', height: '20px' }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ margin: '0 5px 0 0', fontSize: '14px' }}>This week</p>
              <img src={dropdown} alt="dropdown" style={{ width: '12px', height: '12px' }} />
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px',
            textAlign: 'center'
          }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>Canceled</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>0</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>Returned</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>0</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>Damaged</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>0</p>
            </div>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '10px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <img src={cart} alt="cart" style={{ width: '20px', height: '20px' }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ margin: '0 5px 0 0', fontSize: '14px' }}>This week</p>
              <img src={dropdown} alt="dropdown" style={{ width: '12px', height: '12px' }} />
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            textAlign: 'center'
          }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#EF4444' }}>Abandoned Cart</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>0</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>Customers</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>0</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render mobile topics and activity
  const renderMobileTopicsAndActivity = () => {
    return (
      <div style={{ padding: '0 10px', marginBottom: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '15px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Strongest Topics</h3>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '15px' 
          }}>
            <img src={doctor} alt="doctor" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ 
                height: '8px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '4px',
                marginBottom: '5px'
              }}>
                <div style={{ 
                  width: '95%', 
                  height: '100%', 
                  backgroundColor: '#4CD964', 
                  borderRadius: '4px' 
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '12px' }}>95% correct</span>
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '15px' 
          }}>
            <img src={profileReport} alt="profileReport" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ 
                height: '8px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '4px',
                marginBottom: '5px'
              }}>
                <div style={{ 
                  width: '65%', 
                  height: '100%', 
                  backgroundColor: '#4CD964', 
                  borderRadius: '4px' 
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '12px' }}>65% correct</span>
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <img src={profileReport2} alt="profileReport2" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ 
                height: '8px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '4px',
                marginBottom: '5px'
              }}>
                <div style={{ 
                  width: '45%', 
                  height: '100%', 
                  backgroundColor: '#4CD964', 
                  borderRadius: '4px' 
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '12px' }}>45% correct</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '15px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ margin: '0', fontSize: '16px' }}>Activity</h3>
            <span style={{ fontSize: '12px', color: '#666' }}>Month</span>
          </div>
          
          <div style={{ height: '180px' }}>
            <Bar data={activityChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    );
  };

  // Render mobile product table
  const renderMobileProductTable = () => {
    const products = [
      { name: "Safety Vest #1", sales: 245, type: "Standard", id: "#TRK-001", total: "$3,500.00", profit: "$875.00" },
      { name: "First Aid Kit Pro", sales: 189, type: "Express", id: "#TRK-002", total: "$4,725.00", profit: "$1,181.25" },
      { name: "Engine Oil Filter", sales: 312, type: "Standard", id: "#TRK-003", total: "$2,808.00", profit: "$702.00" },
      { name: "Navigation Compass", sales: 156, type: "Express", id: "#TRK-004", total: "$5,460.00", profit: "$1,365.00" },
      { name: "Life Jacket Type III", sales: 278, type: "Standard", id: "#TRK-005", total: "$3,475.00", profit: "$868.75" },
      { name: "Hydraulic Fluid", sales: 423, type: "Express", id: "#TRK-006", total: "$2,780.25", profit: "$695.06" },
      { name: "LED Floodlight", sales: 167, type: "Standard", id: "#TRK-007", total: "$3,172.33", profit: "$793.08" },
    ];
    
    return (
      <div style={{ padding: '0 10px', marginBottom: '20px' }}>
        {products.map((product, index) => (
          <div 
            key={index} 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: 'bold' }}>{product.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#666' }}>ID: {product.id}</span>
                <span style={{ 
                  fontSize: '12px', 
                  backgroundColor: product.type === 'Express' ? '#e6f7ee' : '#e6f0ff',
                  color: product.type === 'Express' ? '#1d9d74' : '#3366ff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  {product.type}
                </span>
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '13px'
            }}>
              <div>
                <span style={{ color: '#666' }}>Sales: </span>
                <span style={{ fontWeight: '500' }}>{product.sales}</span>
              </div>
              <div>
                <span style={{ color: '#666' }}>Total: </span>
                <span style={{ fontWeight: '500' }}>{product.total}</span>
              </div>
              <div>
                <span style={{ color: '#666' }}>Profit: </span>
                <span style={{ fontWeight: '500', color: '#1d9d74' }}>{product.profit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render mobile active users
  const renderMobileActiveUsers = () => {
    return (
      <div style={{ padding: '0 10px', marginBottom: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '10px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Active Users</h3>
          
          {[1, 2, 3, 4].map((item, index) => (
            <div 
              key={index}
              style={{
                marginBottom: index < 3 ? '15px' : '0',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px'
              }}>
                <span style={{ fontSize: '14px' }}>Active users</span>
                <span style={{ fontSize: '14px' }}>
                  27/<i style={{ color: '#666', fontStyle: 'normal' }}>80</i>
                </span>
              </div>
              
              <div style={{
                backgroundImage: `url(${wavyback})`,
                width: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src={wavyline} alt="wavyline" style={{ maxWidth: '100%', height: '20px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Reports</h3>
          </div>
        </div>
      </div>

      {isMobile ? (
        // Mobile view
        <>
          {renderMobileOrderSummary()}
          {renderMobileTopicsAndActivity()}
          {renderMobileProductTable()}
          {renderMobileActiveUsers()}
        </>
      ) : (
        // Desktop view - keep existing layout
        <>
          <div className="box-order-container">
            <div className="box1-order">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 9px",
                }}
              >
                <div>
                  <img src={lockLogo} alt="lockLogo" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p style={{ marginRight: "5px" }}>This week</p>
                  <img
                    src={dropdown}
                    alt="dropdown"
                    style={{ width: "15px", height: "15px" }}
                  />
                </div>
              </div>
              <div className="pending-order-container">
                <div>
                  <p>All Orders</p>
                  <p>0</p>
                </div>
                <div>
                  <p>Pending</p>
                  <p>0</p>
                </div>
                <div>
                  <p>Completed</p>
                  <p>0</p>
                </div>
              </div>
            </div>
            <div className="box1-order">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 9px",
                }}
              >
                <div>
                  <img src={lockLogo} alt="lockLogo" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p style={{ marginRight: "5px" }}>This week</p>
                  <img
                    src={dropdown}
                    alt="dropdown"
                    style={{ width: "15px", height: "15px" }}
                  />
                </div>
              </div>
              <div className="pending-order-container">
                <div>
                  <p>Canceled</p>
                  <p>0</p>
                </div>
                <div>
                  <p>Returned</p>
                  <p>0</p>
                </div>
                <div>
                  <p>Damaged</p>
                  <p>0</p>
                </div>
              </div>
            </div>
            <div className="box1-order">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 9px",
                }}
              >
                <div>
                  <img src={cart} alt="cart" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p style={{ marginRight: "5px" }}>This week</p>
                  <img
                    src={dropdown}
                    alt="dropdown"
                    style={{ width: "15px", height: "15px" }}
                  />
                </div>
              </div>
              <div className="pending-order-container">
                <div>
                  <p style={{ color: "#EF4444" }}>Abandoned Cart</p>
                  <p>0</p>
                </div>
                <div>
                  <p>Customers</p>
                  <p>0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="report-container">
            <div className="report-container-1">
              <div className="reportdiv">
                <div className="fbox">
                  <p style={{ textAlign: "left", fontSize: "11px" }}>
                    Strongest Topics
                  </p>
                  <div className="progress-container">
                    <img src={doctor} alt="lone" />
                    <div className="progress-container-1">
                      <div className="progress-container-1-1"></div>
                    </div>
                    <div className="progress-value">
                      <span style={{ fontSize: "10px" }}>95%</span>
                      <span style={{ fontSize: "10px" }}>correct</span>
                    </div>
                  </div>

                  {/* Second Progress Bar */}
                  <div className="progress-container" style={{ marginTop: "20px" }}>
                    <img src={profileReport} alt="container" />
                    <div className="progress-container-1">
                      <div
                        className="progress-container-1-1"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <div className="progress-value">
                      <span style={{ fontSize: "10px" }}>65%</span>
                      <span style={{ fontSize: "10px" }}>correct</span>
                    </div>
                  </div>

                  {/* Third Progress Bar */}
                  <div className="progress-container" style={{ marginTop: "20px" }}>
                    <img src={profileReport2} alt="neworder" />
                    <div className="progress-container-1">
                      <div
                        className="progress-container-1-1"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                    <div className="progress-value">
                      <span style={{ fontSize: "10px" }}>45%</span>
                      <span style={{ fontSize: "10px" }}>correct</span>
                    </div>
                  </div>
                </div>
                <div className="activity-container-1">
                  <div className="activity-container">
                    <h3>Activity</h3>
                    <p>Month</p>
                  </div>
                  <div style={{ height: "150px", marginTop: "10px" }}>
                    <Bar data={activityChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Sales</th>
                      <th>Order Type</th>
                      <th>Tracking ID</th>
                      <th>Order Total</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Safety Vest #1</td>
                      <td>245</td>
                      <td>Standard</td>
                      <td>#TRK-001</td>
                      <td>$3,500.00</td>
                      <td>$875.00</td>
                    </tr>
                    <tr>
                      <td>First Aid Kit Pro</td>
                      <td>189</td>
                      <td>Express</td>
                      <td>#TRK-002</td>
                      <td>$4,725.00</td>
                      <td>$1,181.25</td>
                    </tr>
                    <tr>
                      <td>Engine Oil Filter</td>
                      <td>312</td>
                      <td>Standard</td>
                      <td>#TRK-003</td>
                      <td>$2,808.00</td>
                      <td>$702.00</td>
                    </tr>
                    <tr>
                      <td>Navigation Compass</td>
                      <td>156</td>
                      <td>Express</td>
                      <td>#TRK-004</td>
                      <td>$5,460.00</td>
                      <td>$1,365.00</td>
                    </tr>
                    <tr>
                      <td>Life Jacket Type III</td>
                      <td>278</td>
                      <td>Standard</td>
                      <td>#TRK-005</td>
                      <td>$3,475.00</td>
                      <td>$868.75</td>
                    </tr>
                    <tr>
                      <td>Hydraulic Fluid</td>
                      <td>423</td>
                      <td>Express</td>
                      <td>#TRK-006</td>
                      <td>$2,780.25</td>
                      <td>$695.06</td>
                    </tr>
                    <tr>
                      <td>LED Floodlight</td>
                      <td>167</td>
                      <td>Standard</td>
                      <td>#TRK-007</td>
                      <td>$3,172.33</td>
                      <td>$793.08</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="active-users-container-1">
                <div className="active-users-container">
                  <span>Active users</span>
                  <span>
                    27/<i>80</i>
                  </span>
                  <div
                    style={{
                      backgroundImage: `url(${wavyback})`,
                      width: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <img src={wavyline} alt="wavyline" />
                  </div>
                </div>
                <div className="active-users-container">
                  <span>Active users</span>
                  <span>
                    27/<i>80</i>
                  </span>
                  <div
                    style={{
                      backgroundImage: `url(${wavyback})`,
                      width: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <img src={wavyline} alt="wavyline" />
                  </div>
                </div>
                <div className="active-users-container">
                  <span>Active users</span>
                  <span>
                    27/<i>80</i>
                  </span>
                  <div
                    style={{
                      backgroundImage: `url(${wavyback})`,
                      width: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <img src={wavyline} alt="wavyline" />
                  </div>
                </div>
                <div className="active-users-container">
                  <span>Active users</span>
                  <span>
                    27/<i>80</i>
                  </span>
                  <div
                    style={{
                      backgroundImage: `url(${wavyback})`,
                      width: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <img src={wavyline} alt="wavyline" />
                  </div>
                </div>
                <div className="active-users-container">
                  <span>Active users</span>
                  <span>
                    27/<i>80</i>
                  </span>
                  <div
                    style={{
                      backgroundImage: `url(${wavyback})`,
                      width: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <img src={wavyline} alt="wavyline" />
                  </div>
                </div>
                <div className="active-users-container">
                  <span>Active users</span>
                  <span>
                    27/<i>80</i>
                  </span>
                  <div
                    style={{
                      backgroundImage: `url(${wavyback})`,
                      width: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <img src={wavyline} alt="wavyline" />
                  </div>
                </div>
                <div className="active-users-container">
                  <span>Active users</span>
                  <span>
                    27/<i>80</i>
                  </span>
                  <div
                    style={{
                      backgroundImage: `url(${wavyback})`,
                      width: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <img src={wavyline} alt="wavyline" />
                  </div>
                </div>
                <div className="active-users-container">
                  <span>Active users</span>
                  <span>
                    27/<i>80</i>
                  </span>
                  <div
                    style={{
                      backgroundImage: `url(${wavyback})`,
                      width: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <img src={wavyline} alt="wavyline" />
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Reports;
