import { React, useState } from "react";
import jsPDF from "jspdf";
import addpeg from "../../../assets/images/crew/addpeg.png";
import legalphone from "../../../assets/images/crew/legalphone.png";
import legalmail from "../../../assets/images/crew/legalmail.png";
import legalweb from "../../../assets/images/crew/legalweb.png";
import flagStatesData from "../../../data/flagStatesData";
import countriesData from "../../../data/countries.json";

const LegalBoxes = ({ selectedCountry, searchText }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const flagStates = flagStatesData;

  let filteredStates = flagStates;
  if (selectedCountry) {
    filteredStates = filteredStates.filter(
      (state) =>
        state.name.toLowerCase() === selectedCountry.label?.toLowerCase() ||
        state.name.toLowerCase() === selectedCountry.value?.toLowerCase()
    );
  }
  if (searchText && searchText.trim() !== "") {
    const search = searchText.toLowerCase();
    filteredStates = filteredStates.filter(
      (state) =>
        state.name.toLowerCase().includes(search) ||
        state.email.toLowerCase().includes(search) ||
        state.website.toLowerCase().includes(search)
    );
  }

  const handleViewDetails = (state) => {
    setModalData(state);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  // Find flag info for modal country
  let modalFlagUrl = null;
  if (modalData) {
    const country = countriesData.find(
      (c) => c.name.common.toLowerCase() === modalData.name.toLowerCase()
    );
    if (country) {
      modalFlagUrl = `https://flagcdn.com/48x36/${country.cca2.toLowerCase()}.png`;
    }
  }

  // Find flag info for download country
  const getFlagUrl = (name) => {
    const country = countriesData.find(
      (c) => c.name.common.toLowerCase() === name.toLowerCase()
    );
    if (country) {
      return `https://flagcdn.com/48x36/${country.cca2.toLowerCase()}.png`;
    }
    return null;
  };

  const handleDownloadInfo = async (state) => {
    const doc = new jsPDF();
    let y = 20;
    // Add flag image if available
    const flagUrl = getFlagUrl(state.name);
    if (flagUrl) {
      try {
        const imgData = await fetch(flagUrl)
          .then((res) => res.blob())
          .then(
            (blob) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              })
          );
        doc.addImage(imgData, "PNG", 10, y, 24, 18);
      } catch (e) {
        // ignore image if fetch fails
      }
    }
    doc.setFontSize(18);
    doc.text(state.name, 40, y + 12);
    y += 28;
    doc.setFontSize(12);
    doc.text(`Phone: ${state.phone}`, 10, y);
    y += 8;
    doc.text(`Email: ${state.email}`, 10, y);
    y += 8;
    doc.text(`Website: ${state.website}`, 10, y);
    doc.save(`${state.name.replace(/\s+/g, "_")}_info.pdf`);
  };

  return (
    <>
      <div className="grid grid-cols-2" style={{ paddingLeft: "30px" }}>
        {filteredStates.length > 0 ? (
          filteredStates.map((state, index) => (
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
                className="bg-white flex justify-content-between p-5"
                style={{ height: "100%", width: "100%", borderRadius: "10px" }}
              >
                <div>
                  <h1 className="mb-5">{state.name}</h1>
                  <div>
                    <div className="flex align-items-center mb-3">
                      <img src={legalphone} alt="legalphone" className="mr-2" />
                      <p className="">{state.phone}</p>
                    </div>

                    <div className="flex align-items-center mb-3">
                      <img src={legalmail} alt="legalmail" className="mr-2" />
                      <p className="">{state.email}</p>
                    </div>
                    <div className="flex align-items-center mb-3">
                      <img src={legalweb} alt="legalweb" className="mr-2" />
                      <p className="">{state.website}</p>
                    </div>
                  </div>
                  <div className="flex align-items-center">
                    <p
                      className="mr-4"
                      style={{ color: "#0387D9", cursor: "pointer" }}
                      onClick={() => handleViewDetails(state)}
                    >
                      View Details
                    </p>
                    <p
                      style={{ color: "#0387D9", cursor: "pointer" }}
                      onClick={() => handleDownloadInfo(state)}
                    >
                      Download Info
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <img src={addpeg} alt="addpeg" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ margin: "40px", fontSize: "1.2rem", color: "red" }}>
            No legal information for this country.
          </div>
        )}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              {modalFlagUrl && (
                <img
                  src={modalFlagUrl}
                  alt="flag"
                  style={{
                    width: 48,
                    height: 36,
                    marginRight: 12,
                    borderRadius: 4,
                    border: "1px solid #eee",
                  }}
                />
              )}
              <h2 style={{ marginBottom: 0 }}>{modalData.name}</h2>
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Phone:</strong> {modalData.phone}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Email:</strong> {modalData.email}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Website:</strong>{" "}
              <a
                href={
                  modalData.website.startsWith("http")
                    ? modalData.website
                    : `http://${modalData.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {modalData.website}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LegalBoxes;
