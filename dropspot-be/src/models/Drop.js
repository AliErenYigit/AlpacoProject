const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Drop = sequelize.define(
  "Drop",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    start_at: { type: DataTypes.DATE, allowNull: false },
    end_at: { type: DataTypes.DATE, allowNull: false },
    claim_window_start: { type: DataTypes.DATE, allowNull: false },
    claim_window_end: { type: DataTypes.DATE, allowNull: false },
  },
  { tableName: "drops", timestamps: true, underscored: true }
);

module.exports = Drop;
