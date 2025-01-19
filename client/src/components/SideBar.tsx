import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

// Import icons from the assets folder

import docs from '@/assets/docs.png'
import { ModeToggle } from "./mode-toggle";
import LoginButton from "./LoginButton";
import notes from '@/assets/notes.png'
import searchicon from '@/assets/search-icon.png';

export default function Leftbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.className = darkTheme ? "light" : "dark"; // Apply theme
  };

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
        className={`fixed inset-0 top-0 left-0 py-10 h-screen w-52 bg-gray-400 dark:bg-sidebar text-black dark:text-sidebar-foreground transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block overflow-y-auto`}
      >
        {/* Sidebar Header */}
        <div className="text-white font-bold text-2xl items-center ml-6 py-4 mb-4 cursor-pointer hover:text-gray-500  ">
          <a
            onClick={() => {
              navigate('/');
            }}
          >
            Second Brain
          </a>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col space-y-4 px-4 w-full text-left text-white dark:text-white">
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
            <img src={docs} alt="Documents" className="w-6 h-6 " />
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
            <img src={notes} alt="Notes" className="w-5 h-5 " />
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
            <img src={searchicon} alt="Search" className="w-5 h-5 " />
            <span>Search</span>
          </NavLink>
        </div>

        {/* Bottom Section */}
        <div className="mt-40 px-4 pb-4 py-6 ">
          <div className="space-y-5 items-center ml-12">
            
          {/* Theme Toggle Button */}
          <ModeToggle/>

          </div>
          <div className="space-y-9 mt-6 items-center ml-10 ">
            {/* Login Button */}
          <LoginButton/>
            
            
          </div>
          

          
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
