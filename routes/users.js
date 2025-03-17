const express = require("express");
const router = express.Router();
const { User, Module, UserModule } = require("../models");
const auth = require("../middleware/auth");
const { Op } = require("sequelize");

// @route   GET api/users/profile
// @desc    Получение профиля пользователя
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Module }],
    });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   PUT api/users/profile
// @desc    Обновление профиля пользователя
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, email } = req.body;

    // Проверка уникальности имени пользователя и email
    if (username) {
      const existingUser = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: req.user.id },
        },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем уже существует" });
      }
    }

    if (email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: req.user.id },
        },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким email уже существует" });
      }
    }

    // Обновление профиля
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;

    await User.update(updateFields, {
      where: { id: req.user.id },
    });

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   PUT api/users/password
// @desc    Изменение пароля пользователя
// @access  Private
router.put("/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Проверка текущего пароля
    const user = await User.findByPk(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Неверный текущий пароль" });
    }

    // Обновление пароля
    user.password = newPassword;
    await user.save();

    res.json({ message: "Пароль успешно изменен" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   GET api/users/modules
// @desc    Получение установленных модулей пользователя
// @access  Private
router.get("/modules", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Module }],
    });

    res.json(user.Modules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
