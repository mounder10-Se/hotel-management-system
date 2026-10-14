import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateSalary = () => {
  const { id } = useParams(); 
  const [salary, setSalary] = useState("");
  const [status, setStatus] = useState("Pending"); 

  const handleUpdate = async () => {
    try {
      const response = await axios.put("http://localhost:3000/update-salary", { id, salary, status });
      alert(response.data.Message);
    } catch (error) {
      alert("Error updating salary or status");
    }
  };

  return (
    <div className="p-5">
      <h3 className="text-xl font-bold mb-4">Update Employee Salary & Status</h3>

      <label className="block mb-2 font-semibold">New Salary:</label>
      <input
        type="text"
        placeholder="Enter New Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />

      <label className="block mb-2 font-semibold">Status:</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      >
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
      </select>

      <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">
        Update
      </button>
    </div>
  );
};

export default UpdateSalary;
