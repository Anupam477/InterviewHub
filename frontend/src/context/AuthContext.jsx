import React, { createContext, useState, useEffect } from 'react';
import API from '../api/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Try again.'
      };
    }
  };

  const register = async (name, email, password, securityQuestion, securityAnswer) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password, securityQuestion, securityAnswer });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try again.'
      };
    }
  };

  const getSecurityQuestion = async (email) => {
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      return { success: true, securityQuestion: data.securityQuestion };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to retrieve recovery details.'
      };
    }
  };

  const resetPassword = async (email, securityAnswer, newPassword) => {
    try {
      const { data } = await API.post('/auth/reset-password', { email, securityAnswer, newPassword });
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password. Check answer and try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getSecurityQuestion, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
