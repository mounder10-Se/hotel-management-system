import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewRequest = () => {
  const [propertyId, setPropertyId] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Pending");
  const [requestedBy, setRequestedBy] = useState("");  
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/maintenance", {
        property_id: propertyId,
        description,
        requested_by: requestedBy,  
        assigned_to: assignedTo,
        status,
      });
      alert(response.data.message);  
      navigate("/maintenance");
    } catch (error) {
      alert("Error submitting maintenance request");
    }
  };

  return (
    <div className="p-5">
      <h3 className="text-xl font-bold mb-4">New Maintenance Request</h3>

      <label className="block mb-2 font-semibold">Property ID:</label>
      <input
        type="text"
        placeholder="Enter Property ID"
        value={propertyId}
        onChange={(e) => setPropertyId(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />

      <label className="block mb-2 font-semibold">Description:</label>
      <textarea
        placeholder="Describe the issue"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />

      <label className="block mb-2 font-semibold">Requested By (Employee ID):</label>
      <input
        type="text"
        placeholder="Enter Employee ID"
        value={requestedBy}
        onChange={(e) => setRequestedBy(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />

      <label className="block mb-2 font-semibold">Assign To:</label>
      <input
        type="text"
        placeholder="Employee ID or Name"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />

      <label className="block mb-2 font-semibold">Status:</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit Request
      </button>
    </div>
  );
};

export default NewRequest;
