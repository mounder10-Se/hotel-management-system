import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  const [form, setForm] = useState({
    name: "",
    domaine: "",
    salary: "",
    status: "Unpaid",
    hire_date: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/employees", form)
      .then(() => navigate("/salary"))
      .catch(error => console.error("Error adding employee:", error));
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="domaine"
          placeholder="Domaine"
          className="w-full border p-2 rounded"
          value={form.domaine}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          className="w-full border p-2 rounded"
          value={form.salary}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="hire_date"
          className="w-full border p-2 rounded"
          value={form.hire_date}
          onChange={handleChange}
          required
        />
        <button type="submit" className="w-full bg-[#c9ab8d] text-white p-2 rounded">
          Add Employee
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;
