import React, { useState, useEffect } from "react";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";

import Expenses from "./components/Expenses/Expenses";

import "./App.css";

function App() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard totalExpenses={totalExpenses} />} />

        <Route
          path="/expenses"
          element={<Expenses expenses={expenses} setExpenses={setExpenses} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
