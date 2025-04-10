import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";

const NotificationDetailsModal = ({ visible, onHide, notificationData }) => {
  const { t } = useTranslation();

  const renderDetailRow = (label, value, customStyle = {}) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #EAECF0",
        ...customStyle,
      }}
    >
      <span
        style={{
          color: "#344054",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "#475467",
          fontSize: "14px",
          maxWidth: "60%",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );

  const renderPriorityBadge = (priority) => {
    const priorityStyles = {
      high: { bg: "#E2F9F0", color: "#1A9E6D" },
      medium: { bg: "#FFFAEB", color: "#B54708" },
      low: { bg: "#E414171A", color: "#DB5F61" },
    };

    const style = priorityStyles[priority?.toLowerCase()] || priorityStyles.low;

    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.color,
          padding: "2px 8px",
          borderRadius: "16px",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        {priority}
      </span>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={t("notifications.details.title")}
      style={{
        width: "400px",
        borderRadius: "12px",
      }}
      headerStyle={{
        padding: "16px 24px",
        borderBottom: "1px solid #EAECF0",
        backgroundColor: "#F9FAFB",
        color: "#101828",
        fontSize: "16px",
        fontWeight: "600",
      }}
      contentStyle={{
        padding: "24px",
      }}
    >
      <div className="notification-details-content">
        {renderDetailRow(t("notifications.type"), notificationData?.type)}
        {renderDetailRow(
          t("notifications.details.relatedId"),
          notificationData?.relatedId || "ORD-1234"
        )}
        {renderDetailRow(
          t("notifications.details.vendorClient"),
          notificationData?.vendor || "Vendor A"
        )}
        {renderDetailRow("Description", notificationData?.description)}
        {renderDetailRow(
          "Priority",
          renderPriorityBadge(notificationData?.priority || "High")
        )}
        {renderDetailRow(
          "Timestamp",
          notificationData?.timestamp || "2025-03-21 14:30"
        )}
        {renderDetailRow(
          "History Log",
          notificationData?.historyLog || "Received At 14:30",
          {
            borderBottom: "none",
          }
        )}
      </div>
    </Dialog>
  );
};

export default NotificationDetailsModal;
