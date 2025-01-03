import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const PieGraph = () => {
  // Data for the chart
  const data = [
    { name: "Utilities", value: 240 },
    { name: "Groceries", value: 89 },
    { name: "Eating Out", value: 53 },
    { name: "Gardening", value: 51 },
    { name: "Commute", value: 39 },
  ];

  const COLORS = ["#036666", "#4CAF50", "#FFD700", "#FF5733", "#A4D96C"];

  // State for date range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    // Handle filtering logic if necessary
    console.log("Filtering data from:", startDate, "to:", endDate);
  };

  return (
    <div className="flex flex-col items-start py-28 w-full max-w-4xl mx-auto px-5 md:px-12 lg:px-0">
      <div>
        {/* Header */}
        <h1 className="text-xl font-bold text-[#406EA2] mb-8">Expenditures per Category:</h1>

        {/* Date Range Picker */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-600">
            From
            </label>
            <input
            type="date"
            id="from"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
        </div>
        <button
            onClick={handleFilter}
            className="mt-6 bg-[#406EA2] text-white px-4 py-2 rounded-md hover:bg-[#366294]"
        >
            GO
        </button>
        </div>

        {/* Pie Chart */}
        <div className="flex items-center justify-center relative">
        <div className="absolute text-center">
            <h3 className="text-base font-semibold text-gray-500">Spent per Category</h3>
          </div>
          <PieChart width={400} height={400}>
              <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: $${value}`}
              >
              {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              </Pie>
              <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default PieGraph;
