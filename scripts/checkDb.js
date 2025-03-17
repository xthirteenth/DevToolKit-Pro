const { Client } = require("pg");
const dotenv = require("dotenv");

// Загрузка переменных окружения
dotenv.config();

// Получение параметров подключения из .env
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Функция для проверки подключения к PostgreSQL
async function checkConnection() {
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "postgres", // Подключаемся к системной базе данных postgres
  });

  try {
    console.log("Попытка подключения к PostgreSQL...");
    await client.connect();
    console.log("Подключение к PostgreSQL успешно!");

    // Проверяем, существует ли база данных
    const res = await client.query(
      "SELECT datname FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (res.rows.length === 0) {
      console.log(`База данных ${DB_NAME} не существует. Создаю...`);
      // Отключаемся от текущей базы данных перед созданием новой
      await client.end();

      // Подключаемся снова для создания базы данных
      const adminClient = new Client({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: "postgres",
      });

      await adminClient.connect();
      // Создаем базу данных
      await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`База данных ${DB_NAME} успешно создана!`);
      await adminClient.end();
    } else {
      console.log(`База данных ${DB_NAME} уже существует.`);
      await client.end();
    }

    return true;
  } catch (err) {
    console.error("Ошибка при подключении к PostgreSQL:", err);
    return false;
  }
}

// Запуск функции проверки
checkConnection()
  .then((success) => {
    if (success) {
      console.log("Проверка базы данных завершена успешно.");
    } else {
      console.log("Проверка базы данных завершена с ошибками.");
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Непредвиденная ошибка:", err);
    process.exit(1);
  });
