import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:8080/api";
const TOKEN_KEY = "admin_jwt";

const authClient = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyToken = useCallback((jwt) => {
    if (jwt) {
      axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
      authClient.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
      delete authClient.defaults.headers.common.Authorization;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    applyToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, [applyToken]);

  const validateAdminResponse = (data) => {
    const username = data?.username?.toLowerCase();
    if (username !== "admin") {
      throw new Error("Only the admin account can access this dashboard.");
    }
  };

  const login = async (emailOrUsername, password) => {
    if (emailOrUsername.trim().toLowerCase() !== "admin") {
      throw new Error("Only the admin account can access this dashboard.");
    }
    const response = await authClient.post("/auth/login", {
      emailOrUsername,
      password,
    });
    validateAdminResponse(response.data);
    const jwt = response.data.token;
    setToken(jwt);
    setUser(response.data);
    localStorage.setItem(TOKEN_KEY, jwt);
    applyToken(jwt);
    return response.data;
  };

  const hydrate = useCallback(
    async (stored) => {
      if (!stored) {
        setLoading(false);
        return;
      }
      applyToken(stored);
      try {
        const response = await authClient.get("/auth/me");
        validateAdminResponse(response.data);
        setToken(stored);
        setUser(response.data);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    },
    [applyToken, logout]
  );

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    hydrate(stored);
  }, [hydrate]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
