import { useState, useEffect } from "react";
import axios from "axios";

const Expense = () => {
  
  const [currentDate, setCurrentDate] = useState(""); 
  const [currentTime, setCurrentTime] = useState("");
  const [expenses, setExpenses] = useState([]);

  // Set current date and time
  useEffect(() => {
    const currentDateTime = new Date();
    const day = currentDateTime.getDate();
    const month = currentDateTime.toLocaleString("default", { month: "long" });
    const year = currentDateTime.getFullYear();
    const hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    const formattedDate = `${month} ${day}, ${year}`;
    setCurrentDate(formattedDate);
    const formattedTime = `${hours12}:${minutes < 10 ? "0" + minutes : minutes} ${suffix}`;
    setCurrentTime(formattedTime);
  }, []);

  // Handle Expenses
  const handleExpenses = async (e) => {
    e.preventDefault();
  
    const form = e.target;
    const title = form.title.value;
    const category = form.category.value;
    const amount = parseFloat(form.amount.value);
  
    const newExpense = { category, title, amount };
  
    // Calculate total amount for the new expense
    const newTotalAmount = expenses.reduce((total, item) => total + item.amount, 0) + amount;
  
    // Update the expense list
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
  
    // Prepare data to send to the server
    const expenseData = {
      date: currentDate,  
      time: currentTime, 
      totalAmount: newTotalAmount,
      list: updatedExpenses,
    };
  
    form.reset();
  
    // Fetch expenses from the server
    const response = await axios.get("http://localhost:5000/expenses");
    
    // Find the existing expense for the current date 
    const existingExpense = response.data.find(
      (expense) => expense.date === currentDate 
    );
  
  
    if (existingExpense) {
      // If an expense exists, update it with the new expense data
      const updatedExpense = {
        totalAmount: existingExpense.totalAmount + amount,
        list: [...existingExpense.list, newExpense],
      };
  
      await axios.patch(`http://localhost:5000/expenses/${existingExpense._id}`, updatedExpense);
      console.log("Expense Updated:", updatedExpense);
    } else {
      // If no expense exists for the current date, create a new record
      await axios.post("http://localhost:5000/expenses", expenseData);
      console.log("New Expense Created:", expenseData);
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto py-28 px-5 md:px-10">
      <div className="flex flex-col lg:flex-row items-center gap-20">
        <div className="w-full lg:w-1/2">
          <h2 className="font-bold text-4xl md:text-5xl mb-4 text-[#4a4a4a]">Manage Tracking</h2>
          <h2 className="font-bold text-4xl md:text-5xl text-[#FF6F61] mb-9">Predict Your Expenses</h2>
          <p className="font-light text-lg italic mb-10">
            Easily track your expenses, see your spending habits, and predict future costs with our
            simple, efficient, and reliable system.
          </p>
          <div className="flex items-center gap-4">
            <button className="bg-[#406EA2] text-white text-lg font-semibold px-6 py-3 rounded">
              Get Started
            </button>
            <button className="bg-[#e8f4ff] text-[#406EA2] text-lg font-semibold px-6 py-3 rounded">
              Learn More
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="w-full lg:w-1/2 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] p-10 md:p-16 lg:p-14 rounded-md">
          <h4 className="text-center text-xl font-bold mb-14 text-[#406EA2]">Expense Record</h4>
          <form onSubmit={handleExpenses}>
            <div className="relative z-10 mb-8">
              <input
                id="title"
                type="text"
                className="w-full peer block appearance-none border-0 border-b-2 border-b-[#cccccc] border-gray-700 bg-transparent px-0 py-3 text-sm text-gray-700 font-medium focus:border-[#406EA2] focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label
                htmlFor="title"
                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-base font-medium text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#406EA2]"
              >
                Title
              </label>
            </div>

            <div className="relative z-10 mb-8">
              <select
                id="category"
                className="w-full peer block appearance-none border-0 border-b-2 border-b-[#cccccc] border-gray-700 bg-transparent px-0 py-3 text-sm text-gray-700 font-medium focus:border-[#406EA2] focus:outline-none focus:ring-0"
                defaultValue=""
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
              <label
                htmlFor="category"
                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-base font-medium text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#406EA2]"
              >
                Category
              </label>
            </div>

            <div className="relative z-10 mb-8">
              <input
                id="date"
                type="text"
                value={`${currentDate} ${currentTime}`}  // Display both date and time
                className="w-full peer block appearance-none border-0 border-b-2 border-b-[#cccccc] border-gray-700 bg-transparent px-0 py-3 text-sm text-gray-700 font-medium focus:border-[#406EA2] focus:outline-none focus:ring-0"
                placeholder=" "
                readOnly
              />
              <label
                htmlFor="date"
                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-base font-medium text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#406EA2]"
              >
                Incurred on
              </label>
            </div>

            <div className="relative z-10 mb-14">
              <input
                id="amount"
                type="number"
                className="w-full peer block appearance-none border-0 border-b-2 border-b-[#cccccc] border-gray-700 bg-transparent px-0 py-3 text-sm text-gray-700 font-medium focus:border-[#406EA2] focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label
                htmlFor="amount"
                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-base font-medium text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#406EA2]"
              >
                Amount &nbsp;<span className="text-xs">(TK.)</span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#406EA2] text-white text-base font-semibold px-5 py-2 rounded hover:bg-[#366294]"
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-[#ececec] text-base font-semibold px-5 py-2 rounded hover:bg-[#e5e5e5]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Expense;
