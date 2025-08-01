import axios from "axios";
import { buildApiUrl } from "../../utils/apiUtils";

/**
 * Get authentication headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Add product to cart
 * @param {Object} params - Add to cart parameters
 * @param {string} params.inventoryId - Inventory ID
 * @param {string} params.productId - Product ID
 * @param {number} params.quantity - Quantity to add
 * @returns {Promise<Object>} Updated cart
 */
export const addToCart = async (params) => {
  try {
    // Validate required parameters
    if (!params.inventoryId || !params.productId) {
      throw new Error("Both inventoryId and productId are required");
    }

    console.log("[CartService] Adding to cart:", params);

    const response = await axios.post(buildApiUrl("carts/add"), params, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

/**
 * Get user's cart
 * @returns {Promise<Object>} Cart data
 */
export const getCart = async () => {
  try {
    const response = await axios.get(buildApiUrl("carts"), {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

/**
 * Get cart summary (for header badge)
 * @returns {Promise<Object>} Cart summary
 */
export const getCartSummary = async () => {
  try {
    const response = await axios.get(buildApiUrl("carts/summary"), {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    throw error;
  }
};

/**
 * Update product quantity in cart
 * @param {Object} params - Update parameters
 * @param {string} params.inventoryId - Inventory ID
 * @param {string} params.productId - Product ID
 * @param {number} params.quantity - New quantity
 * @returns {Promise<Object>} Updated cart
 */
export const updateCartQuantity = async (params) => {
  try {
    // Validate required parameters
    if (!params.inventoryId || !params.productId) {
      throw new Error("Both inventoryId and productId are required");
    }

    console.log("[CartService] Updating cart quantity:", params);

    const response = await axios.put(
      buildApiUrl("carts/update-quantity"),
      params,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    throw error;
  }
};

/**
 * Remove product from cart
 * @param {Object} params - Remove parameters
 * @param {string} params.inventoryId - Inventory ID
 * @param {string} params.productId - Product ID
 * @returns {Promise<Object>} Updated cart
 */
export const removeFromCart = async (params) => {
  try {
    // Validate required parameters
    if (!params.inventoryId || !params.productId) {
      throw new Error("Both inventoryId and productId are required");
    }

    console.log("[CartService] Removing from cart:", params);

    const response = await axios.delete(buildApiUrl("carts/remove"), {
      data: params,
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

/**
 * Clear entire cart
 * @returns {Promise<Object>} Empty cart
 */
export const clearCart = async () => {
  try {
    const response = await axios.delete(buildApiUrl("carts/clear"), {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

/**
 * Checkout cart and create order
 * @param {Object} params - Checkout parameters
 * @param {string} params.deliveryAddress - Delivery address
 * @param {string} params.deliveryDate - Delivery date
 * @param {string} params.additionalNotes - Additional notes
 * @returns {Promise<Object>} Created order
 */
export const checkout = async (params) => {
  try {
    const response = await axios.post(buildApiUrl("carts/checkout"), params, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error during checkout:", error);
    throw error;
  }
};
