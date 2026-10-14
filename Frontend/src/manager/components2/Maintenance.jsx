import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    axios
      .get("http://localhost:3000/@manager/maintenance")
      .then((response) => setRequests(response.data))
      .catch((error) =>
        console.error("Error fetching maintenance requests:", error)
      );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      axios
        .delete(`http://localhost:3000/@manager/maintenance/${id}`)
        .then(() => fetchRequests())
        .catch((error) => console.error("Delete error:", error));
    }
  };

  const openEditModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const handleEditSubmit = () => {
    if (!selectedRequest) return;

    axios
      .put(
        `http://localhost:3000/@manager/maintenance/${selectedRequest.id}`,
        selectedRequest
      )
      .then(() => {
        fetchRequests();
        closeModal();
      })
      .catch((error) => console.error("Update error:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedRequest((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "status" && value === "completed"
        ? { completion_date: new Date() }
        : {}),
    }));
  };

  return (
    <div className="container">
      <h2 className="my-4">Maintenance Requests</h2>

      <button
        onClick={() => navigate("/new-request")}
        style={{
          padding: "10px 15px",
          backgroundColor: "#c9ab8d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        + New Request
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Property ID</th>
            <th>Description</th>
            <th>Requested By</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Request Date</th>
            <th>Completion Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.property_id}</td>
              <td>{request.description}</td>
              <td>{request.requested_by}</td>
              <td>{request.assigned_to}</td>
              <td>{request.status}</td>
              <td>{new Date(request.request_date).toLocaleDateString()}</td>
              <td>
                {request.completion_date
                  ? new Date(request.completion_date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                <button
                  onClick={() => openEditModal(request)}
                  className="btn btn-sm btn-warning mx-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(request.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Maintenance Request"
        style={{
          content: {
            maxWidth: "500px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
          },
        }}
      >
        <h2 className="text-xl font-bold mb-4">Edit Maintenance Request</h2>
        {selectedRequest && (
          <div className="space-y-3">
            <input
              type="text"
              name="description"
              value={selectedRequest.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2"
            />
            <input
              type="text"
              name="assigned_to"
              value={selectedRequest.assigned_to}
              onChange={handleChange}
              placeholder="Assigned To"
              className="w-full border p-2"
            />
            <select
              name="status"
              value={selectedRequest.status}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={handleEditSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Maintenance;
