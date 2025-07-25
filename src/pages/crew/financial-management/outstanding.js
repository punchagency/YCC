import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";

import manprofile from "../../../assets/images/crew/manprofile.png";

const Outstanding = ({financeData, fetchData, setFinanceData}) => {
  // New expense modal state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "Exterior",
    amount: "",
    date: null,
    description: "",
  });

  // Categories for dropdown
  const expenseCategories = [
    "Rent",
    "Utilities",
    "Groceries",
    "Food",
    "Fuels",
    "Health",
    "Office",
    "Education",
    "Others",
  ];

  // Handle expense form input changes
  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date change specifically
  const handleDateChange = (e) => {
    setNewExpense((prev) => ({
      ...prev,
      date: e.value,
    }));
  };

  // Handle saving the expense
  const handleSaveExpense = () => {
    // Here you would typically save the expense data
    console.log("Saving expense:", newExpense);
    setShowExpenseModal(false);
    // Reset form
    setNewExpense({
      category: "Exterior",
      amount: "",
      date: null,
      description: "",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <>
      <div className="flex flex-wrap justify-content-around align-items-center">
        <div
          style={{ width: "30%", borderRadius: "6px" }}
          className="bg-white p-4 rounded ml-4 mt-4"
        >
          <div className="flex items-center space-x-2">
            <div>
              <img src={manprofile} alt="manprofile" className="mr-2" />
            </div>
            <div>
              <p>Outstanding Invoices</p>
              <p className="text-2xl font-bold">$4,000</p>
            </div>
          </div>
        </div>
        <div
          style={{ width: "30%", borderRadius: "6px" }}
          className="bg-white p-4 rounded ml-4 mt-4"
        >
          <div className="flex items-center space-x-2">
            <div>
              <img src={manprofile} alt="manprofile" className="mr-2" />
            </div>
            <div>
              <p>Completed Payments</p>
              <p className="text-2xl font-bold">$4,000</p>
            </div>
          </div>
        </div>
        <div
          style={{ width: "30%", borderRadius: "6px" }}
          className="bg-white p-4 rounded ml-4 mt-4 mr-4"
        >
          <div className="flex items-center space-x-2">
            <div>
              <img src={manprofile} alt="manprofile" className="mr-2" />
            </div>
            <div>
              <p>Upcoming Expenses</p>
              <p className="text-2xl font-bold">$4,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Expense Modal */}
      <Dialog
        visible={showExpenseModal}
        onHide={() => setShowExpenseModal(false)}
        header="Add New Expense"
        modal
        style={{ width: "500px" }}
        contentStyle={{ padding: "20px" }}
        headerStyle={{ borderBottom: "none", padding: "20px 20px 0 20px" }}
        footer={null}
      >
        <div className="expense-form">
          {/* Category */}
          <div className="form-group mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <div className="relative">
              <select
                name="category"
                value={newExpense.category}
                onChange={handleExpenseChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md appearance-none focus:outline-none"
                style={{ backgroundColor: "white" }}
              >
                <option value="Exterior">Exterior</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div className="form-group mb-4">
            <label className="block text-gray-700 mb-2">Amount</label>
            <input
              type="text"
              name="amount"
              value={newExpense.amount}
              onChange={handleExpenseChange}
              placeholder="$45.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
              style={{ border: "1px solid lightgrey", outline: "none" }}
            />
          </div>

          {/* Date */}
          <div className="form-group mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <Calendar
              id="date"
              value={newExpense.date}
              onChange={handleDateChange}
              dateFormat="dd/mm/yy"
              placeholder="Select a date"
              showIcon
              className="w-full"
              style={{ width: "100%" }}
              inputStyle={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.375rem",

                outline: "none",
              }}
            />
          </div>

          {/* Description */}
          <div className="form-group mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={newExpense.description}
              onChange={handleExpenseChange}
              placeholder="Lunch With Client"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
              style={{ border: "1px solid lightgrey", outline: "none" }}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setShowExpenseModal(false)}
              className="text-white px-4 py-2"
              style={{
                backgroundColor: "#f44336",
                width: "50%",
                marginRight: "10px",
                border: "1px solid #f44336",
                borderRadius: "4px",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveExpense}
              className="text-white px-4 py-2"
              style={{
                backgroundColor: "#0387D9",
                width: "50%",
                border: "1px solid #0387D9",
                borderRadius: "4px",
              }}
            >
              Save Expense
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Outstanding;
