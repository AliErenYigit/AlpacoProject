const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const AdminUser = sequelize.define(
  "AdminUser",
  {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "admin" },
  },
  { tableName: "admin_users", timestamps: false, underscored: true }
);

module.exports = AdminUser;
