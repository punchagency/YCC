import { React, useState, useEffect } from "react";
import ActiveOrders from "./active";
import OrderTable from "./table";
import { getOrders } from "../../../services/crew/crewOrderService";
import "./order.css";
import { useOutletContext } from "react-router-dom";

const Order = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHovered, setIsHovered] = useState(false);
  
  // Data fetching states
  const [orders, setOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ pending: 0, active: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const { setPageTitle } = useOutletContext() || {};

  // Set page title when component mounts
  useEffect(() => {
    if (setPageTitle) setPageTitle("Orders");
  }, [setPageTitle]);

  // Fetch orders data when component mounts
  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching orders data...");
        const response = await getOrders({
          page: pagination.page,
          limit: pagination.limit,
        });
        
        console.log("Orders API response:", response);
        
        if (response.status) {
          // Extract orders data from response
          let ordersData = [];
          if (response.data?.data && Array.isArray(response.data.data)) {
            ordersData = response.data.data;
          } else if (response.data && Array.isArray(response.data)) {
            ordersData = response.data;
          } else {
            throw new Error("Invalid data structure received");
          }

          // Extract status counts from response
          const counts = response.data?.statusCounts || { pending: 0, active: 0, completed: 0, total: 0 };
          
          // Extract pagination data
          const paginationData = response.data?.pagination || {
            totalItems: ordersData.length,
            totalPages: Math.ceil(ordersData.length / pagination.limit),
            currentPage: pagination.page,
            pageSize: pagination.limit,
          };

          console.log("Processed data:", {
            ordersCount: ordersData.length,
            statusCounts: counts,
            pagination: paginationData
          });

          // Update state with fetched data
          setOrders(ordersData);
          setStatusCounts(counts);
          setPagination(prev => ({
            ...prev,
            total: paginationData.totalItems,
            totalPages: paginationData.totalPages,
          }));
          
        } else {
          throw new Error(response.error || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, [pagination.page, pagination.limit]);

  // Handle filter changes from ActiveOrders component
  const handleFilterChange = (filterCriteria) => {
    console.log("Filter criteria changed:", filterCriteria);
    // TODO: Implement filtering logic in next step
  };

  // Create Orders Button
  const createOrdersButton = () => {
    return (
        <button
          onClick={() => {
            // Button click handler removed - will be implemented later
            console.log("Create Order button clicked");
          }}
          style={{
            backgroundColor: "#0387D9",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "1px solid #0387D9",
            boxShadow: isHovered ? "0 6px 24px rgba(3,135,217,0.18)" : "0 2px 8px rgba(3,135,217,0.08)",
            transform: isHovered ? "translateY(-2px)" : "translateY(0)",
            transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Create Order
        </button>
    )
  }

  return (
    <>
      <div className="lg:p-4">
        {/* <div className="text-right">
          {createOrdersButton()}
        </div> */}

        {/* ActiveOrders component with status counts */}
        <ActiveOrders 
          onFilterChange={handleFilterChange} 
          statusCounts={statusCounts}
          loading={loading}
        />
        
        {/* OrderTable component with orders data */}
        <OrderTable 
          orders={orders}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
          onLimitChange={(newLimit) => setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))}
        />
      </div>
    </>
  );
};

export default Order;
