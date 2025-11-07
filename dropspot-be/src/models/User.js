const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const User = sequelize.define(
  "User",
  {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  { tableName: "users", timestamps: true, underscored: true }
);

module.exports = User;
