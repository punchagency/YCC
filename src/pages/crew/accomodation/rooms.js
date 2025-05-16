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
      <div className="grid grid-cols-2" style={{ paddingLeft: "30px" }}>
        {accommodations.map((accommodation, index) => (
          <div
            key={index}
            style={{
              width: "45%",
              height: "280px",
              margin: "20px",
              alignItems: "center",
              alignContent: "center",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              className="bg-white flex p-5"
              style={{ height: "100%", width: "100%", borderRadius: "10px" }}
            >
              <div>
                <img
                  src={house}
                  alt="house"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginRight: "20px",
                  }}
                />
              </div>
              <div>
                <h1 className="mb-5">{accommodation.title}</h1>
                <div>
                  <div className="flex align-items-center mb-3">
                    <img src={locationacco} alt="location" className="mr-2" />
                    <p className="">{accommodation.location}</p>
                  </div>
                  <div className="flex align-items-center mb-3">
                    <img src={user} alt="user" className="mr-2" />
                    <p className="">{accommodation.roomType}</p>
                  </div>
                  <div className="flex align-items-center mb-3">
                    <img src={wifi} alt="wifi" className="mr-2" />
                    <p className="">{accommodation.wifi}</p>
                  </div>
                </div>
                <div className="flex align-items-center">
                  <h3 className="mr-4">{accommodation.price}</h3>
                  <p style={{ color: "#0387D9" }}>View Details</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Accomodation;
