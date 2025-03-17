const { Client } = require("pg");
const dotenv = require("dotenv");

// Загрузка переменных окружения
dotenv.config();

// Получение параметров подключения из .env
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Функция для проверки данных в базе данных
async function checkData() {
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

    // Проверяем данные в таблице Users
    console.log("\nДанные в таблице Users:");
    const usersRes = await client.query(
      'SELECT id, username, email, "createdAt" FROM "Users"'
    );

    if (usersRes.rows.length === 0) {
      console.log("Нет данных");
    } else {
      usersRes.rows.forEach((row) => {
        console.log(
          `- ID: ${row.id}, Username: ${row.username}, Email: ${row.email}, Created: ${row.createdAt}`
        );
      });
    }

    // Проверяем данные в таблице Modules
    console.log("\nДанные в таблице Modules:");
    const modulesRes = await client.query(
      'SELECT id, name, category, downloads FROM "Modules"'
    );

    if (modulesRes.rows.length === 0) {
      console.log("Нет данных");
    } else {
      modulesRes.rows.forEach((row) => {
        console.log(
          `- ID: ${row.id}, Name: ${row.name}, Category: ${row.category}, Downloads: ${row.downloads}`
        );
      });
    }

    // Проверяем данные в таблице UserModules
    console.log("\nДанные в таблице UserModules:");
    const userModulesRes = await client.query(
      'SELECT "userId", "moduleId", "installedAt" FROM "UserModules"'
    );

    if (userModulesRes.rows.length === 0) {
      console.log("Нет данных");
    } else {
      userModulesRes.rows.forEach((row) => {
        console.log(
          `- UserID: ${row.userId}, ModuleID: ${row.moduleId}, Installed: ${row.installedAt}`
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
checkData()
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
