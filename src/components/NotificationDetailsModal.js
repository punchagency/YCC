import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";

const NotificationDetailsModal = ({ visible, onHide, notificationData }) => {
  const { t } = useTranslation();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onHide();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const renderPriorityBadge = (priority) => {
    const priorityStyles = {
      urgent: { bg: "#FEF3F2", color: "#B42318", icon: "🚨" },
      high: { bg: "#ECFDF3", color: "#027A48", icon: "⚠️" },
      medium: { bg: "#FFFAEB", color: "#B54708", icon: "📋" },
      low: { bg: "#F2F4F7", color: "#344054", icon: "ℹ️" },
    };

    const style = priorityStyles[priority?.toLowerCase()] || priorityStyles.medium;

    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.color,
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          border: `1px solid ${style.color}20`,
        }}
      >
        <span>{style.icon}</span>
        {priority?.toUpperCase() || "MEDIUM"}
      </span>
    );
  };

  const renderStatusBadge = (read) => {
    const statusStyle = read 
      ? { bg: "#ECFDF3", color: "#027A48", icon: "✓" }
      : { bg: "#FEF3F2", color: "#B42318", icon: "●" };

    return (
      <span
        style={{
          backgroundColor: statusStyle.bg,
          color: statusStyle.color,
          padding: "4px 10px",
          borderRadius: "16px",
          fontSize: "11px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "10px" }}>{statusStyle.icon}</span>
        {read ? "READ" : "UNREAD"}
      </span>
    );
  };

  const renderDetailRow = (label, value, customStyle = {}) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "16px 0",
        borderBottom: "1px solid #F2F4F7",
        ...customStyle,
      }}
    >
      <span
        style={{
          color: "#667085",
          fontSize: "12px",
          fontWeight: "500",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>
      <div
        style={{
          color: "#101828",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "1.5",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );

  const getNotificationTypeIcon = (type) => {
    const typeIcons = {
      'order': '📦',
      'booking': '📅',
      'inventory': '📋',
      'system': '⚙️',
      'complaint-filed': '🚨',
      'complaint-updated': '📝',
      'complaint-resolved': '✅',
      'flagged-order': '🚩',
      'reorder-notification': '🔄',
    };
    return typeIcons[type] || '📢';
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>
                  {getNotificationTypeIcon(notificationData?.type)}
                </span>
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1F2937',
                  }}>
                    {t("Notification Details")}
                  </h2>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '14px',
                    color: '#6B7280',
                  }}>
                    {notificationData?.type || "System Notification"}
                  </p>
                </div>
              </div>
              <button
                onClick={onHide}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#F3F4F6',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#E5E7EB';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#F3F4F6';
                }}
              >
                <CloseIcon style={{ fontSize: '18px', color: '#6B7280' }} />
              </button>
            </div>

            {/* Content */}
            <div style={{
              padding: '24px',
              overflowY: 'auto',
              maxHeight: 'calc(90vh - 80px)',
            }}>
              {notificationData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Priority and Status Row */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                  }}>
                    {renderPriorityBadge(notificationData.priority)}
                    {renderStatusBadge(notificationData.read)}
                  </div>

                  {/* Notification Content */}
                  {renderDetailRow(
                    "Title",
                    notificationData.title || "No title available"
                  )}
                  
                  {renderDetailRow(
                    "Message",
                    notificationData.message || "No message available"
                  )}

                  {notificationData.type && renderDetailRow(
                    "Type",
                    <span style={{
                      backgroundColor: '#F3F4F6',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#374151',
                    }}>
                      {notificationData.type.replace('-', ' ').toUpperCase()}
                    </span>
                  )}

                  {notificationData.createdAt && renderDetailRow(
                    "Created",
                    formatDate(notificationData.createdAt)
                  )}

                  {notificationData.updatedAt && notificationData.updatedAt !== notificationData.createdAt && (
                    renderDetailRow(
                      "Last Updated",
                      formatDate(notificationData.updatedAt)
                    )
                  )}

                  {notificationData.complaint && renderDetailRow(
                    "Related Complaint",
                    <span style={{
                      backgroundColor: '#EFF6FF',
                      color: '#1D4ED8',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}>
                      Complaint #{notificationData.complaint._id?.slice(-8) || 'N/A'}
                    </span>
                  )}

                  {/* Remove border from last item */}
                  <div style={{ borderBottom: 'none' }} />
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6B7280',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>
                    No Notification Data
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    Unable to load notification details
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDetailsModal; 