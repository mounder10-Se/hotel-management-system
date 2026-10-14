import React, { useState } from "react";

const Schedule = () => {
  const [schedule, setSchedule] = useState([
    { id: 1, employee: "John Doe", shift: "Morning" },
    { id: 2, employee: "Jane Smith", shift: "Afternoon" },
  ]);

  const [newEmployee, setNewEmployee] = useState("");
  const [newShift, setNewShift] = useState("Morning");

  const addSchedule = () => {
    if (newEmployee.trim() === "") return;
    setSchedule([...schedule, { id: Date.now(), employee: newEmployee, shift: newShift }]);
    setNewEmployee("");
    setNewShift("Morning");
  };

  return (
    <div className="container">
      <h1>Modify Work Schedule</h1>
      <p>Here you can update and manage employee work schedules.</p>
      
      <div className="schedule-form">
        <input
          type="text"
          placeholder="Employee Name"
          value={newEmployee}
          onChange={(e) => setNewEmployee(e.target.value)}
        />
        <select value={newShift} onChange={(e) => setNewShift(e.target.value)}>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Night">Night</option>
        </select>
        <button onClick={addSchedule}>Add Schedule</button>
      </div>
      
      <ul>
        {schedule.map((item) => (
          <li key={item.id}>{item.employee} - {item.shift}</li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;