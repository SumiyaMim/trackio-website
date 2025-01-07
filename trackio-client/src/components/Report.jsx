import axios from "axios";
import { useEffect, useState } from "react";

const Report = () => {

  const [expanded, setExpanded] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalExpense, setTotalExpense] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpense, setEditingExpense] = useState({});
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  // Format server date to DD/MM/YYYY
  const formatDate = (serverDate) => {
    const date = new Date(serverDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get expenses from server
  useEffect(() => {
    axios.get("http://localhost:5001/expenses")
      .then((response) => {
        // Format the date for each expense
        const formattedExpenses = response.data.map((expense) => ({
          ...expense,
          date: formatDate(expense.date),
        }));
        setExpenses(formattedExpenses);
        setFilteredExpenses(formattedExpenses);
        // Calculate the total expense when expenses are fetched
        const total = formattedExpenses.reduce(
          (total, expense) => total + expense.totalAmount,
          0
        );
        setTotalExpense(total);
      });
  }, []);

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle filter based on date range
  const handleFilter = () => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Filter expenses based on the date range
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date.split('/').reverse().join('-'));
      return expenseDate >= from && expenseDate <= to;
    });

    setFilteredExpenses(filtered);

    // Recalculate the total expense after filtering
    const total = filtered.reduce(
      (total, expense) => total + expense.totalAmount,
      0
    );
    setTotalExpense(total);
  };

  // Delete expense
  const handleDelete = async (id) => {
    await axios.delete(`https://trackio-server.vercel.app/expenses/${id}`);
  
    // Update expenses list by removing the deleted item from the expense
    const updatedExpenses = expenses.map((expense) => ({
      ...expense,
      list: expense.list.filter((item) => item._id !== id),
    }));

    const isListEmpty = updatedExpenses.some((expense) => expense.list.length === 0);
    
    if (isListEmpty) {
      window.location.reload();
      return;
    }
  
    // Recalculate totalAmount for each expense after deletion
    const updatedFilteredExpenses = updatedExpenses.map((expense) => ({
      ...expense,
      totalAmount: expense.list.reduce((total, item) => total + item.amount, 0),
    }));
  
    setExpenses(updatedExpenses);
    setFilteredExpenses(updatedFilteredExpenses);
  
    // Recalculate the totalExpense after filtering and deletion
    const total = updatedFilteredExpenses.reduce(
      (total, expense) => total + expense.totalAmount,
      0
    );
  
    setTotalExpense(total);
  };

  // Edit expense
  const handleEdit = (expenseId, listId) => {
    // Find the expense and item to edit
    const expense = expenses.find((exp) => exp._id === expenseId);
    const item = expense.list.find((it) => it._id === listId);
  
    // Set the state for editing
    setCategory(item.category);
    setTitle(item.title);
    setAmount(item.amount);
    setEditingExpense({ expenseId, _id: listId }); 
    setIsEditing(true);
  };
  
  // Update expense
  const handleUpdateExpense = async () => {
    const updatedExpense = {
        category,
        title,
        amount,
    };

    // Update the expense lists
    await axios.put(
        `https://trackio-server.vercel.app/expenses/${editingExpense.expenseId}/list/${editingExpense._id}`,
        updatedExpense
    );

    // Update the local state for the updated expense list
    const updatedExpenses = expenses.map((expense) => {
        if (expense._id === editingExpense.expenseId) {
            const updatedList = expense.list.map((item) =>
                item._id === editingExpense._id
                    ? { ...item, category, title, amount }
                    : item
            );
            return { ...expense, list: updatedList };
        }
        return expense;
    });

    setExpenses(updatedExpenses);
    setFilteredExpenses(updatedExpenses);

    // Recalculate the totalAmount for the specific expense
    const updatedExpenseObj = updatedExpenses.find(
        (expense) => expense._id === editingExpense.expenseId
    );

    const updatedTotalAmount = updatedExpenseObj.list.reduce(
        (total, item) => total + item.amount,
        0
    );

    // Update the totalAmount
    await axios.patch(
        `https://trackio-server.vercel.app/expenses/${editingExpense.expenseId}`,
        { totalAmount: updatedTotalAmount }
    );

    // Recalculate the totalExpense for all expenses
    const total = updatedExpenses.reduce(
        (total, expense) => total + expense.totalAmount,
        0
    );
    setTotalExpense(total);

    window.location.reload();

    // Close the modal after update
    setIsEditing(false);
  };


  return (
    <div className="bg-gray-50 flex justify-center items-center py-28">
      <div className="md:w-full max-w-2xl lg:max-w-4xl bg-white shadow-md rounded-lg px-8 md:px-10 py-10 lg:p-16">
        <h1 className="text-xl font-bold text-[#406EA2] mb-8">Expenditure Report:</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-600">
              From
            </label>
            <input
              type="date"
              id="from"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-600">
              To
            </label>
            <input
              type="date"
              id="to"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button 
            onClick={handleFilter} 
            className="mt-6 bg-[#406EA2] text-white px-4 py-2 rounded-md hover:bg-[#366294]"
          >
            GO
          </button>
        </div>

        {/* Display Expenses */}
        <div className="space-y-2">
          {filteredExpenses.map((expense, index) => (
            <div
              key={index}
              className="border border-[#406EA2] rounded-md p-4 shadow-sm"
            >
              <div
                className="flex justify-between items-center cursor-pointer gap-4"
                onClick={() => toggleExpand(index)}
              >
                <span>Total Expense of {expense.date}</span>
                <span className="font-semibold text-[#406EA2]">
                  {expense.totalAmount} Tk
                  <span className="ml-2">
                    {expanded[index] ? "▲" : "▼"}
                  </span>
                </span>
              </div>
              {expanded[index] && (
                <div className="mt-4 bg-[hsl(212,76%,95%)] rounded-md p-4">
                  <h3 className="text-center font-semibold text-[#406EA2] mb-2">
                    Expense List
                  </h3>
                  <table className="w-full text-left text-[#406EA2]">
                    <thead className="bg-[rgb(173,206,242)] text-xs md:text-sm">
                      <tr>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Item Name</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expense.list.map((detail, i) => (
                        <tr key={i} className="border-b text-xs md:text-sm">
                          <td className="px-4 py-2">{detail.category}</td>
                          <td className="px-4 py-2">{detail.title}</td>
                          <td className="px-4 py-2">{detail.amount} Tk</td>
                          <td className="px-4 py-2">
                            <button
                              className="text-green-600 hover:underline"
                              onClick={() => handleEdit(expense._id, detail._id)}
                            >
                              Edit
                            </button>{" "}
                            |{" "}
                            <button
                              className="text-red-600 hover:underline"
                              onClick={() => handleDelete(detail._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total Expense */}
        <div className="flex justify-between items-center bg-[#6e96bf] text-white px-5 py-3 mt-4 rounded-md shadow font-semibold">
          <span>Total Expense</span>
          <span>{totalExpense} Tk</span>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-md shadow-md w-96">
              <h3 className="text-lg font-semibold text-[#406EA2] mb-4">Edit Expense</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Select Category
                  </option>
                  <option value="Commute">Commute</option>
                  <option value="Eating Out">Eating Out</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Gardening">Gardening</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Health Care">Health Care</option>
                  <option value="Travel">Travel</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Education">Education</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Subscriptions">Subscriptions</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Amount</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-[#ececec] px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateExpense}
                  className="bg-[#406EA2] px-4 text-white py-2 rounded-md"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
