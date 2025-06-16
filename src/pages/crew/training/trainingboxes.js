import { React, useState } from "react";
import location from "../../../assets/images/crew/location.png";
import building from "../../../assets/images/crew/building.png";
import calendar from "../../../assets/images/crew/crewcalendar.png";

const TrainingBoxes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
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

  const handleViewDetails = (course) => {
    setModalData(course);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  return (
    <div className="container mx-auto">
      <style>{`
        @media (max-width: 600px) {
          .training-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 10px !important;
          }
          .training-card {
            padding: 12px 8px 10px 8px !important;
            border-radius: 14px !important;
            box-shadow: 0 2px 12px rgba(4, 135, 217, 0.08) !important;
            margin-bottom: 10px !important;
          }
          .training-card h2 {
            font-size: 1.1rem !important;
          }
          .training-card button {
            font-size: 0.95rem !important;
            padding: 6px 12px !important;
          }
        }
      `}</style>
      <div
        className="training-grid"
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
            className="training-card"
            style={{
              height: "300px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 12px rgba(4, 135, 217, 0.08)",
              padding: "16px 14px 14px 14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
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
                  cursor: "pointer",
                }}
                onClick={() => handleViewDetails(course)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      {modalOpen && modalData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "32px 24px",
              minWidth: "340px",
              maxWidth: "90vw",
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "transparent",
                border: "none",
                fontSize: 24,
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 style={{ marginBottom: 16 }}>{modalData.title}</h2>
            <div style={{ marginBottom: 12 }}>
              <strong>Status:</strong> {modalData.status}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Location:</strong> {modalData.location}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Duration:</strong> {modalData.duration}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Provider:</strong> {modalData.provider}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Price:</strong> {modalData.price}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingBoxes;
