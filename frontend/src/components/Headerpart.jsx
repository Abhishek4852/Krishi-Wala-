import { useState, useEffect } from "react";
import { FaGlobe, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { X, Menu, Home , LogOut } from "lucide-react";
import { a } from "framer-motion/client";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function Headerpart() {
 
  // const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userData = user;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <nav className="bg-gradient-to-br from-green-600 to-green-800 border-b-4 fixed border-green-700 text-green-800 shadow-md p-4 w-full top-0 left-0 z-50 ">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo & Menu */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden  text-white text-2xl">
            {menuOpen ? <FaTimes  /> : <FaBars className="sm:hidden" />}
          </button>
          <h1 className="font-bold text-white text-4xl sm:text-5xl">🌾 KrishiWala</h1>
        </div>
        <div 
  className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-xs cursor-pointer hover:text-yellow-500"
  onClick={() => navigate("/ProfilePage")}
>
  <FaUser className="text-white text-2xl md:hidden " />
  
</div>
        {/* Center: Nav links (Desktop) */}
        <div className="hidden md:flex space-x-6 font-semibold text-white ml-5">

          {/* <a href="/" className="hover:text-yellow-600 transition duration-200">Home</a> */}
          {/* <a href="#" className="hover:text-yellow-600 transition duration-200">About Us</a> */}
          {/* <a href="#" className="hover:text-yellow-600 transition duration-200">Services</a>
          <a href="#" className="hover:text-yellow-600 transition duration-200">Contact Us</a> */}
        </div>
          
        {/* Right: Buttons or User Name */}
        <div className="hidden md:flex items-center space-x-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-white hover:text-green-900  hover:bg-green-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
        >
          <Home size={20} />
          <span className="font-bold">Home</span>
        </button>
        {userData ? (
  <div 
  className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-xs cursor-pointer hover:text-yellow-500"
  onClick={() => navigate("/ProfilePage")}
>
  <FaUser className="text-white text-2xl mr-2 shrink-0" />
  <p className="font-semibold text-white text-lg truncate">{userData.name}</p>
</div>
) :( <>
              <button
                className="px-4 py-2 bg-green-800 border border-green-600 text-white font-semibold rounded-full hover:bg-green-200 transition"
                onClick={() => navigate("/Register")}
              >
                Register
              </button>
              <button
                className="px-4 py-2 bg-green-800 border border-green-600 text-white font-semibold rounded-full hover:bg-green-200 transition"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-18 left-0 h-full bg-green-800 w-64 shadow-lg transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:hidden z-50`}>
        <button onClick={() => setMenuOpen(false)} className="text-white text-2xl absolute top-4 right-4">
          <FaTimes className="absolute top-4 right-4 bg-red-500 text-white rounded-md" />
        </button>
        
        <div className="flex flex-col items-start px-6 py-12 space-y-6 text-white">
        <a href="https://krishi-wala-fkfg.vercel.app/" className="flex items-center gap-3 hover:text-yellow-300 transition">
            <Home size={24} />
            <span className="font-bold">Home</span>
          </a>
          {/* <a href="/" className="hover:text-yellow-300 text-lg">About Us</a> */}
          {/* <a href="#" className="hover:text-yellow-300 text-lg">Services</a>
          <a href="#" className="hover:text-yellow-300 text-lg">Contact Us</a> */}

          {userData ? (
            
            <div>
            <div 
  className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-xs cursor-pointer hover:text-yellow-500"
  onClick={() => navigate("/ProfilePage")}
>
  <FaUser className="text-white text-2xl mr-2 shrink-0" />
  <p className="font-semibold text-white text-lg truncate">{userData.name}</p>
</div>
         <button
            onClick={handleLogout}
            className="flex items-center mt-5 gap-3 text-red-400 hover:text-red-300 transition"
          >
           
            <LogOut size={24} />
            <span className="font-bold">Logout</span>
          </button>
         </div>
          ) : (
            <>
              <button
                className="w-full px-4 py-2 bg-green-900 text-white font-bold rounded-full hover:bg-yellow-100"
                onClick={() => {
                  navigate("/Register");
                  setMenuOpen(false);
                }}
              >
                Register
              </button>
              <button
                className="w-full px-4 py-2 bg-green-900 text-white font-bold rounded-full hover:bg-yellow-100"
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}