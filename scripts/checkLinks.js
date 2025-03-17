const { Client } = require("pg");
const dotenv = require("dotenv");

// Загрузка переменных окружения
dotenv.config();

async function checkLinks() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log("Подключение к базе данных успешно!");

    // Проверяем связи между пользователями и модулями
    console.log("\nПроверка связей между пользователями и модулями:");

    // Получаем количество записей в таблице UserModules
    const countRes = await client.query('SELECT COUNT(*) FROM "UserModules"');
    console.log(`Количество связей: ${countRes.rows[0].count}`);

    // Получаем все записи из таблицы UserModules
    const linksRes = await client.query('SELECT * FROM "UserModules"');

    if (linksRes.rows.length === 0) {
      console.log("Связей нет");
    } else {
      console.log("Список связей:");
      linksRes.rows.forEach((row) => {
        console.log(`- UserID: ${row.userId}, ModuleID: ${row.moduleId}`);
      });
    }

    // Получаем информацию о пользователях и их модулях
    const userModulesRes = await client.query(`
      SELECT u.username, m.name
      FROM "UserModules" um
      JOIN "Users" u ON um."userId" = u.id
      JOIN "Modules" m ON um."moduleId" = m.id
    `);

    if (userModulesRes.rows.length === 0) {
      console.log("Нет данных о пользователях и их модулях");
    } else {
      console.log("\nПользователи и их модули:");
      userModulesRes.rows.forEach((row) => {
        console.log(`- User: ${row.username}, Module: ${row.name}`);
      });
    }

    await client.end();
    return true;
  } catch (err) {
    console.error("Ошибка при проверке связей:", err);
    return false;
  }
}

// Запуск функции проверки
checkLinks()
  .then((success) => {
    if (success) {
      console.log("\nПроверка связей завершена успешно.");
    } else {
      console.log("\nПроверка связей завершена с ошибками.");
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Непредвиденная ошибка:", err);
    process.exit(1);
  });
