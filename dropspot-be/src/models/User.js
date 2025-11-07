const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");


const User = sequelize.define(
  "User",
  {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  { tableName: "users", timestamps: true, underscored: true }
);

module.exports = User;
