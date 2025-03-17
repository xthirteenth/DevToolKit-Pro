const sequelize = require("../config/database");
const User = require("./User");
const Module = require("./Module");
const UserModule = require("./UserModule");

// Синхронизация моделей с базой данных
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("База данных синхронизирована");
  } catch (error) {
    console.error("Ошибка синхронизации базы данных:", error);
  }
};

module.exports = {
  sequelize,
  User,
  Module,
  UserModule,
  syncDatabase,
};
