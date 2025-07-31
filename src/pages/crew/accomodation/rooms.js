import { React, useState } from "react";
import { useAccommodation } from "../../../context/accommodation/accommodationContext";
import house from "../../../assets/images/crew/house.png";
import wifi from "../../../assets/images/crew/wifi.png";
import locationacco from "../../../assets/images/crew/locationacco.png";
import user from "../../../assets/images/crew/useracco.png";

const Accomodation = () => {
  const { accommodations, loading, error, pagination, setFilters } =
    useAccommodation();
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handlePageChange = (newPage) => {
    setFilters({ page: newPage });
  };

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHotel(null);
  };

  // Helper function to get the lowest price from room types
  const getLowestPrice = (roomTypes) => {
    if (!roomTypes || roomTypes.length === 0) return "Price not available";
    const minPrice = Math.min(...roomTypes.map((room) => room.price));
    return minPrice;
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "Price not available";
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Helper function to get room type display text
  const getRoomTypeDisplay = (roomTypes) => {
    if (!roomTypes || roomTypes.length === 0) return "Room type not available";

    const types = roomTypes.map((room) => room.type);
    if (types.includes("shared") && types.includes("private")) {
      return "Shared & Private Rooms";
    } else if (types.includes("shared")) {
      return "Shared Rooms";
    } else if (types.includes("private")) {
      return "Private Rooms";
    } else {
      return "Standard Room";
    }
  };

  return (
    <>
      <div
        className="accommodation-grid"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 0,
          margin: 0,
          width: "100%",
          boxSizing: "border-box",
          gap: 24,
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", width: "100%", padding: "20px" }}>
            <p>Loading accommodations...</p>
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: "center",
              width: "100%",
              padding: "20px",
              color: "red",
            }}
          >
            <p>Error: {error}</p>
          </div>
        ) : accommodations.length === 0 ? (
          <div style={{ textAlign: "center", width: "100%", padding: "20px" }}>
            <p>No accommodations found.</p>
          </div>
        ) : (
          accommodations.map((accommodation, index) => (
            <div
              key={accommodation._id || index}
              className="accommodation-card interactive-card"
            style={{
              width: "100%",
              maxWidth: 400,
              minWidth: 0,
                height: 480,
                minHeight: 480,
                maxHeight: 480,
              margin: "12px 0",
              alignItems: "center",
              alignContent: "center",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              boxSizing: "border-box",
                overflow: "hidden",
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s",
            }}
              onClick={() => handleViewDetails(accommodation)}
          >
            <div
              className="bg-white flex p-5"
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "10px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                    src={
                      accommodation.images && accommodation.images.length > 0
                        ? accommodation.images[0]
                        : house
                    }
                  alt="house"
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    height: "auto",
                    maxHeight: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginRight: 0,
                  }}
                />
              </div>
                <div style={{ width: "100%", textAlign: "center" }}>
              <h1
                className="mb-5"
                style={{
                  wordBreak: "break-word",
                      fontSize:
                        accommodation.title && accommodation.title.length > 32
                          ? 17
                          : 20,
                      margin:
                        accommodation.title && accommodation.title.length > 32
                          ? "8px 0 0 0"
                          : "12px 0 0 0",
                  textAlign: "center",
                      minHeight: 24,
                      lineHeight: 1.1,
                }}
              >
                {accommodation.title}
              </h1>
                  {accommodation.rating > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        marginTop: 0,
                        marginBottom: 0,
                        lineHeight: 1.1,
                      }}
                    >
                      <span style={{ color: "#FFD700", fontSize: 16 }}>★</span>
                      <span style={{ fontSize: 14, fontWeight: "bold" }}>
                        {accommodation.rating}
                      </span>
                      {accommodation.totalReviews > 0 && (
                        <span style={{ fontSize: 12, color: "#666" }}>
                          ({accommodation.totalReviews} reviews)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              <div style={{ width: "100%" }}>
                <div
                  className="flex align-items-center mb-3"
                  style={{ justifyContent: "center" }}
                >
                  <img
                    src={locationacco}
                    alt="location"
                    className="mr-2"
                    style={{
                      width: 18,
                      height: 18,
                      maxWidth: 18,
                      maxHeight: 18,
                      objectFit: "contain",
                      verticalAlign: "middle",
                    }}
                  />
                  <p className="" style={{ fontSize: 15 }}>
                    {accommodation.location}
                  </p>
                </div>
                <div
                  className="flex align-items-center mb-3"
                  style={{ justifyContent: "center" }}
                >
                  <img
                    src={user}
                    alt="user"
                    className="mr-2"
                    style={{
                      width: 18,
                      height: 18,
                      maxWidth: 18,
                      maxHeight: 18,
                      objectFit: "contain",
                      verticalAlign: "middle",
                    }}
                  />
                  <p className="" style={{ fontSize: 15 }}>
                      {getRoomTypeDisplay(accommodation.roomTypes)}
                  </p>
                </div>
                <div
                  className="flex align-items-center mb-3"
                  style={{ justifyContent: "center" }}
                >
                  <img
                    src={wifi}
                    alt="wifi"
                    className="mr-2"
                    style={{
                      width: 18,
                      height: 18,
                      maxWidth: 18,
                      maxHeight: 18,
                      objectFit: "contain",
                      verticalAlign: "middle",
                    }}
                  />
                  <p className="" style={{ fontSize: 15 }}>
                      {accommodation.wifiDetails
                        ? accommodation.wifiDetails
                        : "No WiFi"}
                  </p>
                </div>
              </div>
              <div
                className="flex align-items-center"
                  style={{
                    justifyContent: "center",
                    width: "100%",
                    flexDirection: "column",
                    display: "flex",
                    padding: "0 8px 8px 8px",
                    boxSizing: "border-box",
                  }}
                >
                  <h3
                    className="mr-4"
                    style={{
                      fontSize: 18,
                      width: "100%",
                      wordBreak: "break-all",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {typeof getLowestPrice(accommodation.roomTypes) === "number"
                      ? `$${formatPrice(
                          getLowestPrice(accommodation.roomTypes)
                        )}/night`
                      : getLowestPrice(accommodation.roomTypes)}
                  </h3>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Modal for hotel details */}
      {showModal && selectedHotel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 24,
              maxWidth: 600,
              width: "90vw",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
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
            <h2 style={{ marginBottom: 12 }}>{selectedHotel.title}</h2>
            {selectedHotel.images && selectedHotel.images.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  overflowX: "auto",
                  marginBottom: 12,
                }}
              >
                {selectedHotel.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="hotel"
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                ))}
              </div>
            )}
            <div style={{ marginBottom: 8 }}>
              <b>Location:</b> {selectedHotel.location}
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>Rating:</b> {selectedHotel.rating} (
              {selectedHotel.totalReviews} reviews)
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>Room Types:</b>{" "}
              {selectedHotel.roomTypes &&
                selectedHotel.roomTypes.map((room, idx) => (
                  <span key={idx}>
                    {room.type} (${formatPrice(room.price)})
                    {idx < selectedHotel.roomTypes.length - 1 ? ", " : ""}
                  </span>
                ))}
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>Description:</b> {selectedHotel.description}
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>WiFi:</b>{" "}
              {selectedHotel.wifiDetails
                ? selectedHotel.wifiDetails
                : "No WiFi"}
            </div>
            {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <b>Amenities:</b> {selectedHotel.amenities.join(", ")}
              </div>
            )}
            <div style={{ marginBottom: 8 }}>
              <b>Coordinates:</b>{" "}
              {selectedHotel.coordinates &&
              selectedHotel.coordinates.latitude &&
              selectedHotel.coordinates.longitude
                ? `${selectedHotel.coordinates.latitude}, ${selectedHotel.coordinates.longitude}`
                : "N/A"}
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>Contact:</b> {selectedHotel.contactInfo?.phone} /{" "}
              {selectedHotel.contactInfo?.email}
            </div>
          </div>
      </div>
      )}
      {/* Responsive styles for mobile */}
      <style>{`
        @media (max-width: 600px) {
          .accommodation-grid {
            flex-direction: column !important;
            padding: 0 !important;
          }
          .accommodation-card {
            width: 100% !important;
            max-width: 100vw !important;
            margin: 8px 0 !important;
          }
          .accommodation-card img {
            width: 100% !important;
            max-width: 100vw !important;
            height: auto !important;
          }
        }
        .interactive-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 1.5px 6px rgba(0,0,0,0.10);
          transform: scale(1.025);
        }
      `}</style>
    </>
  );
};

export default Accomodation;
