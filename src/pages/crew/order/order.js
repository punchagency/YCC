import { React, useState, useEffect } from "react";
import ActiveOrders from "./active";
import OrderTable from "./table";
import CreateOrderModal from "./CreateOrderModal";
import { getOrders } from "../../../services/crew/crewOrderService";
import "./order.css";
import { useOutletContext, useSearchParams } from "react-router-dom";

const Order = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHovered, setIsHovered] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  
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

  // Get current status filter from URL
  const currentStatus = searchParams.get('status') || 'all';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const currentLimit = parseInt(searchParams.get('limit')) || 10;

  // Set page title when component mounts
  useEffect(() => {
    if (setPageTitle) setPageTitle("Orders");
  }, [setPageTitle]);

  // Initialize pagination state from URL
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      page: currentPage,
      limit: currentLimit,
    }));
  }, []); // Only run once on mount

  // Fetch orders data function
  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: currentStatus,
      });
      
      if (response.status) {
        const { data, statusCounts: counts, pagination: paginationData } = response.data;
        
        // Update state with fetched data
        setOrders(data);
        setStatusCounts(counts);
        setPagination(prev => ({
          ...prev,
          total: paginationData.totalItems,
          totalPages: paginationData.totalPages,
        }));
        
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error in fetchOrdersData:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders data when component mounts, pagination changes, or status filter changes
  useEffect(() => {
    fetchOrdersData();
  }, [pagination.page, pagination.limit, currentStatus]);

  // Handle filter changes from ActiveOrders component
  const handleFilterChange = (filterCriteria) => {
    console.log("Filter criteria changed:", filterCriteria);
    
    // Extract status from filter criteria
    let newStatus = 'all';
    
    if (filterCriteria.status) {
      if (Array.isArray(filterCriteria.status)) {
        if (filterCriteria.status.includes('pending')) {
          newStatus = 'pending';
        } else if (filterCriteria.status.includes('partially_confirmed') || 
                   filterCriteria.status.includes('confirmed') || 
                   filterCriteria.status.includes('shipped')) {
          newStatus = 'active';
        } else if (filterCriteria.status.includes('delivered')) {
          newStatus = 'completed';
        }
      } else if (filterCriteria.status === 'pending') {
        newStatus = 'pending';
      } else if (filterCriteria.status === 'active') {
        newStatus = 'active';
      } else if (filterCriteria.status === 'completed') {
        newStatus = 'completed';
      }
    }

    // Update URL with new status filter
    const newSearchParams = new URLSearchParams(searchParams);
    if (newStatus === 'all') {
      newSearchParams.delete('status');
    } else {
      newSearchParams.set('status', newStatus);
    }
    setSearchParams(newSearchParams);

    // Reset to first page when filter changes
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change while maintaining status filter
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    
    // Update URL with new page while maintaining status filter
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    setSearchParams(newSearchParams);
  };

  // Handle limit change while maintaining status filter
  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    
    // Update URL with new limit and reset page while maintaining status filter
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('limit', newLimit.toString());
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  // Handle order created
  const handleOrderCreated = (newOrder) => {
    setShowCreateModal(false);
    // Refresh orders list
    fetchOrdersData();
  };

  // Create Orders Button
  const createOrdersButton = () => {
    return (
        <button
          onClick={() => setShowCreateModal(true)}
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
        <div className="text-right">
          {createOrdersButton()}
        </div>

        {/* ActiveOrders component with status counts */}
        <ActiveOrders 
          onFilterChange={handleFilterChange} 
          statusCounts={statusCounts}
          loading={loading}
          currentStatus={currentStatus}
        />
        
        {/* OrderTable component with orders data */}
        <OrderTable 
          orders={orders}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onOrderCreated={handleOrderCreated}
      />
    </>
  );
};

export default Order;
