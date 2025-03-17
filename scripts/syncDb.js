const { syncDatabase } = require("../models");

syncDatabase()
  .then(() => {
    console.log("База данных успешно синхронизирована");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Ошибка синхронизации:", err);
    process.exit(1);
  });
