
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const router = useRouter();

  // Save the token and set up auto-logout based on token expiry
  const saveToken = (token) => {
    sessionStorage.setItem("authToken", token);
    setToken(token);
    setAutoLogout(token);
  };

  // Function to set auto-logout based on token expiry
  const setAutoLogout = (token) => {
    const decodedToken = jwtDecode(token);
    const timeUntilExpiry = decodedToken.exp * 1000 - Date.now();

    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        alert("Session expired. Please log in again.");
        logout();
      }, timeUntilExpiry - 60000); // Log out 1 minute before token expiry
    }
  };

  // Logout function to clear token and redirect to login
  const logout = () => {
    sessionStorage.removeItem("authToken");
    setToken(null);
    router.push("/login"); // Redirect to login page
  };

  // Check for existing token in session storage on initial load
  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      setAutoLogout(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ saveToken, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
