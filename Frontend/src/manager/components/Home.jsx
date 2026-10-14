import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left Section */}
      <div className="md:w-1/2 flex flex-col justify-center px-10 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/featured/?office,work)' }}>
        <h1 className="text-4xl font-bold text-white">DESK BOOKING SOFTWARE</h1>
        <p className="text-lg text-white mt-4">Single-Solution Desk Reservation Tool for Enterprises</p>
        <ul className="mt-4 text-white">
          <li><strong>• Reserve</strong> a Desk in Real-Time</li>
          <li><strong>• Manage</strong> Conference Room Reservations</li>
          <li><strong>• Visualize</strong> Real-Time Floor Plans</li>
          <li><strong>• Analyze</strong> Workplace Trends</li>
        </ul>
      </div>
      
      {/* Right Section - Form */}
      <div className="md:w-1/2 flex items-center justify-center p-10 bg-white shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Request a Demo Today!</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name*" className="p-2 border rounded w-full" required />
              <input type="text" placeholder="Last Name*" className="p-2 border rounded w-full" required />
            </div>
            <input type="email" placeholder="Company Email*" className="p-2 border rounded w-full" required />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Company*" className="p-2 border rounded w-full" required />
              <input type="text" placeholder="Job Title*" className="p-2 border rounded w-full" required />
            </div>
            <div className="flex justify-center mt-4">
              <div className="bg-gray-200 p-4 rounded text-center w-full">protected by reCAPTCHA</div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">REQUEST DEMO</button>
          </form>
        </div>
      </div>
    </div>
  );
};



export default Home;
