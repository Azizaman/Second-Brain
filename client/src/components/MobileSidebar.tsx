// components/MobileSidebar.tsx
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const MobileSidebar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Topbar - visible only on mobile */}
      <div className="lg:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow-md">
        <button onClick={() => setOpen(true)}>
          <Menu size={28} />
        </button>
        <span className="text-lg font-semibold">My App</span>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-3">
          <a
            href="/documents"
            className="block text-white hover:text-blue-400"
            onClick={() => setOpen(false)}
          >
            Documents
          </a>
          <a
            href="/notes"
            className="block text-white hover:text-blue-400"
            onClick={() => setOpen(false)}
          >
            Notes
          </a>
          {/* Add more nav links as needed */}
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;
