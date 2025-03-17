const express = require("express");
const router = express.Router();
const { Module, User, UserModule } = require("../models");
const auth = require("../middleware/auth");
const { Op } = require("sequelize");

// @route   GET api/modules
// @desc    Получение всех модулей
// @access  Public
router.get("/", async (req, res) => {
  try {
    const modules = await Module.findAll({
      order: [["downloads", "DESC"]],
    });
    res.json(modules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   GET api/modules/:id
// @desc    Получение модуля по ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);

    if (!module) {
      return res.status(404).json({ message: "Модуль не найден" });
    }

    res.json(module);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   POST api/modules
// @desc    Создание нового модуля
// @access  Private (только для админов в будущем)
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, category, content, tags } = req.body;

    // Проверка уникальности имени модуля
    const existingModule = await Module.findOne({ where: { name } });
    if (existingModule) {
      return res
        .status(400)
        .json({ message: "Модуль с таким именем уже существует" });
    }

    // Создание нового модуля
    const newModule = await Module.create({
      name,
      description,
      category,
      content,
      tags: tags || [],
    });

    res.json(newModule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   PUT api/modules/:id
// @desc    Обновление модуля
// @access  Private (только для админов в будущем)
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, description, category, content, tags } = req.body;

    // Проверка уникальности имени модуля
    if (name) {
      const existingModule = await Module.findOne({
        where: {
          name,
          id: { [Op.ne]: req.params.id },
        },
      });

      if (existingModule) {
        return res
          .status(400)
          .json({ message: "Модуль с таким именем уже существует" });
      }
    }

    // Обновление модуля
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;
    if (content) updateFields.content = content;
    if (tags) updateFields.tags = tags;

    const [updated] = await Module.update(updateFields, {
      where: { id: req.params.id },
    });

    if (updated === 0) {
      return res.status(404).json({ message: "Модуль не найден" });
    }

    const module = await Module.findByPk(req.params.id);
    res.json(module);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   DELETE api/modules/:id
// @desc    Удаление модуля
// @access  Private (только для админов в будущем)
router.delete("/:id", auth, async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);

    if (!module) {
      return res.status(404).json({ message: "Модуль не найден" });
    }

    // Удаление связей с пользователями
    await UserModule.destroy({
      where: { moduleId: req.params.id },
    });

    // Удаление модуля
    await module.destroy();

    res.json({ message: "Модуль удален" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   POST api/modules/:id/install
// @desc    Установка модуля пользователем
// @access  Private
router.post("/:id/install", auth, async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);

    if (!module) {
      return res.status(404).json({ message: "Модуль не найден" });
    }

    // Проверка, установлен ли уже модуль
    const userModule = await UserModule.findOne({
      where: {
        userId: req.user.id,
        moduleId: req.params.id,
      },
    });

    if (userModule) {
      return res.status(400).json({ message: "Модуль уже установлен" });
    }

    // Добавление модуля в список установленных
    await UserModule.create({
      userId: req.user.id,
      moduleId: req.params.id,
    });

    // Увеличение счетчика загрузок
    module.downloads += 1;
    await module.save();

    // Получаем обновленные данные пользователя
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Module }],
    });

    // Получаем список ID установленных модулей
    const installedModules = user.Modules.map((module) => module.id);

    // Возвращаем обновленные данные пользователя
    res.json({
      message: "Модуль успешно установлен",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        installedModules,
      },
      installedModules,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   DELETE api/modules/:id/uninstall
// @desc    Удаление модуля из списка установленных
// @access  Private
router.delete("/:id/uninstall", auth, async (req, res) => {
  try {
    // Проверка, установлен ли модуль
    const userModule = await UserModule.findOne({
      where: {
        userId: req.user.id,
        moduleId: req.params.id,
      },
    });

    if (!userModule) {
      return res.status(400).json({ message: "Модуль не установлен" });
    }

    // Удаление модуля из списка установленных
    await userModule.destroy();

    // Получаем обновленные данные пользователя
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Module }],
    });

    // Получаем список ID установленных модулей
    const installedModules = user.Modules.map((module) => module.id);

    // Возвращаем обновленные данные пользователя
    res.json({
      message: "Модуль успешно удален",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        installedModules,
      },
      installedModules,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   GET api/modules/category/:category
// @desc    Получение модулей по категории
// @access  Public
router.get("/category/:category", async (req, res) => {
  try {
    const modules = await Module.findAll({
      where: { category: req.params.category },
      order: [["downloads", "DESC"]],
    });

    res.json(modules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// @route   GET api/modules/search/:query
// @desc    Поиск модулей
// @access  Public
router.get("/search/:query", async (req, res) => {
  try {
    const searchQuery = `%${req.params.query}%`;

    const modules = await Module.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: searchQuery } },
          { description: { [Op.iLike]: searchQuery } },
          { tags: { [Op.contains]: [req.params.query] } },
        ],
      },
      order: [["downloads", "DESC"]],
    });

    res.json(modules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
