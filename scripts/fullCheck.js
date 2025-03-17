const { Client } = require("pg");
const dotenv = require("dotenv");

// Загрузка переменных окружения
dotenv.config();

async function fullCheck() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log("Подключение к базе данных успешно!\n");

    // 1. Проверяем таблицы
    console.log("=== ТАБЛИЦЫ В БАЗЕ ДАННЫХ ===");
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    if (tablesRes.rows.length === 0) {
      console.log("Таблиц нет");
    } else {
      tablesRes.rows.forEach((row) => {
        console.log(`- ${row.table_name}`);
      });
    }

    // 2. Проверяем пользователей
    console.log("\n=== ПОЛЬЗОВАТЕЛИ ===");
    const usersRes = await client.query(
      'SELECT id, username, email FROM "Users"'
    );

    if (usersRes.rows.length === 0) {
      console.log("Пользователей нет");
    } else {
      usersRes.rows.forEach((row) => {
        console.log(
          `- ID: ${row.id}, Username: ${row.username}, Email: ${row.email}`
        );
      });
    }

    // 3. Проверяем модули
    console.log("\n=== МОДУЛИ ===");
    const modulesRes = await client.query(
      'SELECT id, name, category, downloads FROM "Modules"'
    );

    if (modulesRes.rows.length === 0) {
      console.log("Модулей нет");
    } else {
      modulesRes.rows.forEach((row) => {
        console.log(
          `- ID: ${row.id}, Name: ${row.name}, Category: ${row.category}, Downloads: ${row.downloads}`
        );
      });
    }

    // 4. Проверяем связи пользователей и модулей
    console.log("\n=== УСТАНОВЛЕННЫЕ МОДУЛИ ===");
    const userModulesRes = await client.query(`
      SELECT um."userId", um."moduleId", u.username, m.name
      FROM "UserModules" um
      JOIN "Users" u ON um."userId" = u.id
      JOIN "Modules" m ON um."moduleId" = m.id
    `);

    if (userModulesRes.rows.length === 0) {
      console.log("Установленных модулей нет");
    } else {
      userModulesRes.rows.forEach((row) => {
        console.log(
          `- User: ${row.username} (ID: ${row.userId}), Module: ${row.name} (ID: ${row.moduleId})`
        );
      });
    }

    await client.end();
    return true;
  } catch (err) {
    console.error("Ошибка при проверке данных:", err);
    return false;
  }
}

// Запуск функции проверки
fullCheck()
  .then((success) => {
    if (success) {
      console.log("\nПроверка данных завершена успешно.");
    } else {
      console.log("\nПроверка данных завершена с ошибками.");
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Непредвиденная ошибка:", err);
    process.exit(1);
  });
