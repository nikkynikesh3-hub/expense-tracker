import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./index.css";
import api from "../../api";

const Home = () => {
  const navigate = useNavigate();
  const [addForm, setAddForm] = useState({ title: "" });
  const [expensesList, addExpenses] = useState([]);

  const onLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    getAllExpenses();
  });

  const getAllExpenses = async () => {
    const jwtToken = localStorage.getItem("token");
    console.log(jwtToken);

    try {
      const response = await api.get("/expenses");
      console.log(response.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <main className="home-main-bg">
      <div className="hm-sub-main-contaier">
        <div className="hm-title-lgtbtn-card">
          <h1 className="hm-title">
            Expense<span className="hm-span-title">Tracker</span>
          </h1>
          <button type="button" className="hm-lgt-btn" onClick={onLogOut}>
            Log Out
          </button>
        </div>
        <div className="total-card">
          <p className="total-label">Total spent</p>
          <h2 className="total-amount">₹1,250</h2>
          <p className="total-count">12 expenses in total</p>
        </div>
        <form className="add-expense-card">
          <h2 className="add-expense-title">Add expense</h2>
          <div className="add-field">
            <label className="add-label" htmlFor="expenseTitle">
              Title
            </label>
            <input
              id="expenseTitle"
              name="title"
              type="text"
              value={addForm.title}
              className="add-input"
              placeholder="e.g. Lunch"
            />
          </div>
          <div className="add-row">
            <div className="add-field">
              <label className="add-label" htmlFor="expenseAmount">
                Amount
              </label>
              <input
                id="expenseAmount"
                name="amount"
                type="number"
                className="add-input"
                placeholder="₹ 0"
              />
            </div>

            <div className="add-field">
              <label className="add-label" htmlFor="expenseCategory">
                Category
              </label>
              <select
                id="expenseCategory"
                name="category"
                className="add-select"
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Bills</option>
                <option>Shopping</option>
                <option>Health</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* type="button" for now, so the page does not reload when clicked */}
          <button type="button" className="add-button">
            Add expense
          </button>
        </form>
      </div>
      <Navbar />
    </main>
  );
};

export default Home;
