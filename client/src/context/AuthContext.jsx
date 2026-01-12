import { createContext, useEffect, useState } from "react";
import { api } from "../utils/api.js";

const AuthContext = createContext(undefined);

export { AuthContext };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const addUserToAuthContext = (userData) => {
    setUser(userData);
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.checkAuth();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch {
      console.error("Not authenticated");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (signInCredentials) => {
    try {
      const response = await api.signIn(signInCredentials);
      if (response.success && response.data) {
        setUser(response.data);
      }
      return response;
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    }
  };

  const signUp = async (signUpCredentials) => {
    try {
      const response = await api.signUp(signUpCredentials);
      if (response.success && response.data) {
        setUser(response.data);
      }
      return response;
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await api.signOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out failed:", error);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    addUserToAuthContext,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
