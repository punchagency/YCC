import React from "react";
import { Skeleton } from "primereact/skeleton";
import "./TableSkeleton.css";

export const SummaryCardSkeleton = () => {
  return (
    <div className="summary-section">
      <div className="summary-card-group">
        {[1, 2, 3].map((i) => (
          <div key={i} className="summary-card">
            <div className="summary-icon">
              <Skeleton width="32px" height="32px" borderRadius="8px" />
            </div>
            <div className="summary-content">
              <Skeleton width="60px" height="24px" className="mb-2" />
              <Skeleton width="80px" height="16px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton = ({ showSummary = true }) => {
  return (
    <div className="skeleton-wrapper">
      {/* Summary Cards Skeleton */}
      {showSummary && <SummaryCardSkeleton />}

      {/* Table Skeleton */}
      <div className="table-skeleton">
        {/* Table Header */}
        <div className="skeleton-header">
          <Skeleton width="200px" height="40px" />
          <div className="skeleton-actions">
            <Skeleton width="100px" height="36px" />
            <Skeleton width="100px" height="36px" />
          </div>
        </div>

        {/* Table Content */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-row">
            <Skeleton width="40px" height="20px" />
            <Skeleton width="150px" height="20px" />
            <Skeleton width="100px" height="20px" />
            <Skeleton width="120px" height="20px" />
            <Skeleton width="100px" height="20px" />
            <Skeleton width="80px" height="20px" />
            <Skeleton width="100px" height="20px" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Add this specific skeleton for notifications
export const NotificationTableSkeleton = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="table-skeleton">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-cell" style={{ width: '100px' }}>
              <div className="skeleton-badge"></div>
            </div>
            <div className="skeleton-cell" style={{ width: '150px' }}>
              <div className="skeleton-text"></div>
            </div>
            <div className="skeleton-cell" style={{ width: '300px' }}>
              <div className="skeleton-text"></div>
            </div>
            <div className="skeleton-cell" style={{ width: '150px' }}>
              <div className="skeleton-badge"></div>
            </div>
            <div className="skeleton-cell" style={{ width: '120px' }}>
              <div className="skeleton-button"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
