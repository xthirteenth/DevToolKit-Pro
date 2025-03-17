const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Module } = require("../models");
const sequelize = require("sequelize");

// Middleware для проверки токена
const auth = require("../middleware/auth");

// Глобальная переменная для хранения последних паролей пользователей
// В реальном приложении это небезопасно и используется только для демонстрации!
const userPasswords = {};

// @route   POST api/auth/register
// @desc    Регистрация пользователя
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверка существования пользователя
    const existingUser = await User.findOne({
      where: {
        [sequelize.Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Пользователь с таким email уже существует"
            : "Пользователь с таким именем уже существует",
      });
    }

    // Создание нового пользователя
    const user = await User.create({
      username,
      email,
      password,
    });

    // Сохраняем начальный пароль в глобальной переменной для демонстрации
    // В реальном приложении этого делать не следует!
    userPasswords[user.id] = password;

    // Создание JWT токена
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        // Возвращаем токен и данные пользователя (без пароля)
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          installedModules: user.installedModules,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        res.json({ token, user: userData });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   POST api/auth/login
// @desc    Аутентификация пользователя и получение токена
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка существования пользователя
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    // Сохраняем пароль в глобальной переменной для демонстрации
    // В реальном приложении этого делать не следует!
    userPasswords[user.id] = password;

    // Создание JWT токена
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        // Возвращаем токен и данные пользователя (без пароля)
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          installedModules: user.installedModules,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        res.json({ token, user: userData });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   GET api/auth/user
// @desc    Получение данных пользователя
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Module }],
    });

    // Получаем список ID установленных модулей
    const installedModules = user.Modules.map((module) => module.id);

    // Возвращаем данные пользователя с добавлением списка ID установленных модулей
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      installedModules,
      Modules: user.Modules,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   GET api/auth/password
// @desc    Получение пароля пользователя (для демонстрации)
// @access  Private
router.get("/password", auth, async (req, res) => {
  try {
    // Получаем пользователя из базы данных
    const user = await User.findByPk(req.user.id);

    // Проверяем, что пользователь найден
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    // В реальном приложении пароль хранится в хешированном виде и не может быть расшифрован
    // Для демонстрации возвращаем последний установленный пароль из глобальной переменной или заглушку
    // Это не безопасно для реального приложения!
    res.json({ password: userPasswords[req.user.id] || "реальный_пароль_123" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   POST api/auth/set-test-password
// @desc    Установка тестового пароля для пользователя
// @access  Private
router.post("/set-test-password", auth, async (req, res) => {
  try {
    const { password } = req.body;

    // Проверяем, что пароль предоставлен
    if (!password) {
      return res.status(400).json({ msg: "Пароль обязателен" });
    }

    // Получаем пользователя из базы данных
    const user = await User.findByPk(req.user.id);

    // Проверяем, что пользователь найден
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    // Обновляем пароль пользователя
    user.password = password;
    await user.save();

    // Сохраняем пароль в глобальной переменной для демонстрации
    // В реальном приложении этого делать не следует!
    userPasswords[req.user.id] = password;

    res.json({ msg: "Пароль успешно обновлен" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   POST api/auth/change-password
// @desc    Смена пароля пользователя
// @access  Private
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Проверяем, что все необходимые данные предоставлены
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Все поля обязательны" });
    }

    // Получаем пользователя из базы данных
    const user = await User.findByPk(req.user.id);

    // Проверяем, что пользователь найден
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    // Проверяем текущий пароль
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: "Неверный текущий пароль" });
    }

    // Обновляем пароль пользователя
    user.password = newPassword;
    await user.save();

    // Сохраняем последний установленный пароль в глобальной переменной для демонстрации
    // В реальном приложении этого делать не следует!
    userPasswords[req.user.id] = newPassword;

    res.json({ msg: "Пароль успешно изменен" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
