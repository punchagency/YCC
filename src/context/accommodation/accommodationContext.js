import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getAllAccommodations,
  getLocations,
} from "../../services/accommodation/accommodationService";

const AccommodationContext = createContext();

const initialState = {
  accommodations: [],
  locations: [],
  loading: false,
  error: null,
  filters: {
    location: "",
    roomType: "",
    minPrice: "",
    maxPrice: "",
    page: 1,
    limit: 10,
  },
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const accommodationReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "SET_ACCOMMODATIONS":
      return {
        ...state,
        accommodations: action.payload.data,
        pagination: action.payload.pagination || state.pagination,
        loading: false,
        error: null,
      };
    case "SET_LOCATIONS":
      return {
        ...state,
        locations: action.payload,
        loading: false,
        error: null,
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: initialState.filters,
      };
    case "ADD_ACCOMMODATION":
      return {
        ...state,
        accommodations: [action.payload, ...state.accommodations],
      };
    case "UPDATE_ACCOMMODATION":
      return {
        ...state,
        accommodations: state.accommodations.map((acc) =>
          acc._id === action.payload._id ? action.payload : acc
        ),
      };
    case "DELETE_ACCOMMODATION":
      return {
        ...state,
        accommodations: state.accommodations.filter(
          (acc) => acc._id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const AccommodationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accommodationReducer, initialState);

  const fetchAccommodations = async (filters = {}) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const mergedFilters = { ...state.filters, ...filters };
      const result = await getAllAccommodations(mergedFilters);

      if (result.status) {
        dispatch({
          type: "SET_ACCOMMODATIONS",
          payload: {
            data: result.data,
            pagination: result.pagination,
          },
        });
      } else {
        dispatch({ type: "SET_ERROR", payload: result.message });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch accommodations",
      });
    }
  };

  const fetchLocations = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const result = await getLocations();

      if (result.status) {
        dispatch({ type: "SET_LOCATIONS", payload: result.data });
      } else {
        dispatch({ type: "SET_ERROR", payload: result.message });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch locations" });
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  const addAccommodation = (accommodation) => {
    dispatch({ type: "ADD_ACCOMMODATION", payload: accommodation });
  };

  const updateAccommodation = (accommodation) => {
    dispatch({ type: "UPDATE_ACCOMMODATION", payload: accommodation });
  };

  const deleteAccommodation = (id) => {
    dispatch({ type: "DELETE_ACCOMMODATION", payload: id });
  };

  // Load initial data
  useEffect(() => {
    fetchAccommodations();
    fetchLocations();
  }, []);

  // Fetch accommodations when filters change
  useEffect(() => {
    if (state.filters !== initialState.filters) {
      fetchAccommodations();
    }
  }, [state.filters]);

  const value = {
    ...state,
    fetchAccommodations,
    fetchLocations,
    setFilters,
    clearFilters,
    addAccommodation,
    updateAccommodation,
    deleteAccommodation,
  };

  return (
    <AccommodationContext.Provider value={value}>
      {children}
    </AccommodationContext.Provider>
  );
};

export const useAccommodation = () => {
  const context = useContext(AccommodationContext);
  if (!context) {
    throw new Error(
      "useAccommodation must be used within an AccommodationProvider"
    );
  }
  return context;
};
