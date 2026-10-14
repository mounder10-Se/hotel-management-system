import React, { useState, useEffect } from "react";
import axios from "axios";

const Appointage = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchAppointage();
  }, [month]);

  const fetchAppointage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/@manager/appointage",
        {
          params: { month },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching appointage data:", error);
    }
  };

  const filteredData = data.filter((emp) =>
    emp.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="my-4">Employee Attendance & Salary</h2>

      <div className="mb-3">
        <label className="mr-2">Filter by Month:</label>
        <select onChange={(e) => setMonth(e.target.value)}>
          <option value="">All</option>
          <option value="2024-04">April 2024</option>
          <option value="2024-05">May 2024</option>
          <option value="2025-05">May 2025</option>
        </select>

        <label className="ml-4 mr-2">Search by Name:</label>
        <input
          type="text"
          placeholder="Enter employee name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-1"
        />
      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Static Salary</th>
            <th>Absent Days</th>
            <th>Final Salary</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((emp) => {
            const dailySalary = emp.static_salary / 30;
            const finalSalary =
              emp.static_salary - dailySalary * emp.absent_days;

            return (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>DZD{emp.static_salary.toFixed(2)}</td>
                <td>{emp.absent_days}</td>
                <td>DZD{finalSalary.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Appointage;
