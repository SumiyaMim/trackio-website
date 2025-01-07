import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const PieGraph = () => {
  
  const COLORS = [
    "#036666", "#4CAF50", "#FFD700", "#FF5733", "#A4D96C", "#3B5998", 
    "#FF69B4", "#8A2BE2", "#FF4500", "#D2691E", "#20B2AA"
  ];

  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expenses, setExpenses] = useState([]); 

  const [chartSize, setChartSize] = useState({
    width: 600,
    height: 600,
    innerRadius: 80,
    outerRadius: 180,
  });

  // Function to aggregate expenses by category
  const aggregateDataByCategory = (expenses) => {
    const aggregated = {};

    // Loop through each expense and sum amounts by category
    expenses.forEach((expense) => {
      expense.list.forEach((item) => {
        if (aggregated[item.category]) {
          aggregated[item.category] += item.amount;
        } else {
          aggregated[item.category] = item.amount;
        }
      });
    });

    // Convert the aggregated data into an array for PieChart
    const aggregatedData = Object.keys(aggregated).map((category) => ({
      name: category,
      value: aggregated[category],
    }));

    return aggregatedData;
  };

  // Handle filter and update chart
  const handleFilter = () => {
    // If no date range is provided, don't filter
    if (!startDate || !endDate) {
      return;
    }

    const fromDate = new Date(startDate);
    const toDate = new Date(endDate);

    // Filter expenses based on the date range
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date.split('/').reverse().join('-'));
      return expenseDate >= fromDate && expenseDate <= toDate;
    });

    // Aggregate filtered data by category
    const aggregatedData = aggregateDataByCategory(filteredExpenses);
    setData(aggregatedData);
  };

  useEffect(() => {
    axios.get("http://localhost:5001/expenses")
      .then((response) => {
        setExpenses(response.data);
        const aggregated = aggregateDataByCategory(response.data);
        setData(aggregated);
      });
  }, []);

  // Dynamically adjust the chart size based on window size
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setChartSize({ width: 300, height: 400, innerRadius: 60, outerRadius: 150 });
      } else if (window.innerWidth < 1024) {
        setChartSize({ width: 600, height: 600, innerRadius: 80, outerRadius: 180 });
      } else {
        setChartSize({ width: 600, height: 600, innerRadius: 80, outerRadius: 200 });
      }
    };

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="py-28 w-full max-w-4xl mx-auto px-7 md:px-12 lg:px-0">
      <h1 className="text-xl font-bold text-[#406EA2] mb-8">Expenditures per Category:</h1>
      
      {/* Filter Section */}
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
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center relative">
          <div className="absolute text-center">
            <h3 className="text-xs md:text-base font-semibold text-gray-500">Spent <br />per Category</h3>
          </div>
          <PieChart width={chartSize.width} height={chartSize.height}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={chartSize.innerRadius}
              outerRadius={chartSize.outerRadius}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) / 2;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {`${data[index].name}: Tk ${data[index].value}`}
                  </text>
                );
              }}
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
