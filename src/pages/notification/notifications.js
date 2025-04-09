import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import sortNotification from "../../assets/images/crew/sortnotification.png";
import NotificationDetailsModal from "../../components/NotificationDetailsModal";

export default function Notifications({ role }) {
  const menuRight = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const notificationData = [
    {
      id: 1,
      title: "Priority",
      icon: sortNotification,
    },
    {
      id: 2,
      title: "Type",
      icon: sortNotification,
    },
    {
      id: 3,
      title: "Description",
      icon: sortNotification,
    },
    {
      id: 4,
      title: "Status",
      icon: sortNotification,
    },
    {
      id: 5,
      title: "Details",
      icon: sortNotification,
    },
  ];

  const notificationBodyData = [
    [
      { id: 1, title: "High" },
      { id: 2, title: "Booking Issue" },
      { id: 3, title: "Client Reported.." },
      { id: 4, title: "Assign To Manager" },
      { id: 5, title: "View Details" },
    ],
    [
      { id: 1, title: "Low" },
      { id: 2, title: "Payment Error" },
      { id: 3, title: "Transaction Failed Due...." },
      { id: 4, title: "Acknowledged" },
      { id: 5, title: "View Details" },
    ],
    [
      { id: 1, title: "High" },
      { id: 2, title: "Supplier Delay" },
      { id: 3, title: "Client Wants To Cancel Reservation" },
      { id: 4, title: "Resolve & Archive" },
      { id: 5, title: "View Details" },
    ],
    [
      { id: 1, title: "Medium" },
      { id: 2, title: "Booking Issue" },
      { id: 3, title: "Client Updated Their Contact Information" },
      { id: 4, title: "Acknowledged" },
      { id: 5, title: "View Details" },
    ],
    [
      { id: 1, title: "Low" },
      { id: 2, title: "Payment Error" },
      { id: 3, title: "Client Inquired About Their Status" },
      { id: 4, title: "Resolve & Archive" },
      { id: 5, title: "View Details" },
    ],
    [
      { id: 1, title: "High" },
      { id: 2, title: "Supplier Delay" },
      { id: 3, title: "Client Asked About Additional Services" },
      { id: 4, title: "Assign To Manager" },
      { id: 5, title: "View Details" },
    ],
    [
      { id: 1, title: "Medium" },
      { id: 2, title: "Booking Issue" },
      { id: 3, title: "Client Requested Special Arrangements" },
      { id: 4, title: "Acknowledged" },
      { id: 5, title: "View Details" },
    ],
    [
      { id: 1, title: "Low" },
      { id: 2, title: "Payment Error" },
      {
        id: 3,
        title: "Client Submitted A Refund Request ",
      },
      { id: 4, title: "Resolve & Archive" },
      { id: 5, title: "View Details" },
    ],
  ];

  const filteredNotifications = notificationBodyData.filter((row) => {
    if (activeFilter === "all") return true;
    return row[0].title.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleViewDetails = (row) => {
    const modalData = {
      type: row[1].title,
      relatedId: row[2].title,
      vendor: row[3].title,
      description: row[4].title,
      priority: row[0].title,
      status: row[3].title,
      timestamp: row[4].title,
    };
    setSelectedNotification(modalData);
    setShowModal(true);
  };

  return (
    <>
      <div className="notification-container">
        {/* Header Section */}
        <div className="notification-header">
          <div className="header-title">
            <h3>Notifications</h3>
            <Badge value="20" severity="danger" />
          </div>
        </div>

        {/* Filter Section */}
        <div className="notification-filter">
          <div className="filter-scroll-container">
            <div
              className={`filter-item ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => handleFilterClick("all")}
            >
              All Notification
            </div>
            <div
              className={`filter-item ${activeFilter === "high" ? "active" : ""}`}
              onClick={() => handleFilterClick("high")}
            >
              High Priority
            </div>
            <div
              className={`filter-item ${activeFilter === "medium" ? "active" : ""}`}
              onClick={() => handleFilterClick("medium")}
            >
              Medium Priority
            </div>
            <div
              className={`filter-item ${activeFilter === "low" ? "active" : ""}`}
              onClick={() => handleFilterClick("low")}
            >
              Low Priority
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
          
        <div className="notification-mobile-view">
          {filteredNotifications.map((row, index) => (
            <div key={index} className="notification-card">
              <div className="notification-card-header">
                <div className={`priority-badge priority-${row[0].title.toLowerCase()}`}>
                  {row[0].title}
                </div>
                <div className="notification-type">{row[1].title}</div>
              </div>
              <div className="notification-description">{row[2].title}</div>
              <div className="notification-card-footer">
                <div className={`status-badge status-${row[3].title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {row[3].title}
                </div>
                <Button
                  label="View Details"
                  className="p-button-outlined p-button-primary"
                  onClick={() => handleViewDetails(row)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="notification-table-container desktop-only">
          <table className="notification-table">
            <thead>
              <tr className="header-row">
                {notificationData.map((item) => (
                  <th key={item.id} className="header-cell">
                    <div className="header-content">
                      <span>{item.title}</span>
                      <img
                        src={item.icon}
                        alt="sortNotification"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((row, rowIndex) => (
                <tr key={rowIndex} className="body-row">
                  {row.map((item, index) => (
                    <td key={item.id} className="body-cell">
                      <div
                        className={`body-content ${
                          index === 0
                            ? `priority-${item.title.toLowerCase()}`
                            : index === 3
                            ? `status-${item.title.toLowerCase().replace(/[&\s]+/g, "-")}`
                            : ""
                        }`}
                      >
                        {index === 4 ? (
                          <Button
                            label={item.title}
                            className="p-button-outlined p-button-primary view-details-btn"
                            onClick={() => handleViewDetails(row)}
                          />
                        ) : (
                          <span>{item.title}</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NotificationDetailsModal
        visible={showModal}
        onHide={() => setShowModal(false)}
        notificationData={selectedNotification}
      />
    </>
  );
}
