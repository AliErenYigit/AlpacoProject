const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Claim = sequelize.define(
  "Claim",
  {
    claim_code: { type: DataTypes.STRING, unique: true, allowNull: false },
    claimed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "claims", timestamps: false, underscored: true }
);

module.exports = Claim;
