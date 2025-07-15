import axios from "axios";

export const buyLabels = async (selections) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/shipments/buy-label`,
      { selections },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data; // { status:true, results:[...] }
  } catch (err) {
    // Normalise error shape
    const message =
      err.response?.data?.message || err.message || "Unable to buy labels";
    throw new Error(message);
  }
};
