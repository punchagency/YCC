import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getCartSummary } from '../../services/crew/cartService';

// Cart context state
const CartContext = createContext();

// Initial state
const initialState = {
  cartCount: 0,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CART_COUNT: 'SET_CART_COUNT',
  SET_ERROR: 'SET_ERROR',
  INCREMENT_COUNT: 'INCREMENT_COUNT',
  DECREMENT_COUNT: 'DECREMENT_COUNT',
  RESET_CART: 'RESET_CART',
  UPDATE_CART: 'UPDATE_CART',
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    case CART_ACTIONS.SET_CART_COUNT:
      return {
        ...state,
        cartCount: action.payload,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      };
    
    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    case CART_ACTIONS.INCREMENT_COUNT:
      return {
        ...state,
        cartCount: Math.max(0, state.cartCount + action.payload),
        lastUpdated: new Date(),
      };
    
    case CART_ACTIONS.DECREMENT_COUNT:
      return {
        ...state,
        cartCount: Math.max(0, state.cartCount - action.payload),
        lastUpdated: new Date(),
      };
    
    case CART_ACTIONS.RESET_CART:
      return {
        ...state,
        cartCount: 0,
        lastUpdated: new Date(),
      };
    
    case CART_ACTIONS.UPDATE_CART:
      return {
        ...state,
        cartCount: action.payload.totalItems || 0,
        lastUpdated: new Date(),
      };
    
    default:
      return state;
  }
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart count from API
  const fetchCartCount = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const response = await getCartSummary();
      
      if (response.status) {
        dispatch({ 
          type: CART_ACTIONS.SET_CART_COUNT, 
          payload: response.data.totalItems || 0 
        });
      } else {
        dispatch({ 
          type: CART_ACTIONS.SET_CART_COUNT, 
          payload: 0 
        });
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      dispatch({ 
        type: CART_ACTIONS.SET_ERROR, 
        payload: 'Failed to fetch cart count' 
      });
    }
  };

  // Initialize cart count on mount
  useEffect(() => {
    fetchCartCount();
  }, []);

  // Cart operations
  const cartOperations = {
    // Add items to cart
    addToCart: (quantity = 1) => {
      dispatch({ type: CART_ACTIONS.INCREMENT_COUNT, payload: quantity });
    },

    // Remove items from cart
    removeFromCart: (quantity = 1) => {
      dispatch({ type: CART_ACTIONS.DECREMENT_COUNT, payload: quantity });
    },

    // Update cart with new data
    updateCart: (cartData) => {
      dispatch({ type: CART_ACTIONS.UPDATE_CART, payload: cartData });
    },

    // Clear cart
    clearCart: () => {
      dispatch({ type: CART_ACTIONS.RESET_CART });
    },

    // Refresh cart count from API
    refreshCartCount: fetchCartCount,
  };

  const contextValue = {
    ...state,
    ...cartOperations,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Export action types for external use
export { CART_ACTIONS }; 