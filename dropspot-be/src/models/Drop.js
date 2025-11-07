const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const User = require("./User");

const Drop = sequelize.define(
  "Drop",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    claim_window_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    claim_window_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "drops",
    timestamps: true,
    underscored: true,
  }
);

// İlişki tanımı
User.hasMany(Drop, { foreignKey: "user_id" });
Drop.belongsTo(User, { foreignKey: "user_id" });

module.exports = Drop;
