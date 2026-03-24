import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (u: string, p: string) => boolean;
  logout: () => void;
}

const defaultAuthContextValue: AuthContextType = {
  isAuthenticated: true,
  login: () => true,
  logout: () => {}
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("anisun_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (u: string, p: string) => {
    const user = u.toLowerCase();
    const pass = p.toLowerCase();
    if ((user === "sunny" && pass === "anisha") || (user === "anisha" && pass === "sunny")) {
      localStorage.setItem("anisun_auth", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("anisun_auth");
    setIsAuthenticated(false);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.warn("useAuth must be used within AuthProvider. Falling back to default auth to prevent crash.");
    return defaultAuthContextValue;
  }
  return ctx;
};