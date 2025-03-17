const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Module } = require("../models");
const sequelize = require("sequelize");

// Middleware для проверки токена
const auth = require("../middleware/auth");

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

module.exports = router;
