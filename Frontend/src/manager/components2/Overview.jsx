import React from "react";

function Overview () {
    return (
      <div className="p-5">

        <h3 className="text-xl font-bold mb-4">Proprety Details</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500 text-white p-4 rounded-lg flex items-center">
            <i className="fas fa-users mr-2"></i>
            <span>Total Rooms</span>
            <span className="ml-auto">10</span>
          </div>

          <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
            <i className="fas fa-dollar-sign mr-2"></i>
            <span>Rooms Taken</span>
            <span className="ml-auto">6</span>
          </div>

          <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
            <i className="fas fa-dollar-sign mr-2"></i>
            <span>Rooms Available</span>
            <span className="ml-auto">4</span>
          </div>
          
        </div>

        <h3 className="text-xl font-bold mb-4">Employees Details</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500 text-white p-4 rounded-lg flex items-center">
            <i className="fas fa-users mr-2"></i>
            <span>Total Employees</span>
            <span className="ml-auto">5</span>
          </div>

          <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
            <i className="fas fa-dollar-sign mr-2"></i>
            <span>Monthly Pay</span>
            <span className="ml-auto">$2500</span>
          </div>
          
        </div>
  
        <h3 className="text-xl font-bold mb-4">Leave Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-teal-500 text-white p-4 rounded-lg flex items-center">
            <i className="fas fa-file-alt mr-2"></i>
            <span>Leave Applied</span>
            <span className="ml-auto">2</span>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            <span>Leave Approved</span>
            <span className="ml-auto">2</span>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg flex items-center">
            <i className="fas fa-hourglass-half mr-2"></i>
            <span>Leave Pending</span>
            <span className="ml-auto">1</span>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
            <i className="fas fa-times-circle mr-2"></i>
            <span>Leave Rejected</span>
            <span className="ml-auto">2</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default Overview;
  