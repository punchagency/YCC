import { React } from "react";
import location from "../../../assets/images/crew/location.png";
import building from "../../../assets/images/crew/building.png";
import calendar from "../../../assets/images/crew/crewcalendar.png";

const TrainingBoxes = () => {
  // Sample data for 6 training courses
  const trainingCourses = [
    {
      title: "STCW Basic Safety Training",
      status: "Available",
      location: "Palma De Mallorca",
      duration: "5 Days (40 Hours)",
      provider: "Bluewater Training",
      price: "$350.00",
    },
    {
      title: "Advanced Firefighting",
      status: "Available",
      location: "Fort Lauderdale",
      duration: "3 Days (24 Hours)",
      provider: "Maritime Professional Training",
      price: "$495.00",
    },
    {
      title: "Medical First Aid",
      status: "Limited Seats",
      location: "Antibes",
      duration: "2 Days (16 Hours)",
      provider: "JPMA Training",
      price: "$275.00",
    },
    {
      title: "Proficiency in Survival Craft",
      status: "Available",
      location: "Barcelona",
      duration: "4 Days (32 Hours)",
      provider: "Barcelona Maritime Academy",
      price: "$420.00",
    },
    {
      title: "Security Awareness Training",
      status: "Full",
      location: "Monaco",
      duration: "1 Day (8 Hours)",
      provider: "Monaco Nautical Academy",
      price: "$180.00",
    },
    {
      title: "Crowd Management",
      status: "Available",
      location: "Amsterdam",
      duration: "2 Days (16 Hours)",
      provider: "Nautical Institute",
      price: "$290.00",
    },
  ];

  return (
    <div className="container mx-auto">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          padding: "20px",
        }}
      >
        {trainingCourses.map((course, index) => (
          <div
            key={index}
            style={{
              height: "300px",
            }}
          >
            <div className="bg-white rounded-lg p-4" style={{ height: "100%", borderRadius:"10px"}}>
              <div className="flex justify-content-between align-items-center mb-5">
                <h2>{course.title}</h2>
                <button
                  style={{
                    backgroundColor:
                      course.status === "Available"
                        ? "#C5EDDE"
                        : course.status === "Limited Seats"
                        ? "#FFF4CC"
                        : "#FFE2E5",
                    color:
                      course.status === "Available"
                        ? "#1A9E6D"
                        : course.status === "Limited Seats"
                        ? "#FF9800"
                        : "#E94E4E",
                    border:
                      course.status === "Available"
                        ? "1px solid #C5EDDE"
                        : course.status === "Limited Seats"
                        ? "1px solid #FFF4CC"
                        : "1px solid #FFE2E5",
                    outline: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                  }}
                >
                  {course.status}
                </button>
              </div>
              <div className="mb-6">
                <div className="flex align-items-center mb-3">
                  <img src={location} alt="location" className="mr-2" />
                  <p className="">{course.location}</p>
                </div>
                <div className="flex align-items-center mb-3">
                  <img src={calendar} alt="calendar" className="mr-2" />
                  <p className="">{course.duration}</p>
                </div>
                <div className="flex align-items-center mb-3">
                  <img src={building} alt="building" className="mr-2" />
                  <p className="">{course.provider}</p>
                </div>
              </div>
              <div className="flex justify-content-between items-center">
                <p>{course.price}</p>
                <button
                  style={{
                    backgroundColor: "#0387D9",
                    color: "white",
                    border: "1px solid #0387D9",
                    outline: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingBoxes;
