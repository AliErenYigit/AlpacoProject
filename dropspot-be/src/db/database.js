const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Veritabanı adı
  process.env.DB_USER, // Kullanıcı adı
  process.env.DB_PASSWORD, // Şifre
  {
    host: process.env.DB_HOST, // PostgreSQL sunucusu
    dialect: "postgres", // PostgreSQL kullanılacak
    port: process.env.DB_PORT, // Port (varsayılan 5432)
  }
);

module.exports = sequelize;