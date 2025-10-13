import axios from "axios";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Get dashboard summary report data
 * @param {Object} params - Optional query parameters
 * @returns {Promise<Object>} - Dashboard summary data
 */
export const getDashboardSummary = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/crew-reports/dashboard`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return {
      status: true,
      data: response.data,
      message: "Dashboard summary data retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return {
      status: false,
      data: null,
      message:
        error.response?.data?.message || "Failed to retrieve dashboard summary",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Get order report data
 * @param {Object} params - Optional query parameters (date range, status, etc.)
 * @returns {Promise<Object>} - Order report data
 */
export const getOrderReport = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/crew-reports/orders`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return {
      status: true,
      data: response.data,
      message: "Order report data retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching order reports:", error);
    return {
      status: false,
      data: null,
      message:
        error.response?.data?.message || "Failed to retrieve order reports",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Get booking report data
 * @param {Object} params - Optional query parameters (date range, status, etc.)
 * @returns {Promise<Object>} - Booking report data
 */
export const getBookingReport = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/crew-reports/bookings`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return {
      status: true,
      data: response.data,
      message: "Booking report data retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching booking reports:", error);
    return {
      status: false,
      data: null,
      message:
        error.response?.data?.message || "Failed to retrieve booking reports",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Get inventory report data
 * @param {Object} params - Optional query parameters (categories, status, etc.)
 * @returns {Promise<Object>} - Inventory report data
 */
export const getInventoryReport = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/crew-reports/inventory`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return {
      status: true,
      data: response.data,
      message: "Inventory report data retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching inventory reports:", error);
    return {
      status: false,
      data: null,
      message:
        error.response?.data?.message || "Failed to retrieve inventory reports",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Export report data as CSV
 * @param {string} reportType - Type of report (dashboard, orders, bookings, inventory)
 * @param {Object} params - Optional query parameters
 * @returns {Promise<Object>} - CSV data or download URL
 */
export const exportReportCSV = async (reportType, params = {}) => {
  try {
    const response = await axios.get(
      `${API_URL}/crew-reports/${reportType}/export`,
      {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "text/csv",
        },
        responseType: "blob",
      }
    );

    // Create a download link for the CSV file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return {
      status: true,
      message: `${reportType} report exported successfully`,
    };
  } catch (error) {
    console.error(`Error exporting ${reportType} report:`, error);
    return {
      status: false,
      message:
        error.response?.data?.message ||
        `Failed to export ${reportType} report`,
      error: error.response?.data || error.message,
    };
  }
};


/**
 * Convert JSON report data to CSV format
 * @param {Object} reportData - Report data from server
 * @returns {string} - CSV content
 */
const convertToCSV = (reportData) => {
  let csvContent = '';

  if (reportData.orders) {
    csvContent += 'ORDERS\n';
    csvContent += 'Order ID,Status,Total Price,Order Date,Created At,Delivery Address\n';
    reportData.orders.forEach(order => {
      csvContent += `${order.orderId},${order.overallStatus},${order.totalPrice},${order.orderDate},${order.createdAt},"${order.deliveryAddress?.recipientStreet || ''}"\n`;
    });
    csvContent += '\n';
  }

  if (reportData.bookings) {
    csvContent += 'BOOKINGS\n';
    csvContent += 'Booking ID,Status,Date Time,Vendor Name,Created At\n';
    reportData.bookings.forEach(booking => {
      csvContent += `${booking.bookingId},${booking.bookingStatus},${booking.dateTime},${booking.vendorName},${booking.createdAt}\n`;
    });
    csvContent += '\n';
  }

  if (reportData.activities) {
    csvContent += 'RECENT ACTIVITIES\n';
    csvContent += 'Type,ID,Status,Date,Created At\n';
    reportData.activities.orders?.forEach(order => {
      csvContent += `Order,${order.orderId},${order.overallStatus},${order.orderDate},${order.createdAt}\n`;
    });
    reportData.activities.bookings?.forEach(booking => {
      csvContent += `Booking,${booking.bookingId},${booking.bookingStatus},${booking.dateTime},${booking.createdAt}\n`;
    });
  }

  return csvContent;
};

/**
 * Convert JSON report data to PDF format
 * @param {Object} reportData - Report data from server
 * @param {string} startDate - Start date for report
 * @param {string} endDate - End date for report
 * @returns {Blob} - PDF blob
 */
const convertToPDF = (reportData, startDate, endDate) => {
  try {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Crew Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    if (startDate && endDate) {
      doc.text(`Period: ${startDate} to ${endDate}`, 14, 34);
    }

    let yPos = startDate && endDate ? 42 : 36;

    if (reportData.orders) {
      doc.setFontSize(14);
      doc.text('Orders', 14, yPos);
      autoTable(doc, {
        startY: yPos + 4,
        head: [['Order ID', 'Status', 'Total Price', 'Order Date', 'Created At']],
        body: reportData.orders.map(order => [
          order.orderId,
          order.overallStatus,
          `$${order.totalPrice}`,
          new Date(order.orderDate).toLocaleDateString(),
          new Date(order.createdAt).toLocaleDateString()
        ])
      });
      yPos = doc.lastAutoTable.finalY + 10;
    }

    if (reportData.bookings) {
      doc.setFontSize(14);
      doc.text('Bookings', 14, yPos);
      autoTable(doc, {
        startY: yPos + 4,
        head: [['Booking ID', 'Status', 'Date Time', 'Vendor Name', 'Created At']],
        body: reportData.bookings.map(booking => [
          booking.bookingId,
          booking.bookingStatus,
          new Date(booking.dateTime).toLocaleDateString(),
          booking.vendorName,
          new Date(booking.createdAt).toLocaleDateString()
        ])
      });
      yPos = doc.lastAutoTable.finalY + 10;
    }

    if (reportData.activities) {
      doc.setFontSize(14);
      doc.text('Recent Activities', 14, yPos);
      const activityRows = [];
      reportData.activities.orders?.forEach(order => {
        activityRows.push([
          'Order',
          order.orderId,
          order.overallStatus,
          new Date(order.orderDate).toLocaleDateString(),
          new Date(order.createdAt).toLocaleDateString()
        ]);
      });
      reportData.activities.bookings?.forEach(booking => {
        activityRows.push([
          'Booking',
          booking.bookingId,
          booking.bookingStatus,
          new Date(booking.dateTime).toLocaleDateString(),
          new Date(booking.createdAt).toLocaleDateString()
        ]);
      });
      autoTable(doc, {
        startY: yPos + 4,
        head: [['Type', 'ID', 'Status', 'Date', 'Created At']],
        body: activityRows
      });
    }

    return doc.output('blob');
  } catch (error) {
    console.log(error)

  }
};

/**
 * Generate and download report
 * @param {Object} params - Report parameters (reportType, startDate, endDate, frequency, fileType)
 * @returns {Promise<Object>} - Report data and file download
 */
export const generateReport = async (params = {}) => {
  try {
    const { fileType = 'pdf', startDate, endDate } = params;

    const response = await axios.post(
      `${API_URL}/crew-reports/generate`,
      params,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.status) {
      const reportData = response.data.data;
      console.log({ reportData })
      let blob, filename;

      if (fileType === 'csv') {
        const csvContent = convertToCSV(reportData);
        blob = new Blob([csvContent], { type: 'text/csv' });
        filename = `crew-report-${Date.now()}.csv`;
      } else {
        blob = convertToPDF(reportData, startDate, endDate);
        filename = `crew-report-${Date.now()}.pdf`;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        status: true,
        message: 'Report generated successfully',
      };
    } else {
      return {
        status: false,
        message: response.data.message || "Failed to generate reports."
      }
    }
  } catch (error) {
    console.error(`Error generating ${params.reportType} report:`, error);
    return {
      status: false,
      message:
        error.response?.data?.message ||
        `Failed to generate ${params.reportType} report`,
      error: error.response?.data || error.message,
    };
  }
};

