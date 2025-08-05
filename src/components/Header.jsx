import React from "react";
import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="w-full bg-gray-800 border-b-2 border-gray-700 py-5 px-8 flex items-center justify-between rounded-b-3xl shadow-xl shadow-black/30 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Link to="/">
          <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight drop-shadow font-['Montserrat','Segoe UI','Arial',sans-serif']">
            Notes
          </h1>
        </Link>
      </div>
    </header>
  );
}

export default Header;
