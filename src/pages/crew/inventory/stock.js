import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { FaChevronDown } from "react-icons/fa";

const Stock = ({ onFilterChange, products = [] }) => {
  // State for filters
  const [filters, setFilters] = useState({
    category: "all",
    stockLevel: "all",
    vendor: "all",
  });

  // Options for dropdowns
  const [categoryOptions, setCategoryOptions] = useState([
    { label: "All Categories", value: "all" },
  ]);
  
  // Default vendor locations
  const [vendorOptions, setVendorOptions] = useState([
    { label: "All Vendors", value: "all" },
    { label: "USA", value: "USA" },
    { label: "Caribbean", value: "Caribbean" },
    { label: "Mediterranean", value: "Mediterranean" },
  ]);

  const stockLevelOptions = [
    { label: "All Levels", value: "all" },
    { label: "Low Stock", value: "low" },
    { label: "In Stock", value: "in" },
    { label: "Out of Stock", value: "out" },
  ];

  // Extract unique categories and vendors from products
  useEffect(() => {
    if (products && products.length > 0) {
      // Extract unique categories
      const uniqueCategories = [
        ...new Set(products.map((item) => item.category).filter(Boolean)),
      ];

      setCategoryOptions([
        { label: "All Categories", value: "all" },
        ...uniqueCategories.map((cat) => ({ label: cat, value: cat })),
      ]);

      // Extract unique vendors and merge with default locations
      const uniqueVendors = [
        ...new Set(
          products
            .map((item) => item.vendor || item.serviceArea)
            .filter(Boolean)
        ),
      ];
      
      // Create a set of existing values to avoid duplicates
      const existingValues = new Set(["all", "USA", "Caribbean", "Mediterranean"]);
      
      // Add unique vendors that aren't already in our default list
      const additionalVendors = uniqueVendors
        .filter(vendor => !existingValues.has(vendor))
        .map(vendor => ({ label: vendor, value: vendor }));
      
      // Only update if we have new vendors to add
      if (additionalVendors.length > 0) {
        setVendorOptions(prev => [...prev, ...additionalVendors]);
      }
    }
  }, [products]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Notify parent component
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-content-between align-items-center">
          <div style={{ width: "50%" }}>
            <h2>Current Stock Overview</h2>
          </div>
          <div className="flex justify-content-end">
            <Dropdown
              value={filters.category}
              options={categoryOptions}
              onChange={(e) => handleFilterChange("category", e.value)}
              placeholder="All Categories"
              className="mr-2"
              style={{ minWidth: "150px" }}
            />

            <Dropdown
              value={filters.stockLevel}
              options={stockLevelOptions}
              onChange={(e) => handleFilterChange("stockLevel", e.value)}
              placeholder="Stock Level"
              className="mr-2"
              style={{ minWidth: "150px" }}
            />

            <Dropdown
              value={filters.vendor}
              options={vendorOptions}
              onChange={(e) => handleFilterChange("vendor", e.value)}
              placeholder="Vendors"
              style={{ minWidth: "150px" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Stock;
