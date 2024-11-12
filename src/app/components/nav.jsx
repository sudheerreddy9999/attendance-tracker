"use client";
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

export const Navigation = () => {
  const [userName, setUserName] = useState(null);
  const [typeOfUser, setTypeOfUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const pathName = usePathname();
  const { token, loading, logout } = useAuth();

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const extractedUserName = decodedToken.email.split('@')[0];
        setUserName(extractedUserName);
        setTypeOfUser(decodedToken.userType);
      } catch (err) {
        console.error("Error decoding token:", err.message);
      }
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-gray-800 w-full text-white p-4 px-10">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">
          <img
            className="w-10 h-10 rounded-lg"
            src="https://ideogram.ai/assets/progressive-image/balanced/response/9PLhbygCSuiR_bawgj6gKg"
            alt="Logo"
          />
        </div>

        {/* Navigation Items */}
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathName === item.href
                    ? 'bg-indigo-600 text-white'  // Active state
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {/* User Profile and Logout Button */}
        <div
          className="ml-auto relative"
          onMouseEnter={() => setShowLogout(true)}
          onMouseLeave={() => setShowLogout(false)}
        >
          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              className="w-10 h-10 rounded-full"
              src={
                typeOfUser === "teacher"
                  ? "https://ideogram.ai/assets/progressive-image/balanced/response/ltcMB6U_To-wbc9q-xx7MQ"
                  : "https://ideogram.ai/assets/progressive-image/balanced/response/9PLhbygCSuiR_bawgj6gKg"
              }
              alt="User"
            />
            <div className="text-xs font-bold">{userName}</div>
          </div>

          {/* Logout Button */}
          {showLogout && (
            <button
              onClick={logout}
              className="absolute left-0 mt-2 w-full bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 z-10"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
