"use client";

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isMobile = false,
  isTablet = false,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className="pagination"
      style={{
        marginTop: isMobile ? "24px" : "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isMobile ? "12px" : "16px",
        padding: isMobile ? "0 16px" : "0",
      }}
    >
      {/* Results info */}
      <div
        style={{
          color: "#667085",
          fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
        results
      </div>

      {/* Pagination controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "4px" : "8px",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          padding: isMobile ? "8px" : "12px",
          borderRadius: "12px",
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0",
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: isMobile ? "32px" : "36px",
            height: isMobile ? "32px" : "36px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            backgroundColor: currentPage === 1 ? "#f8fafc" : "#ffffff",
            color: currentPage === 1 ? "#9ca3af" : "#374151",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            fontSize: isMobile ? "12px" : "14px",
            flexShrink: 0,
          }}
          title="Previous page"
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.target.style.backgroundColor = "#0387D9";
              e.target.style.borderColor = "#0387D9";
              e.target.style.color = "#ffffff";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(3, 135, 217, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.color = "#374151";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }
          }}
        >
          <i className="pi pi-chevron-left" />
        </button>

        {/* Page numbers */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "2px" : "4px",
          }}
        >
          {(() => {
            const pages = [];
            const showPages = isMobile ? 3 : 5;
            let startPage = Math.max(
              1,
              currentPage - Math.floor(showPages / 2)
            );
            const endPage = Math.min(totalPages, startPage + showPages - 1);

            if (endPage - startPage + 1 < showPages) {
              startPage = Math.max(1, endPage - showPages + 1);
            }

            // First page
            if (startPage > 1) {
              pages.push(
                <button
                  key={1}
                  onClick={() => onPageChange(1)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isMobile ? "28px" : "32px",
                    height: isMobile ? "28px" : "32px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "500",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0387D9";
                    e.target.style.borderColor = "#0387D9";
                    e.target.style.color = "#ffffff";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.color = "#374151";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  1
                </button>
              );

              if (startPage > 2) {
                pages.push(
                  <span
                    key="dots1"
                    style={{
                      color: "#9ca3af",
                      fontSize: isMobile ? "12px" : "14px",
                      padding: "0 4px",
                      flexShrink: 0,
                    }}
                  >
                    ...
                  </span>
                );
              }
            }

            // Page numbers
            for (let i = startPage; i <= endPage; i++) {
              const isActive = i === currentPage;
              pages.push(
                <button
                  key={i}
                  onClick={() => onPageChange(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isMobile ? "28px" : "32px",
                    height: isMobile ? "28px" : "32px",
                    borderRadius: "6px",
                    border: isActive
                      ? "2px solid #0387D9"
                      : "1px solid #e2e8f0",
                    backgroundColor: isActive ? "#0387D9" : "#ffffff",
                    color: isActive ? "#ffffff" : "#374151",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: isActive ? "600" : "500",
                    boxShadow: isActive
                      ? "0 4px 12px rgba(3, 135, 217, 0.3)"
                      : "none",
                    transform: isActive ? "translateY(-1px)" : "translateY(0)",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = "#f1f5f9";
                      e.target.style.borderColor = "#cbd5e1";
                      e.target.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {i}
                </button>
              );
            }

            // Last page
            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pages.push(
                  <span
                    key="dots2"
                    style={{
                      color: "#9ca3af",
                      fontSize: isMobile ? "12px" : "14px",
                      padding: "0 4px",
                      flexShrink: 0,
                    }}
                  >
                    ...
                  </span>
                );
              }

              pages.push(
                <button
                  key={totalPages}
                  onClick={() => onPageChange(totalPages)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isMobile ? "28px" : "32px",
                    height: isMobile ? "28px" : "32px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "500",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0387D9";
                    e.target.style.borderColor = "#0387D9";
                    e.target.style.color = "#ffffff";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.color = "#374151";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: isMobile ? "32px" : "36px",
            height: isMobile ? "32px" : "36px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            backgroundColor: currentPage === totalPages ? "#f8fafc" : "#ffffff",
            color: currentPage === totalPages ? "#9ca3af" : "#374151",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            fontSize: isMobile ? "12px" : "14px",
            flexShrink: 0,
          }}
          title="Next page"
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.backgroundColor = "#0387D9";
              e.target.style.borderColor = "#0387D9";
              e.target.style.color = "#ffffff";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(3, 135, 217, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.color = "#374151";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }
          }}
        >
          <i className="pi pi-chevron-right" />
        </button>
      </div>
    </div>
  );
};
