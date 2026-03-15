import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user database
const MOCK_USERS = [
  { id: "1", name: "Nguyen Van A", email: "customer@alefarms.com", password: "password123", role: "customer" as UserRole, phone: "0901234567" },
  { id: "2", name: "Admin ALE", email: "admin@alefarms.com", password: "admin123", role: "admin" as UserRole, phone: "0987654321" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ale_farms_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("ale_farms_user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      const userData: User = { id: found.id, name: found.name, email: found.email, role: found.role, phone: found.phone };
      setUser(userData);
      localStorage.setItem("ale_farms_user", JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: "Invalid email or password. Try customer@alefarms.com / password123" };
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 800));
    if (MOCK_USERS.find((u) => u.email === email)) {
      return { success: false, error: "Email already registered." };
    }
    const newUser: User = { id: String(Date.now()), name, email, role: "customer", phone };
    setUser(newUser);
    localStorage.setItem("ale_farms_user", JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ale_farms_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
