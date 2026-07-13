const { Sequelize } = require("sequelize");
require("dotenv").config();

const useSsl = process.env.MYSQL_SSL === "true";

const sequelize = new Sequelize(
  process.env.MYSQL_DB || "chat_app",
  process.env.MYSQL_USER || "root",
  process.env.MYSQL_PASSWORD || "",
  {
    host: process.env.MYSQL_HOST || "localhost",
    port: process.env.MYSQL_PORT || 3306,
    dialect: "mysql",
    dialectOptions: useSsl
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
    logging: false,
  }
);

module.exports = sequelize;
