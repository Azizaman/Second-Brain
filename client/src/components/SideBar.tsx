import { NavLink } from "react-router-dom";
import { useState } from "react";

// Import icons from the assets folder
import documentsIcon from '@/assets/document.png';
import notesIcon from '@/assets/sticky-note.png';
import searchIcon from '@/assets/search.png';

export default function Leftbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-sidebar-primary text-sidebar-primary-foreground rounded focus:outline-none shadow-lg"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <div
        className={` fixed inset-0 top-0 left-0 py-10 h-screen w-52 bg-gray-400 dark:bg-sidebar text-black dark:text-sidebar-foreground transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        <div className="fixed flex flex-col space-y-4 px-4 w-full text-left text-white dark:text-white">
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `flex items-center p-4 rounded transition-all duration-200 space-x-2 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-gray-500"
              }`
            }
          >
            {/* Document Icon */}
            <img src={documentsIcon} alt="Documents" className="w-5 h-5 bg-gray-400" />
            <span>Documents</span>
          </NavLink>
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `flex items-center p-4 rounded transition-all duration-200 space-x-2 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-gray-500"
              }`
            }
          >
            {/* Notes Icon */}
            <img src={notesIcon} alt="Notes" className="w-5 h-5 bg-gray-400" />
            <span>Notes</span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center p-4 rounded transition-all duration-200 space-x-2 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-gray-500"
              }`
            }
          >
            {/* Search Icon */}
            <img src={searchIcon} alt="Search" className="w-5 h-5 bg-gray-400" />
            <span>Search</span>
          </NavLink>
        </div>
      </div>

      {/* Background Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
