
const expenses = [
  { date: "02/05/2023", amount: 250 },
  { date: "03/05/2023", amount: 850 },
  { date: "04/05/2023", amount: 200 },
  { date: "05/05/2023", amount: 700 },
  { date: "06/05/2023", amount: 1400 },
  { date: "07/05/2023", amount: 150 },
  { date: "08/05/2023", amount: 550 },
];

const Report = () => {
  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-16">
        <h1 className="text-xl font-bold text-[#406EA2] mb-8">Expenditure Report:</h1>
        <div className="flex items-center gap-4 mb-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-600">
              From
            </label>
            <input
              type="date"
              id="from"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-600">
              To
            </label>
            <input
              type="date"
              id="to"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            GO
          </button>
        </div>
        <div className="space-y-2">
          {expenses.map((expense, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-md shadow-sm"
            >
              <span>Total Expense of {expense.date}</span>
              <span>{expense.amount} Tk</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center bg-blue-200 text-blue-800 px-4 py-2 mt-4 rounded-md shadow font-semibold">
          <span>Total Expense</span>
          <span>{totalExpense} Tk</span>
        </div>
      </div>
    </div>
  );
};

export default Report;
