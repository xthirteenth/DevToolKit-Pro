import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// API URL
const API_URL = "http://localhost:5000/api";

// Создаем контекст
export const AuthContext = createContext();

// Хук для использования контекста
export const useAuth = () => useContext(AuthContext);

// Провайдер контекста
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Настройка axios с токеном
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
      localStorage.removeItem("token");
    }
  };

  // Загрузка пользователя при наличии токена
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get(`${API_URL}/auth/user`);
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Ошибка при загрузке пользователя:", err);
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // Регистрация пользователя
  const register = async (formData) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setAuthToken(res.data.token);
      setIsLoading(false);
      return res.data;
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message || "Ошибка при регистрации пользователя"
      );
      throw err;
    }
  };

  // Авторизация пользователя
  const login = async (formData) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setAuthToken(res.data.token);
      setIsLoading(false);
      return res.data;
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message || "Ошибка при авторизации пользователя"
      );
      throw err;
    }
  };

  // Выход из системы
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
  };

  // Обновление данных пользователя
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Значение контекста
  const contextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
