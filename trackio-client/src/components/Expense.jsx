import { useEffect, useState } from 'react';

const Expense = () => {
    
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${month} ${day}, ${year} ${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' + minutes : minutes} ${suffix}`;
    setCurrentDateTime(formattedTime);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-28 px-5 md:px-10">
      <div className="flex flex-col lg:flex-row items-center gap-20">
        <div className="w-full lg:w-1/2">
          <h2 className="font-bold text-4xl md:text-5xl mb-4 text-[#4a4a4a]">Manage Tracking</h2>
          <h2 className="font-bold text-4xl md:text-5xl text-[#FF6F61] mb-9">Predict Your Expenses</h2>
          <p className="font-light text-lg italic mb-10">Easily track your expenses, see your spending habits, and predict future costs with our simple, efficient, and reliable system.</p>
          <div className="flex items-center gap-4">
            <button className="bg-[#406EA2] text-white text-lg font-semibold px-6 py-3 rounded">Get Started</button>
            <button className="bg-[#e8f4ff] text-[#406EA2] text-lg font-semibold px-6 py-3 rounded">Learn More</button>
          </div>
        </div>
        {/* Input Section */}
        <div className="w-full lg:w-1/2 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] p-10 md:p-16 lg:p-14 rounded-md">
          <h4 className="text-center text-xl font-bold mb-14 text-[#406EA2]">Expense Record</h4>
          <div className="relative z-10 mb-8">
              <input
              id="title"
              type="text"
              className="w-full peer block appearance-none border-0 border-b-2 border-b-[#cccccc] border-gray-700 bg-transparent px-0 py-3 text-sm text-gray-700 font-medium focus:border-[#406EA2] focus:outline-none focus:ring-0"
              placeholder=" "
              />
              <label
              htmlFor="title"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-base font-medium text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#406EA2] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
              Title
              </label>
          </div>
          <div className="relative z-10 mb-8">
            <select
              id="category"
              className="w-full peer block appearance-none border-0 border-b-2 border-b-[#cccccc] border-gray-700 bg-transparent px-0 py-3 text-sm text-gray-700 font-medium focus:border-[#406EA2] focus:outline-none focus:ring-0"
              placeholder=" "
              defaultValue=""
            >
              <option value="" disabled hidden>Select Category</option>
              <option value="Commute">Commute</option>
              <option value="Eating Out">Eating Out</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Gardening">Gardening</option>
              <option value="Groceries">Groceries</option>
              <option value="Health Care">Health Care</option>
              <option value="Travel">Travel</option>
              <option value="Utilities">Utilities</option>
              <option value="Education">Education</option>
              <option value="Subscriptions">Subscriptions</option>
            </select>
            <label
              htmlFor="category"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-base font-medium text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#406EA2] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              Category
            </label>
          </div>
          <div className="relative z-10 mb-8">
            <input
              id="incurred-on"
              type="text"
              value={currentDateTime}
              className="w-full peer block appearance-none border-0 border-b-2 border-b-[#cccccc] border-gray-700 bg-transparent px-0 py-3 text-sm text-gray-700 font-medium focus:border-[#406EA2] focus:outline-none focus:ring-0"
              placeholder=" "
              readOnly
            />
            <label
              htmlFor="incurred-on"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-base font-medium text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#406EA2] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
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
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-base font-medium text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#406EA2] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Amount &nbsp;<span className="text-xs">(TK.)</span>
              </label>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-[#406EA2] text-white text-base font-semibold px-5 py-2 rounded">Submit</button>
            <button className="bg-[#ececec] text-base font-semibold px-5 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
