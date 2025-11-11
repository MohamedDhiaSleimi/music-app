import { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthResponse } from "../types/auth.types";
import type { ReactNode } from "react";
import { authApi } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser({
            userId: userData.userId,
            email: userData.email,
            username: userData.username,
            profileImageUrl: userData.profileImageUrl,
          });
        } catch (error) {
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (data: AuthResponse) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser({
      userId: data.userId,
      email: data.email,
      username: data.username,
      profileImageUrl: data.profileImageUrl,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
