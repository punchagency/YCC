import { Dialog } from "primereact/dialog";

const NotificationDetailsModal = ({ visible, onHide, notificationData }) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Notification Details"
      className="notification-details-modal"
      style={{ width: "450px" }}
    >
      <div className="notification-details-content">
        <div className="detail-row">
          <span className="detail-label">Type</span>
          <span className="detail-value">{notificationData?.type}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Related ID</span>
          <span className="detail-value">{notificationData?.relatedId}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Vendor/Client</span>
          <span className="detail-value">{notificationData?.vendor}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Description</span>
          <span className="detail-value">{notificationData?.description}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Priority</span>
          <span
            className={`detail-value priority-tag priority-${notificationData?.priority?.toLowerCase()}`}
          >
            {notificationData?.priority}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Timestamp</span>
          <span className="detail-value">{notificationData?.timestamp}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">History Log</span>
          <span className="detail-value">{notificationData?.historyLog}</span>
        </div>
      </div>
    </Dialog>
  );
};

export default NotificationDetailsModal;
