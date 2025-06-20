import React, { useEffect, useState } from 'react'
import logo from "../images/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar';
import { MdLightMode, MdDarkMode, MdLogout, MdHome, MdInfo, MdContactMail, MdMiscellaneousServices } from "react-icons/md";
import { BsGridFill, BsList } from "react-icons/bs";
import { BiChevronDown, BiUser } from "react-icons/bi";
import { HiOutlineCode } from "react-icons/hi";
import { api_base_url } from '../helper';

const Navbar = ({ isGridLayout, setIsGridLayout }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(api_base_url + "/getUserDetails", {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId")
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          setData(result.user);
        } else {
          setError(result.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    document.body.classList.toggle("lightMode");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const navLinks = [
    { name: 'Home', icon: MdHome, href: '/' },
    { name: 'About', icon: MdInfo, href: '/about' },
    { name: 'Contact', icon: MdContactMail, href: '/contact' },
    { name: 'Services', icon: MdMiscellaneousServices, href: '/services' },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <HiOutlineCode className="text-xl text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  CodeIDE
                </h1>
                <p className="text-xs text-gray-400">Web Development Studio</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {/* <div className="items-center hidden space-x-1 md:flex">
            {navLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  to={link.href}
                  className="flex items-center px-4 py-2 space-x-2 text-gray-300 transition-all duration-200 rounded-lg hover:text-white hover:bg-gray-800"
                >
                  <IconComponent className="text-lg" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </div> */}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 transition-all duration-200 rounded-lg hover:text-white hover:bg-gray-800"
              title={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLightMode ? <MdDarkMode className="text-xl" /> : <MdLightMode className="text-xl" />}
            </button>

            {/* Layout Toggle */}
            {typeof isGridLayout !== 'undefined' && (
              <button
                onClick={() => setIsGridLayout(!isGridLayout)}
                className="p-2 text-gray-400 transition-all duration-200 rounded-lg hover:text-white hover:bg-gray-800"
                title={isGridLayout ? "Switch to list view" : "Switch to grid view"}
              >
                {isGridLayout ? <BsList className="text-xl" /> : <BsGridFill className="text-xl" />}
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-all duration-200 bg-red-600 rounded-lg hover:bg-red-700"
            >
              <MdLogout className="text-lg" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* User Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={toggleDropdown}
                className="flex items-center p-2 space-x-3 transition-all duration-200 rounded-lg hover:bg-gray-800"
              >
                {loading ? (
                  <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
                ) : (
                  <Avatar
                    name={data ? data.name : "User"}
                    size="40"
                    round="50%"
                    className="cursor-pointer"
                  />
                )}
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium text-white">
                    {data ? data.name : "Loading..."}
                  </p>
                  <p className="text-xs text-gray-400">
                    @{data ? data.username : ""}
                  </p>
                </div>
                <BiChevronDown
                  className={`text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 z-50 w-64 mt-2 bg-gray-800 border border-gray-700 shadow-2xl top-full rounded-xl">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        name={data ? data.name : "User"}
                        size="48"
                        round="50%"
                      />
                      <div>
                        <p className="font-semibold text-white">{data ? data.name : "Loading..."}</p>
                        <p className="text-sm text-gray-400">@{data ? data.username : ""}</p>
                        <p className="text-xs text-gray-500">{data ? data.email : ""}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={toggleTheme}
                      className="flex items-center w-full px-3 py-2 space-x-3 text-gray-300 transition-all duration-200 rounded-lg hover:text-white hover:bg-gray-700"
                    >
                      {isLightMode ? <MdDarkMode className="text-lg" /> : <MdLightMode className="text-lg" />}
                      <span>{isLightMode ? "Dark Mode" : "Light Mode"}</span>
                    </button>

                    {typeof isGridLayout !== 'undefined' && (
                      <button
                        onClick={() => {
                          setIsGridLayout(!isGridLayout);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 space-x-3 text-gray-300 transition-all duration-200 rounded-lg hover:text-white hover:bg-gray-700"
                      >
                        {isGridLayout ? <BsList className="text-lg" /> : <BsGridFill className="text-lg" />}
                        <span>{isGridLayout ? "List Layout" : "Grid Layout"}</span>
                      </button>
                    )}

                    <hr className="my-2 border-gray-700" />

                    <button
                      onClick={logout}
                      className="flex items-center w-full px-3 py-2 space-x-3 text-red-400 transition-all duration-200 rounded-lg hover:text-red-300 hover:bg-red-500/10"
                    >
                      <MdLogout className="text-lg" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;