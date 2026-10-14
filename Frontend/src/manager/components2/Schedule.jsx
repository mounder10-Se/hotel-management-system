import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const roleColors = {
  Housekeeper: "#4CAF50",
  Receptionist: "#2196F3",
  Technician: "#FF9800",
  Other: "#9C27B0",
};

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All");

  useEffect(() => {
    axios.get("http://localhost:3000/@manager/schedule").then((res) => {
      const formatted = res.data.map((ev) => ({
        id: ev.id,
        title: `${ev.employee_name} - ${ev.role}`,
        start: ev.start,
        end: ev.end,
        role: ev.role,
        backgroundColor: roleColors[ev.role] || roleColors.Other,
      }));
      setEvents(formatted);
    });
  }, []);

  const handleDateSelect = async (selectInfo) => {
    const input = prompt(
      "Enter names, role, and time (e.g. Alice,Bob - Housekeeper - 08:00 - 23:00):"
    );
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (input && input.split("-").length === 4) {
      const [namesStr, roleStr, startTimeStr, endTimeStr] = input
        .split("-")
        .map((s) => s.trim());
      const names = namesStr.split(",").map((n) => n.trim());
      const role = roleStr;

      for (let name of names) {
        const startDateTime = `${selectInfo.startStr.split("T")[0]}T${startTimeStr}`;
        const endDateTime = `${selectInfo.startStr.split("T")[0]}T${endTimeStr}`;

        const newEvent = {
          title: `${name} - ${role}`,
          start: startDateTime,
          end: endDateTime,
          backgroundColor: roleColors[role] || roleColors.Other,
        };

        try {
          await axios.post("http://localhost:3000/@manager/schedule", {
            employee_name: name,
            role,
            start: newEvent.start,
            end: newEvent.end,
          });

          setEvents((prev) => [
            ...prev,
            { ...newEvent, id: Date.now() + Math.random(), role },
          ]);
        } catch (err) {
          console.error("Failed to save schedule:", err);
        }
      }
    } else {
      alert("Invalid format. Use: Alice,Bob - Role - 08:00 - 23:00");
    }
  };

  const filteredEvents =
    selectedRole === "All"
      ? events
      : events.filter((event) => event.role === selectedRole);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">Manage Employees Schedule</h3>

      <div className="mb-4">
        <label className="font-semibold mr-2">Filter by Role:</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Housekeeper">Housekeeper</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Technician">Technician</option>
        </select>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        selectMirror={true}
        select={handleDateSelect}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={filteredEvents}
      />
    </div>
  );
};

export default Schedule;
