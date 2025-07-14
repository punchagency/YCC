import api from "../../../utils/api";

/**
 * Select shipment rate for a sub-order
 * @param {string} subOrderId - Sub-order ID
 * @param {string} rateId - Selected rate ID
 * @returns {Promise<Object>} API response
 */
export const selectShipmentRate = async (subOrderId, rateId) => {
  try {
    const response = await api.post(`/crew-orders/suborders/${subOrderId}/select-rate`, { rateId });
    return response.data;
  } catch (error) {
    console.error("Error selecting shipment rate:", error);
    throw error;
  }
}; 