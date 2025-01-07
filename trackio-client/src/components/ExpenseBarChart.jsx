import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ExpenseBarChart = () => {

  const [data, setData] = useState([]);

  // Format the date as day/month
  const formatDate = (date) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${dayOfWeek} ${day}/${month}`;
  };

  useEffect(() => {
    axios
      .get("https://trackio-server.vercel.app/forecast")
      .then((response) => {
        const forecastData = response.data;

        // Predict the next 7 days total expense from the current date
        const today = new Date();
        const formattedData = forecastData.slice(0, 7).map((item, index) => {
          const forecastDate = new Date(today);
          forecastDate.setDate(today.getDate() + index);

          const formattedDate = formatDate(forecastDate);
          return { day: formattedDate, expense: item.expense };
        });

        setData(formattedData);
      });
  }, []);

  return (
    <div className="py-28 px-6 bg-gray-50">
      <div className="lg:max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-28">
          Forecasted expenses for the next 7 days
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fontWeight: "bold" }}
              stroke="#333"
            />
            <YAxis
              tick={{ fontSize: 12, fontWeight: "bold" }}
              stroke="#333"
            />
            <Tooltip
              formatter={(value) => `Tk. ${value}`}
              labelStyle={{ fontWeight: "bold" }}
              contentStyle={{
                backgroundColor: "#f9f9f9",
                border: "1px solid #ccc",
              }}
            />
            <Legend />
            <Bar
              dataKey="expense"
              fill="#4a90e2"
              name="Expenses (Tk.)"
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseBarChart;
