
import React, { createContext, useState, useContext, useEffect } from 'react';

export type UserRole = 'student' | 'faculty';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', name: 'Student Demo', email: 'student@example.com', role: 'student' },
  { id: '2', name: 'Faculty Demo', email: 'faculty@example.com', role: 'faculty' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would validate credentials against a backend
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {  // Mock password check
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return;
    }
    
    throw new Error('Invalid credentials');
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    // In a real app, this would create a user in your database
    const newId = (mockUsers.length + 1).toString();
    const newUser = { id: newId, name, email, role };
    
    // Add to mock users
    mockUsers.push(newUser);
    
    // Auto login
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
