import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Home, Wrench, Calendar, DollarSign, ClipboardList, BarChart2, LogOut } from "lucide-react";

function PropManageSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/logout", {}, { withCredentials: true })
      .then(() => navigate("/login"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="bg-[#c9ab8d] text-white h-screen fixed left-0 top-0 bottom-0 w-64 p-4 font-[Poppins] flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold mb-6">Panneau De Manager</div>
        <div className="space-y-3">
          <Link to="/propmanager/overview" className="text-white flex items-center gap-2 p-2 rounded hover:bg-[#b49476]">
            <Home size={18} /> Tableau de bord
          </Link>
          <Link to="/propmanager/maintenance" className="text-white flex items-center gap-2 p-2 rounded hover:bg-[#b49476]">
            <Wrench size={18} /> Maintenance
          </Link>
          <Link to="/propmanager/schedule" className="text-white flex items-center gap-2 p-2 rounded hover:bg-[#b49476]">
            <Calendar size={18} /> Planning
          </Link>
          <Link to="/propmanager/salary" className="text-white flex items-center gap-2 p-2 rounded hover:bg-[#b49476]">
            <DollarSign size={18} /> Salaire
          </Link>
          <Link to="/propmanager/appointage" className="text-white flex items-center gap-2 p-2 rounded hover:bg-[#b49476]">
            <ClipboardList size={18} /> Appointage
          </Link>
          <Link to="/propmanager/budget" className="text-white flex items-center gap-2 p-2 rounded hover:bg-[#b49476]">
            <BarChart2 size={18} /> Budget
          </Link>
        </div>
      </div>
      <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700">
        <LogOut size={18} /> Déconnexion
      </button>
    </div>
  );
}

export default PropManageSidebar;
