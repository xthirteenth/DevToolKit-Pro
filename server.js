const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session");

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Настройка сессий
app.use(
  session({
    secret: process.env.SESSION_SECRET || "blockchain_calculator_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Подключение к базе данных
const { sequelize, syncDatabase } = require("./models");

// Синхронизация моделей с базой данных
syncDatabase();

// Импорт маршрутов
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const moduleRoutes = require("./routes/modules");

// Использование маршрутов
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/modules", moduleRoutes);

// Базовый маршрут
app.get("/", (req, res) => {
  res.send("API DevToolkit Pro работает");
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Что-то пошло не так!" });
});

// Запуск сервера
sequelize
  .authenticate()
  .then(() => {
    console.log("Подключение к PostgreSQL установлено");
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Ошибка подключения к базе данных:", err);
  });
