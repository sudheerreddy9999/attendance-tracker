"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserToken] = useState(null);
  const [userType, setUserType] = useState(null);
  const router = useRouter();

  // Save token to sessionStorage and set auto logout
  const saveToken = (newToken) => {
    try {
      sessionStorage.setItem("authToken", newToken);
      setToken(newToken);
      setAutoLogout(newToken);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  // Set auto logout based on token expiration
  const setAutoLogout = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const timeUntilExpiry = decodedToken.exp * 1000 - Date.now();
      if (timeUntilExpiry > 0) {
        setTimeout(() => {
          alert("Session expired. Please log in again.");
          logout();
        }, timeUntilExpiry - 60000); // alert before token expires
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      logout(); // logout if there's an issue decoding the token
    }
  };

  // Logout and redirect to login
  const logout = () => {
    try {
      sessionStorage.removeItem("authToken");
      setToken(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      setAutoLogout(storedToken);
      
      try {
        const decodedToken = jwtDecode(storedToken);
        setUserToken(decodedToken.userId)
        setUserType(decodedToken.userType)
        if (decodedToken.userType === "teacher") {
          router.push("/teacher");
        } else if(decodedToken.userType === "user") {
          router.push("/students");
        }else {
          router.push("/auth/login");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ saveToken, token, logout, loading,userId,userType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
