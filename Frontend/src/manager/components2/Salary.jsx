import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Salary() {
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/employees")
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter(emp => emp.id !== id));
      })
      .catch(error => console.error("Error deleting employee:", error));
  };

  const filteredEmployees = employees.filter(emp =>
    (searchId === "" || emp.id.toString().includes(searchId)) &&
    (searchName === "" || emp.name.toLowerCase().includes(searchName.toLowerCase()))
  );

  return (
    <div className="p-5">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-6">Manage Employees Salaries</h3>
      </div>

      <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search By Employee ID"
          className="px-4 py-2 border rounded-md"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search By Employee Name"
          className="px-4 py-2 border rounded-md"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Link
          to="/add-employee"
          className="px-4 py-2 bg-[#c9ab8d] text-white rounded-md"
        >
          Add New Employee
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-300 shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Domaine</th>
            <th className="border px-4 py-2">Salary</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Hire Date</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp.id} className="text-center">
              <td className="border px-4 py-2">{emp.id}</td>
              <td className="border px-4 py-2">{emp.name}</td>
              <td className="border px-4 py-2">{emp.domaine}</td>
              <td className="border px-4 py-2">DZD {emp.salary}</td>
              <td
                className={`border px-4 py-2 ${
                  emp.status === "Paid" ? "text-green-600" : "text-red-600"
                }`}
              >
                {emp.status}
              </td>
              <td className="border px-4 py-2">
                {emp.hire_date ? new Date(emp.hire_date).toLocaleDateString() : "N/A"}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-md">
                  View
                </button>
                <Link
                  to={`/update-salary/${emp.id}`}
                  className="px-3 py-1 bg-green-500 text-white rounded-md"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Salary;
