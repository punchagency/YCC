import { React } from "react";
import addpeg from "../../../assets/images/crew/addpeg.png";
import legalphone from "../../../assets/images/crew/legalphone.png";
import legalmail from "../../../assets/images/crew/legalmail.png";
import legalweb from "../../../assets/images/crew/legalweb.png";

const LegalBoxes = () => {
  // Sample data for 4 flag states
  const flagStates = [
    {
      name: "Antigua and Barbuda",
      phone: "1268-462-1273",
      email: "antigua@moc.gov.ag",
      website: "www.moc.gov.ag",
    },
    {
      name: "Bahamas",
      phone: "1242-356-5772",
      email: "bahamas@maritime.gov.bs",
      website: "www.bahamasmaritime.com",
    },
    {
      name: "Bermuda",
      phone: "1441-295-7251",
      email: "bermuda@maritime.gov.bm",
      website: "www.bermudashipping.bm",
    },
    {
      name: "Cayman Islands",
      phone: "1345-949-8831",
      email: "cayman@maci.gov.ky",
      website: "www.cishipping.com",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2" style={{ paddingLeft: "30px" }}>
        {flagStates.map((state, index) => (
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
                  <p className="mr-4" style={{ color: "#0387D9" }}>
                    View Details
                  </p>
                  <p style={{ color: "#0387D9" }}>Download Info</p>
                </div>
              </div>
              <div className="pt-2">
                <img src={addpeg} alt="addpeg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LegalBoxes;
