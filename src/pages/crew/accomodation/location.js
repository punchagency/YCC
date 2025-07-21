import { React, useState } from "react";
import { useAccommodation } from "../../../context/accommodation/accommodationContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Location = () => {
  const {
    locations,
    filters,
    setFilters,
    loading,
    fetchAccommodations,
    accommodations,
  } = useAccommodation();
  const [searchLocation, setSearchLocation] = useState("");
  const [showMap, setShowMap] = useState(false);

  const handleLocationChange = (e) => {
    const location = e.target.value;
    setSearchLocation(location);
    if (location) {
      setFilters({ location, page: 1 });
      fetchAccommodations({ location });
    }
  };

  const handleSearch = () => {
    if (searchLocation) {
      setFilters({ location: searchLocation, page: 1 });
      fetchAccommodations({ location: searchLocation });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Default map center (Paris)
  const defaultCenter = [48.8566, 2.3522];

  // Get all valid coordinates from accommodations
  const validMarkers = (accommodations || []).filter(
    (acc) =>
      acc.coordinates && acc.coordinates.latitude && acc.coordinates.longitude
  );
  const mapCenter =
    validMarkers.length > 0
      ? [
          validMarkers[0].coordinates.latitude,
          validMarkers[0].coordinates.longitude,
        ]
      : defaultCenter;

  // Fix for default marker icon in leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

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
            {/* Search input */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search for hotels in any city, country..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  padding: "8px 12px",
                  borderRadius: "5px",
                  border: "1px solid lightgrey",
                  outline: "none",
                  fontSize: 14,
                  minWidth: "250px",
                  flex: 1,
                }}
                disabled={loading}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !searchLocation}
                style={{
                  padding: "8px 16px",
                  borderRadius: "5px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "1px solid #007bff",
                  outline: "none",
                  fontSize: 14,
                  cursor: "pointer",
                  opacity: loading || !searchLocation ? 0.6 : 1,
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
                className="search-btn"
              >
                Search
              </button>
            </div>
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
                width: "150px",
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
              value={filters.location}
              onChange={handleLocationChange}
              disabled={loading}
            >
              <option value="">Popular Destinations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <button
              style={{
                padding: "5px 10px",
                borderRadius: "5px",
                backgroundColor: "#28a745",
                color: "white",
                border: "1px solid #28a745",
                outline: "none",
                width: "90px",
                fontSize: 14,
                maxWidth: "100%",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
              onClick={() => setShowMap(true)}
            >
              View Map
            </button>
          </div>
        </div>
      </div>
      {/* Map Modal */}
      {showMap && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowMap(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 16,
              maxWidth: 900,
              width: "95vw",
              maxHeight: "90vh",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMap(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                fontSize: 18,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h3 style={{ marginBottom: 12 }}>Hotel Locations Map</h3>
            <div style={{ width: "100%", height: "60vh", minHeight: 350 }}>
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {validMarkers.map((acc, idx) => (
                  <Marker
                    key={acc._id || idx}
                    position={[
                      acc.coordinates.latitude,
                      acc.coordinates.longitude,
                    ]}
                  >
                    <Popup>
                      <b>{acc.title}</b>
                      <br />
                      {acc.location}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .search-btn:hover:not(:disabled) {
          background: #0056b3 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        }
      `}</style>
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
