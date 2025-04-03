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
      <div className="flex align-items-center justify-content-between sub-header-panel">
        {/* Left Section: Heading and Subheading */}
        <div className="sub-header-left">
          <div className="flex align-items-center">
            <h3 className="mr-2">Notifications </h3>
            <Badge
              value="20"
              severity="danger"
              style={{ backgroundColor: "#EF4444 !important" }}
            ></Badge>
          </div>
        </div>
      </div>
      <div className="notification-filter">
        <div className="all-notification">All Notification</div>
        <div>High Priority</div>
        <div>Medium Priority</div>
        <div>Low Priority</div>
      </div>
      <div className="notification-table-container">
        <table className="notification-table">
          <thead>
            <tr className="header-row">
              {notificationData.map((item) => (
                <th key={item.id} className="header-cell">
                  <div className="header-content">
                    <span>{item.title}</span>
                    <img src={item.icon} alt="sortNotification" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notificationBodyData.map((row, rowIndex) => (
              <tr key={rowIndex} className="body-row">
                {row.map((item, index) => (
                  <td key={item.id} className="body-cell">
                    <div
                      className={`body-content ${
                        index === 0
                          ? `priority-${item.title.toLowerCase()}`
                          : index === 3
                          ? `status-${item.title
                              .toLowerCase()
                              .replace(/[&\s]+/g, "-")}`
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
      <NotificationDetailsModal
        visible={showModal}
        onHide={() => setShowModal(false)}
        notificationData={selectedNotification}
      />
    </>
  );
}
