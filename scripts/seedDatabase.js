const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const {
  sequelize,
  User,
  Module,
  UserModule,
  syncDatabase,
} = require("../models");

// Загрузка переменных окружения
dotenv.config();

// Тестовые модули
const modules = [
  {
    name: "CSS Flexbox Snippets",
    description: "Коллекция готовых CSS сниппетов для Flexbox-верстки",
    category: "CSS",
    content: `
/* Базовый контейнер flex */
.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* Центрирование элемента по вертикали и горизонтали */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Колонки одинаковой ширины */
.flex-columns {
  display: flex;
}
.flex-columns > * {
  flex: 1;
}

/* Прижатие элементов к разным сторонам */
.flex-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
    `,
    tags: ["CSS", "Flexbox", "Layout"],
    downloads: 120,
  },
  {
    name: "React Hooks Collection",
    description: "Набор полезных кастомных React хуков для различных задач",
    category: "React",
    content: `
// useLocalStorage - хук для работы с localStorage
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// useMediaQuery - хук для отслеживания медиа-запросов
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
    `,
    tags: ["React", "Hooks", "JavaScript"],
    downloads: 85,
  },
  {
    name: "CSS Grid Templates",
    description: "Готовые шаблоны для создания сеток с помощью CSS Grid",
    category: "CSS",
    content: `
/* Базовая сетка */
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 20px;
}

/* Адаптивная сетка */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
}

/* Макет с сайдбаром */
.sidebar-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
}

.sidebar-layout .header { grid-area: header; }
.sidebar-layout .sidebar { grid-area: sidebar; }
.sidebar-layout .main { grid-area: main; }
.sidebar-layout .footer { grid-area: footer; }

/* Адаптивный макет с сайдбаром */
@media (max-width: 768px) {
  .sidebar-layout {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "header"
      "sidebar"
      "main"
      "footer";
  }
}
    `,
    tags: ["CSS", "Grid", "Layout"],
    downloads: 95,
  },
  {
    name: "JavaScript Utility Functions",
    description: "Коллекция полезных JavaScript функций для работы с данными",
    category: "JavaScript",
    content: `
/**
 * Форматирует число с разделителями тысяч
 * @param {number} num - Число для форматирования
 * @param {string} separator - Разделитель (по умолчанию пробел)
 * @returns {string} Отформатированное число
 */
function formatNumber(num, separator = ' ') {
  return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, separator);
}

/**
 * Генерирует случайное число в заданном диапазоне
 * @param {number} min - Минимальное значение
 * @param {number} max - Максимальное значение
 * @returns {number} Случайное число
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Проверяет, является ли строка валидным email
 * @param {string} email - Строка для проверки
 * @returns {boolean} Результат проверки
 */
function isValidEmail(email) {
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(email);
}

/**
 * Дебаунс функция для ограничения частоты вызовов
 * @param {Function} func - Функция для дебаунса
 * @param {number} wait - Время ожидания в мс
 * @returns {Function} Дебаунс функция
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
    `,
    tags: ["JavaScript", "Utility", "Functions"],
    downloads: 150,
  },
];

// Тестовый пользователь
const testUser = {
  username: "testuser",
  email: "test@example.com",
  password: "password123",
};

// Функция для очистки и заполнения базы данных
async function seedDatabase() {
  try {
    // Синхронизация моделей с базой данных (с удалением существующих таблиц)
    await sequelize.sync({ force: true });
    console.log("База данных синхронизирована");

    // Добавление модулей
    const createdModules = await Module.bulkCreate(modules);
    console.log(`Добавлено ${createdModules.length} модулей`);

    // Создание тестового пользователя
    const user = await User.create({
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
    });

    console.log("Тестовый пользователь создан");

    // Установка модулей для пользователя
    await UserModule.bulkCreate([
      { userId: user.id, moduleId: createdModules[0].id },
      { userId: user.id, moduleId: createdModules[2].id },
    ]);

    console.log("Модули установлены для тестового пользователя");
    console.log("База данных успешно заполнена");

    process.exit(0);
  } catch (err) {
    console.error("Ошибка при заполнении базы данных:", err);
    process.exit(1);
  }
}

// Запуск функции заполнения
seedDatabase();
