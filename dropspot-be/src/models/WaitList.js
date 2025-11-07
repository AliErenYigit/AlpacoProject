const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Waitlist = sequelize.define(
  "Waitlist",
  {
    status: {
      type: DataTypes.ENUM("waiting", "left", "claimed", "expired"),
      defaultValue: "waiting",
    },
    priority_score: { type: DataTypes.INTEGER, defaultValue: 0 },
    joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "waitlist", timestamps: false, underscored: true }
);

module.exports = Waitlist;
