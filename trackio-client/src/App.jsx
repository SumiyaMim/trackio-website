import Navbar from "./components/Navbar"
import Expense from "./components/Expense"
import Report from "./components/Report"
import PieGraph from "./components/PieGraph"
import ExpenseBarChart from "./components/ExpenseBarChart"

function App() {

  return (
    <>
      <Navbar/>
      <Expense/>
      <Report/>
      <PieGraph/>
      <ExpenseBarChart/>
    </>
  )
}

export default App
