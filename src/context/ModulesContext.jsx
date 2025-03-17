import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

// API URL
const API_URL = "http://localhost:5000/api";

// Функция для установки куки
const setCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
};

// Функция для получения значения куки
const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Примеры модулей для демонстрации
export const exampleModules = [
  {
    id: 1,
    name: "CSS Flexbox Snippets",
    description: "Коллекция готовых шаблонов CSS Flexbox для различных макетов",
    category: "CSS",
    downloads: 1245,
    tags: ["css", "flexbox", "layout"],
    content: (
      <>
        <h2>CSS Flexbox Snippets</h2>
        <p>Используйте эти готовые шаблоны для создания гибких макетов:</p>
        <pre>
          {`.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.flex-item {
  flex: 1 1 300px;
  margin: 10px;
}`}
        </pre>
        <h3>Центрирование элемента</h3>
        <pre>
          {`.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}`}
        </pre>
      </>
    ),
  },
  {
    id: 2,
    name: "React Hooks Collection",
    description: "Набор полезных пользовательских хуков для React приложений",
    category: "React",
    downloads: 987,
    tags: ["react", "hooks", "javascript"],
    content: (
      <>
        <h2>React Hooks Collection</h2>
        <p>Полезные пользовательские хуки для ваших React-приложений:</p>
        <h3>useLocalStorage</h3>
        <pre>
          {`const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};`}
        </pre>
      </>
    ),
  },
  {
    id: 3,
    name: "CSS Grid Templates",
    description: "Готовые шаблоны CSS Grid для создания адаптивных сеток",
    category: "CSS",
    downloads: 856,
    tags: ["css", "grid", "responsive"],
    content: (
      <>
        <h2>CSS Grid Templates</h2>
        <p>Готовые шаблоны для создания адаптивных сеток:</p>
        <h3>Базовая сетка</h3>
        <pre>
          {`.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
}

.grid-item {
  padding: 20px;
  border: 1px solid #ddd;
}`}
        </pre>
        <h3>Макет страницы</h3>
        <pre>
          {`.page-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav content sidebar"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}`}
        </pre>
      </>
    ),
  },
  {
    id: 4,
    name: "JavaScript Utility Functions",
    description: "Коллекция полезных функций JavaScript для работы с данными",
    category: "JavaScript",
    downloads: 1532,
    tags: ["javascript", "utility", "functions"],
    content: (
      <>
        <h2>JavaScript Utility Functions</h2>
        <p>Полезные функции для работы с данными:</p>
        <h3>Форматирование даты</h3>
        <pre>
          {`function formatDate(date, format = 'DD.MM.YYYY') {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year);
}`}
        </pre>
        <h3>Генерация случайного ID</h3>
        <pre>
          {`function generateId(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return id;
}`}
        </pre>
      </>
    ),
  },
];

// Создаем контекст
export const ModulesContext = createContext();

// Хук для использования контекста
export const useModules = () => useContext(ModulesContext);

// Провайдер контекста
export const ModulesProvider = ({ children }) => {
  // Получаем данные из контекста авторизации
  const auth = useAuth() || {};
  const { user, isAuthenticated, updateUser } = auth;

  // Состояние для хранения установленных модулей
  const [installedModules, setInstalledModules] = useState([]);

  // Состояние для отображения индикатора загрузки
  const [isInstalling, setIsInstalling] = useState(false);

  // Загружаем установленные модули из данных пользователя
  useEffect(() => {
    if (isAuthenticated && user) {
      setInstalledModules(user.installedModules || []);
    } else {
      setInstalledModules([]);
    }
  }, [isAuthenticated, user]);

  // Функция для установки модуля
  const installModule = async (moduleId) => {
    // Проверяем, авторизован ли пользователь
    if (!isAuthenticated) {
      alert("Для установки модуля необходимо авторизоваться");
      return;
    }

    // Проверяем, не установлен ли уже модуль
    if (installedModules.includes(moduleId)) {
      return;
    }

    // Показываем индикатор загрузки
    setIsInstalling(true);

    try {
      // Отправляем запрос на сервер
      const response = await axios.post(
        `${API_URL}/modules/${moduleId}/install`
      );

      console.log("Ответ сервера при установке модуля:", response.data);

      // Обновляем данные пользователя
      if (updateUser && response.data.user) {
        updateUser(response.data.user);
      }

      // Обновляем список установленных модулей
      setInstalledModules(response.data.installedModules || []);

      // Скрываем индикатор загрузки
      setIsInstalling(false);
    } catch (error) {
      console.error("Ошибка при установке модуля:", error);
      setIsInstalling(false);
      alert("Ошибка при установке модуля. Попробуйте позже.");
    }
  };

  // Функция для удаления модуля
  const uninstallModule = async (moduleId) => {
    // Проверяем, авторизован ли пользователь
    if (!isAuthenticated) {
      alert("Для удаления модуля необходимо авторизоваться");
      return;
    }

    try {
      // Отправляем запрос на сервер
      const response = await axios.delete(
        `${API_URL}/modules/${moduleId}/uninstall`
      );

      console.log("Ответ сервера при удалении модуля:", response.data);

      // Обновляем данные пользователя
      if (updateUser && response.data.user) {
        updateUser(response.data.user);
      }

      // Обновляем список установленных модулей
      setInstalledModules(response.data.installedModules || []);
    } catch (error) {
      console.error("Ошибка при удалении модуля:", error);
      alert("Ошибка при удалении модуля. Попробуйте позже.");
    }
  };

  // Функция для проверки, установлен ли модуль
  const isModuleInstalled = (moduleId) => {
    return installedModules.includes(moduleId);
  };

  // Функция для получения установленного модуля по ID
  const getInstalledModule = (moduleId) => {
    return exampleModules.find((module) => module.id === moduleId);
  };

  // Функция для получения всех установленных модулей
  const getAllInstalledModules = () => {
    return exampleModules.filter((module) =>
      installedModules.includes(module.id)
    );
  };

  // Значение контекста
  const contextValue = {
    installedModules,
    isInstalling,
    installModule,
    uninstallModule,
    isModuleInstalled,
    getInstalledModule,
    getAllInstalledModules,
    availableModules: exampleModules,
  };

  return (
    <ModulesContext.Provider value={contextValue}>
      {children}
    </ModulesContext.Provider>
  );
};
