const mysql = require("mysql2/promise");
require("dotenv").config();

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      ssl:
        process.env.MYSQL_SSL === "true"
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
    });

    const dbName = process.env.MYSQL_DB || "chat_app";

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' created or already exists.`);

    await connection.end();
  } catch (error) {
    console.error("Error creating database:", error.message);
    console.log(
      "\nPlease make sure your MySQL server is running (e.g., through XAMPP, WAMP, or MySQL service)."
    );
    process.exitCode = 1;
  }
}

createDatabase();
