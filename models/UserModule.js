const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Module = require("./Module");

const UserModule = sequelize.define(
  "UserModule",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    moduleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Module,
        key: "id",
      },
    },
    installedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

// Определение связей
User.belongsToMany(Module, { through: UserModule, foreignKey: "userId" });
Module.belongsToMany(User, { through: UserModule, foreignKey: "moduleId" });

module.exports = UserModule;
