import React, { useEffect, useState } from "react";
import axios from "axios";

function Budget() {
  const [totals, setTotals] = useState({
    totalSpent: 10000,
    totalSalaries: 5000,
    totalRevenues: 20000,
    profit: -1000,
  });

  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/@manager/budget/totals")
      .then((res) => setTotals(res.data))
      .catch((err) => console.error("Error fetching totals:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Budget Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-yellow-200 p-4 rounded-lg shadow text-center">
          <h3 className="font-semibold text-lg">Total Spent</h3>
          <p className="text-xl font-bold">DZD {totals.totalSpent}</p>
        </div>
        <div className="bg-red-200 p-4 rounded-lg shadow text-center">
          <h3 className="font-semibold text-lg">Total Salaries</h3>
          <p className="text-xl font-bold">DZD {totals.totalSalaries}</p>
        </div>
        <div className="bg-green-200 p-4 rounded-lg shadow text-center">
          <h3 className="font-semibold text-lg">Total Revenues</h3>
          <p className="text-xl font-bold">DZD {totals.totalRevenues}</p>
        </div>
        <div
          className={`p-4 rounded-lg shadow text-center ${totals.profit >= 0 ? "bg-green-300" : "bg-red-300"}`}
        >
          <h3 className="font-semibold text-lg">Profit</h3>
          <p className="text-xl font-bold">DZD {totals.profit}</p>
        </div>
      </div>

      {/* Expenses Breakdown Table */}

    </div>
  );
}

export default Budget;
