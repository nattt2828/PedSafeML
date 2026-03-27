import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Demo credentials
const VALID_USERS = [
  { username: "admin", password: "pedsafe123", role: "Administrator" },
  { username: "operator", password: "operator123", role: "Operator" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // This state stores the currently logged-in user.

  const login = (username, password) => {
    const found = VALID_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser({ username: found.username, role: found.role });
      return { success: true };
    }
    return { success: false, error: "Invalid username or password." };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}