import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import DocumentBox from "./documentbox";

const Document = () => {
  const outletContext = useOutletContext();
  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle("Crew Documents");
    }
  }, [outletContext]);

  return (
    <>
      {/* <DocumentSearch /> */}
      <DocumentBox />
    </>
  );
};

export default Document;
