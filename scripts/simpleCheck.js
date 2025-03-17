const { Client } = require("pg");
const dotenv = require("dotenv");

// Загрузка переменных окружения
dotenv.config();

// Получение параметров подключения из .env
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function simpleCheck() {
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  try {
    await client.connect();
    console.log("Подключение успешно!");

    // Проверяем количество записей в таблицах
    const usersCount = await client.query('SELECT COUNT(*) FROM "Users"');
    console.log(`Количество пользователей: ${usersCount.rows[0].count}`);

    const modulesCount = await client.query('SELECT COUNT(*) FROM "Modules"');
    console.log(`Количество модулей: ${modulesCount.rows[0].count}`);

    const userModulesCount = await client.query(
      'SELECT COUNT(*) FROM "UserModules"'
    );
    console.log(
      `Количество установленных модулей: ${userModulesCount.rows[0].count}`
    );

    await client.end();
    return true;
  } catch (err) {
    console.error("Ошибка:", err);
    return false;
  }
}

simpleCheck()
  .then(() => {
    console.log("Проверка завершена");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Ошибка:", err);
    process.exit(1);
  });
