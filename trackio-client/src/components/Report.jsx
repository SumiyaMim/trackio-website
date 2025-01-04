import { useState } from "react";

const expenses = [
  {
    date: "02/05/2023",
    amount: 250,
    list: [
      { category: "Eating Out", title: "Lunch", cost: 150 },
      { category: "Commute", title: "Bus Fare", cost: 100 },
    ],
  },
  {
    date: "03/05/2023",
    amount: 850,
    list: [
      { category: "Groceries", title: "Vegetables", cost: 400 },
      { category: "Health Care", title: "Medicine", cost: 450 },
    ],
  },
  {
    date: "04/05/2023",
    amount: 200,
    list: [
      { category: "Eating Out", title: "Chips", cost: 100 },
      { category: "Eating Out", title: "Juice", cost: 100 },
    ],
  },
  {
    date: "05/05/2023",
    amount: 700,
    list: [
      { category: "Utilities", title: "Electricity Bill", cost: 700 },
    ],
  },
  {
    date: "06/05/2023",
    amount: 1400,
    list: [
      { category: "Utilities", title: "Apartment Rent", cost: 1400 },
    ],
  },
  {
    date: "07/05/2023",
    amount: 150,
    list: [
      { category: "Eating Out", title: "Breakfast", cost: 150 },
    ],
  },
  {
    date: "08/05/2023",
    amount: 550,
    list: [
      { category: "Shopping", title: "Clothes", cost: 550 },
    ],
  },
];

const Report = () => {
  
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);

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
            />
          </div>
          <button className="mt-6 bg-[#406EA2] text-white px-4 py-2 rounded-md hover:bg-[#366294]">
            GO
          </button>
        </div>
        <div className="space-y-2">
          {expenses.map((expense, index) => (
            <div
              key={index}
              className="border border-[#406EA2] rounded-md p-4 shadow-sm"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(index)}
              >
                <span>Total Expense of {expense.date}</span>
                <span className="font-semibold text-[#406EA2]">
                  {expense.amount} Tk
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
                        <th className="px-4 py-2">Cost</th>
                        <th className="px-4 py-2">Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expense.list.map((detail, i) => (
                        <tr key={i} className="border-b text-xs md:text-sm">
                          <td className="px-4 py-2">{detail.category}</td>
                          <td className="px-4 py-2">{detail.title}</td>
                          <td className="px-4 py-2">{detail.cost} Tk</td>
                          <td className="px-4 py-2">
                            <button
                              className="text-green-600 hover:underline"
                            >
                              Edit
                            </button>{" "}
                            |{" "}
                            <button
                              className="text-red-600 hover:underline"
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
        <div className="flex justify-between items-center bg-[#6e96bf] text-white px-5 py-3 mt-4 rounded-md shadow font-semibold">
          <span>Total Expense</span>
          <span>{totalExpense} Tk</span>
        </div>
      </div>
    </div>
  );
};

export default Report;
