import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async (authToken) => {
    if (!authToken) {
      setLoading(false);
      return false;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/token_validation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authToken }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser({
          user_id: data.user_id,
          name: data.name,
          mobile: data.mobile,
          email: data.email,
          is_admin: data.is_admin || false
        });
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    if (userData) {
      setUser(userData);
    } else if (newToken) {
      verifyToken(newToken);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export default AuthContext;
