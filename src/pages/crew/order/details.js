import React from "react";
import { useOutletContext } from "react-router-dom";

const OrderDetails = () => {
  const { setPageTitle } = useOutletContext() || {};

  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Order Details");
  }, [setPageTitle]);

  return (
    <>
      <div className="">
        <h1></h1>
      </div>
    </>
  );
};

export default OrderDetails;
