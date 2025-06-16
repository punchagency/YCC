import { React } from "react";
import house from "../../../assets/images/crew/house.png";
import wifi from "../../../assets/images/crew/wifi.png";
import locationacco from "../../../assets/images/crew/locationacco.png";
import user from "../../../assets/images/crew/useracco.png";

const Accomodation = () => {
  // Sample data for 6 accommodations
  const accommodations = [
    {
      title: "Crew House Palma",
      location: "Central Palma",
      roomType: "Shared & Private Rooms",
      wifi: "Free WIFI",
      price: "From $100/night",
    },
    {
      title: "Antibes Crew Housing",
      location: "Port Vauban",
      roomType: "Private Rooms",
      wifi: "Free WIFI",
      price: "From $120/night",
    },
    {
      title: "Monaco Marina Apartments",
      location: "Port Hercules",
      roomType: "Shared Rooms",
      wifi: "Free WIFI",
      price: "From $150/night",
    },
    {
      title: "Barcelona Crew Residence",
      location: "Port Vell",
      roomType: "Shared & Private Rooms",
      wifi: "Free WIFI",
      price: "From $90/night",
    },
    {
      title: "Fort Lauderdale Crew House",
      location: "Las Olas",
      roomType: "Shared Rooms",
      wifi: "Free WIFI",
      price: "From $80/night",
    },
    {
      title: "St. Martin Crew Quarters",
      location: "Simpson Bay",
      roomType: "Private Rooms",
      wifi: "Free WIFI",
      price: "From $110/night",
    },
  ];

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
        }}
      >
        {accommodations.map((accommodation, index) => (
          <div
            key={index}
            className="accommodation-card"
            style={{
              width: "100%",
              maxWidth: 400,
              minWidth: 0,
              height: "auto",
              margin: "12px 0",
              alignItems: "center",
              alignContent: "center",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
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
                  src={house}
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
              <h1
                className="mb-5"
                style={{
                  wordBreak: "break-word",
                  fontSize: 20,
                  margin: "12px 0 8px 0",
                  textAlign: "center",
                }}
              >
                {accommodation.title}
              </h1>
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
                    {accommodation.roomType}
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
                    {accommodation.wifi}
                  </p>
                </div>
              </div>
              <div
                className="flex align-items-center"
                style={{ justifyContent: "center", width: "100%" }}
              >
                <h3 className="mr-4" style={{ fontSize: 18 }}>
                  {accommodation.price}
                </h3>
                <p style={{ color: "#0387D9", fontSize: 15, marginLeft: 8 }}>
                  View Details
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
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
      `}</style>
    </>
  );
};

export default Accomodation;
