import React, { useState } from "react";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState("");

  const addAppointment = () => {
    if (newAppointment.trim() !== "") {
      setAppointments([...appointments, newAppointment]);
      setNewAppointment("");
    }
  };

  return (
    <div className="container">
      <h2>Appointments</h2>
      <input
        type="text"
        placeholder="Enter appointment"
        value={newAppointment}
        onChange={(e) => setNewAppointment(e.target.value)}
      />
      <button onClick={addAppointment}>Add</button>
      <ul>
        {appointments.map((appt, index) => (
          <li key={index}>{appt}</li>
        ))}
      </ul>
    </div>
  );
};

export default Appointment;
