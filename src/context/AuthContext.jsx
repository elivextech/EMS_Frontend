import { createContext, useContext, useState } from 'react';
import { loginUser, logoutUser } from '../services/user.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ems_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const resp = await loginUser(email, password);
      // Support nested ApiResponse structure: resp.data.accessToken and resp.data.user
      const token = resp?.data?.accessToken || resp?.accessToken || resp?.token;
      const userData = resp?.data?.user || resp?.user || resp?.data || { email };
      
      if (token) {
        localStorage.setItem('ems_token', token);
      }
      localStorage.setItem('ems_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch {
      // Always clear local state even if the API call fails
      localStorage.removeItem('ems_token');
      localStorage.removeItem('ems_user');
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
