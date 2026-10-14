import React from "react";

function Header() {
  return (
    <div className="bg-white text-gray-800 p-4 shadow flex justify-between items-center font-[Poppins] ml-64">
      <h1 className="text-2xl font-semibold">Gestion de l'établissement</h1>
      <div className="text-lg font-medium">👤 Manager</div>
    </div>
  );
}

export default Header;
