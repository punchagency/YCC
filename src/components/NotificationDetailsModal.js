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
          <span className="detail-label">Title</span>
          <span className="detail-value">{notificationData?.title}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Type</span>
          <span className="detail-value">{notificationData?.type}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Target Type</span>
          <span className="detail-value">{notificationData?.targetType}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Description</span>
          <span className="detail-value">{notificationData?.description}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Priority</span>
          <span
            className={`detail-value priority-tag priority-${notificationData?.priority?.toLowerCase()}`}
            style={{ width: "100px"}}
          >
            {notificationData?.priority}
          </span>
        </div> 

        <div className="detail-row">
          <span className="detail-label">Status</span>
          <span
            className={`detail-value status-tag status-${notificationData?.status?.toLowerCase()}`}
          >
            {notificationData?.status}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Reference ID</span>
          <span className="detail-value">
            {notificationData?.bookingOrOrderId}
          </span>
        </div>

        {notificationData?.resolution && (
          <div className="detail-row">
            <span className="detail-label">Resolution</span>
            <span className="detail-value">{notificationData?.resolution}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Created</span>
          <span className="detail-value">
            {new Date(notificationData?.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Last Updated</span>
          <span className="detail-value">
            {new Date(notificationData?.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
    </Dialog>
  );
};

export default NotificationDetailsModal;
