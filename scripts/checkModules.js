const { Client } = require("pg");
const dotenv = require("dotenv");

// Загрузка переменных окружения
dotenv.config();

async function checkModules() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();

    // Проверяем модули
    const modulesRes = await client.query('SELECT COUNT(*) FROM "Modules"');
    console.log(`Количество модулей: ${modulesRes.rows[0].count}`);

    if (modulesRes.rows[0].count > 0) {
      const modules = await client.query('SELECT id, name FROM "Modules"');
      console.log("Список модулей:");
      modules.rows.forEach((module) => {
        console.log(`- ID: ${module.id}, Name: ${module.name}`);
      });
    }

    await client.end();
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

checkModules();
