import React, { useState } from "react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const History = () => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Sample payment history data
  const payments = [
    {
      id: "INV-001",
      vendor: "John Doe",
      amount: 250.0,
      payMethod: "Credit Card",
      date: "01/01/2025",
      status: "In Progress",
    },
    {
      id: "INV-002",
      vendor: "Alice Smith",
      amount: 150.0,
      payMethod: "PayPal",
      date: "02/15/2025",
      status: "Completed",
    },
    {
      id: "INV-003",
      vendor: "Bob Johnson",
      amount: 300.0,
      payMethod: "Bank Transfer",
      date: "03/22/2025",
      status: "Pending",
    },
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <FaSortAmountUp className="ml-1" />
      ) : (
        <FaSortAmountDown className="ml-1" />
      );
    }
    return <FaSortAmountUp className="ml-1 opacity-30" />;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mx-5 my-5" style={{width:"70%", height:"550px", borderRadius:"10px"}}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Payment History
      </h2>
      <p className="text-gray-600 mb-6">
        View detailed payment information, including status and payment method,
        for full transparency.
      </p>

      <div className="overflow-x-auto" style={{width:"100%"}}>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border border-gray-200"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  Inv No. {getSortIcon("id")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border border-gray-200"
                onClick={() => handleSort("vendor")}
              >
                <div className="flex items-center">
                  Vender {getSortIcon("vendor")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border border-gray-200"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount {getSortIcon("amount")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border border-gray-200"
                onClick={() => handleSort("payMethod")}
              >
                <div className="flex items-center">
                  Pay Method {getSortIcon("payMethod")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border border-gray-200"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date {getSortIcon("date")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border border-gray-200"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status {getSortIcon("status")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-200">
                  {payment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200">
                  {payment.vendor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200">
                  ${payment.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200">
                  {payment.payMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200">
                  {payment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
