import React from "react";
import PropManageSidebar from "../components2/PropManageSidebar";
import { Outlet } from "react-router-dom";
import Header from "../components2/Header";

function PropManager() {
  return (
    <div className="h-screen flex flex-col">
      <Header style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} />
      <div className="flex flex-1">
        <PropManageSidebar />
        <div
          className="flex-1 p-10 ml-64"
          style={{ backgroundColor: 'oklch(95.4% 0.038 75.164)' }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default PropManager;
