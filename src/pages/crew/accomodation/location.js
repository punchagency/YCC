import { React } from "react";

const Location = () => {
  return (
    <>
      <div className="p-3">
        <div
          className="crew-accommodation-header"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2
              style={{
                marginLeft: "20px",
                wordBreak: "break-word",
                fontSize: 22,
                marginBottom: 8,
                maxWidth: "100%",
              }}
            >
              Crew Accomodation
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
              justifyContent: "flex-end",
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            <select
              style={{
                width: "120px",
                minWidth: 0,
                padding: "5px 3px",
                borderRadius: "5px",
                border: "1px solid lightgrey",
                outline: "none",
                marginRight: "4px",
                fontSize: 14,
                maxWidth: "100%",
              }}
              className=""
              defaultValue=""
            >
              <option value="" disabled>
                All Locations
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <button
              style={{
                padding: "5px 10px",
                borderRadius: "5px",
                backgroundColor: "#007bff",
                color: "white",
                border: "1px solid #007bff",
                outline: "none",
                width: "90px",
                fontSize: 14,
                maxWidth: "100%",
                whiteSpace: "nowrap",
              }}
            >
              View Map
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Location;

// Add a mobile media query for extra safety
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @media (max-width: 600px) {
      .crew-accommodation-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 8px !important;
      }
      .crew-accommodation-header h2 {
        margin-left: 0 !important;
        font-size: 18px !important;
      }
      .crew-accommodation-header select,
      .crew-accommodation-header button {
        width: 100% !important;
        margin-right: 0 !important;
        font-size: 15px !important;
      }
    }
  `;
  document.head.appendChild(style);
}
