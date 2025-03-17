const { sequelize, syncDatabase } = require("../models");
const { Client } = require("pg");
const dotenv = require("dotenv");

// Загрузка переменных окружения
dotenv.config();

// Получение параметров подключения из .env
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Функция для проверки таблиц в базе данных
async function checkTables() {
  // Сначала проверим подключение к базе данных напрямую через pg
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  try {
    console.log("Подключение к базе данных...");
    await client.connect();
    console.log("Подключение успешно!");

    // Проверяем наличие таблиц
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log("Существующие таблицы в базе данных:");
    if (res.rows.length === 0) {
      console.log("Таблиц нет");
    } else {
      res.rows.forEach((row) => {
        console.log(`- ${row.table_name}`);
      });
    }

    // Закрываем подключение pg
    await client.end();

    // Теперь попробуем синхронизировать модели с базой данных через Sequelize
    console.log(
      "\nПопытка синхронизации моделей с базой данных через Sequelize..."
    );

    // Проверяем подключение Sequelize
    try {
      await sequelize.authenticate();
      console.log("Подключение Sequelize успешно!");
    } catch (err) {
      console.error("Ошибка подключения Sequelize:", err);
      return false;
    }

    // Синхронизируем модели с базой данных с force: true для пересоздания таблиц
    try {
      await sequelize.sync({ force: true });
      console.log("Модели успешно синхронизированы с базой данных!");
    } catch (err) {
      console.error("Ошибка синхронизации моделей:", err);
      return false;
    }

    // Проверяем, что таблицы созданы
    const client2 = new Client({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    await client2.connect();
    const res2 = await client2.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log("\nТаблицы после синхронизации:");
    if (res2.rows.length === 0) {
      console.log("Таблиц нет (что-то пошло не так)");
    } else {
      res2.rows.forEach((row) => {
        console.log(`- ${row.table_name}`);
      });
    }

    await client2.end();
    return true;
  } catch (err) {
    console.error("Ошибка при проверке таблиц:", err);
    return false;
  }
}

// Запуск функции проверки
checkTables()
  .then((success) => {
    if (success) {
      console.log("\nПроверка таблиц завершена успешно.");
    } else {
      console.log("\nПроверка таблиц завершена с ошибками.");
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Непредвиденная ошибка:", err);
    process.exit(1);
  });
