import { React } from "react";
import card from "../../../assets/images/crew/card.png";

const DocumentBox = () => {
  const documentTypes = [
    {
      icon: card,
      alert: "2 Expiring soon",
      title: "Identification",
      description: "Passport, Visas, seafarer IDs",
      count: "12 Documents",
    },
    {
      icon: card,
      alert: "1 Expiring soon",
      title: "Certificates & Licenses",
      description: "STCW, COC, training certificates",
      count: "8 Documents",
    },
    {
      icon: card,
      alert: "2 Expiring soon",
      title: "Medical",
      description: "ENG1, vaccinations, medical certs",
      count: "5 Documents",
    },
    {
      icon: card,
      alert: "6 Expiring soon",
      title: "Employment",
      description: "Contracts, references, CV",
      count: "6 Documents",
    },
    {
      icon: card,
      alert: "2 Expiring soon",
      title: "Yacht ",
      description: "Ship registry, safety certificates",
      count: "9 Documents",
    },
    {
      icon: card,
      alert: "1 Expiring soon",
      title: "Insurance",
      description: "Health, travel, personal insurance",
      count: "4 Documents",
    },
  ];

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          padding: "20px",
        }}
      >
        {documentTypes.map((docType, index) => (
          <div
            key={index}
            className="bg-white"
            style={{
              height: "300px",
              borderRadius: "10px",
              padding: "20px 20px 0px 20px",
            }}
          >
            <div className="flex align-items-center justify-content-between mb-5">
              <div>
                <img src={docType.icon} alt="document icon" />
              </div>
              <div
                style={{
                  backgroundColor: docType.alert.includes("Expiring")
                    ? "#FFF3E4"
                    : docType.alert.includes("Missing")
                    ? "#FFE2E5"
                    : "#E3F5FF",
                  padding: "5px",
                  borderRadius: "6px",
                  color: "white",
                }}
              >
                <p
                  style={{
                    color: docType.alert.includes("Expiring")
                      ? "#896942"
                      : docType.alert.includes("Missing")
                      ? "#E94E4E"
                      : "#0387D9",
                  }}
                >
                  {docType.alert}
                </p>
              </div>
            </div>
            <div className="mb-5">
              <h2>{docType.title}</h2>
              <p style={{ color: "#21212199" }}>{docType.description}</p>
            </div>
            <div className="flex align-items-center justify-content-between">
              <h2>{docType.count}</h2>
              <p
                style={{
                  textDecoration: "underline",
                  color: "#0387D9",
                  cursor: "pointer",
                }}
              >
                View All
              </p>
            </div>
            <div
              className="flex align-items-center justify-content-flex-end"
              style={{ width: "100%", marginTop: "16px" }}
            >
              <button
                className="bg-primary text-white "
                style={{
                  borderRadius: "10px",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Add document
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DocumentBox;
