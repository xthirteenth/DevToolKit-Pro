const { Client } = require("pg");
const dotenv = require("dotenv");

// Загрузка переменных окружения
dotenv.config();

async function checkUserModules() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();

    // Проверяем связи между пользователями и модулями
    const userModulesRes = await client.query(
      'SELECT COUNT(*) FROM "UserModules"'
    );
    console.log(`Количество связей: ${userModulesRes.rows[0].count}`);

    if (userModulesRes.rows[0].count > 0) {
      const userModules = await client.query(`
        SELECT um."userId", um."moduleId", u.username, m.name
        FROM "UserModules" um
        JOIN "Users" u ON um."userId" = u.id
        JOIN "Modules" m ON um."moduleId" = m.id
      `);

      console.log("Список установленных модулей:");
      userModules.rows.forEach((um) => {
        console.log(
          `- User: ${um.username} (ID: ${um.userId}), Module: ${um.name} (ID: ${um.moduleId})`
        );
      });
    }

    await client.end();
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

checkUserModules();
