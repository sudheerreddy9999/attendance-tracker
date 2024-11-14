"use client";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode";
import Loader from "./loader";

export const Navigation = () => {
  const [userName, setUserName] = useState("sudheer");
  const [typeOfUser, setTypeOfUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const { token, loading, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    console.log(token);
    if (token) {
      try {
        console.log("Hello")
        const decodedToken = jwtDecode(token);
        console.log(decodedToken," Hello 123123")
        const extractedUserName =decodedToken.userName
        setUserName(extractedUserName);
        setTypeOfUser(decodedToken.userType);
      } catch (err) {
        console.log(err)
        console.error("Error decoding token:", err.message);
      }
    }
  }, []);

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogout = ()=>{
    setShowLogout(false);
    logout();
  }

  return (
    <nav className="bg-gray-800 w-full text-white p-4 px-10">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">
          <img
            className="w-10 h-10 rounded-lg"
            src="https://ideogram.ai/assets/progressive-image/balanced/response/9PLhbygCSuiR_bawgj6gKg"
            alt="Logo"
          />
        </div>
        <div className="ml-auto relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setShowLogout((prev) => !prev)}
          >
            <img
              className="w-10 h-10 rounded-full border border-gray-300"
              src={
                typeOfUser === "teacher"
                  ? "https://images-platform.99static.com//aOgPj9qGuoh-2RfFUTokPRpKPbA=/31x132:739x840/fit-in/500x500/99designs-contests-attachments/94/94929/attachment_94929786"
                  : "https://static.vecteezy.com/system/resources/previews/048/115/778/non_2x/teacher-mascot-logo-png.png"
              }
              alt="User"
            />
          </div>
          {showLogout && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-10">
              <div className="px-4 py-2 font-semibold border-b border-gray-200">
                {userName}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {loading && <Loader />}
    </nav>
  );
};
