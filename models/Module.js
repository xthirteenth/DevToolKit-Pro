const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Module = sequelize.define(
  "Module",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            // Языки программирования
            "JavaScript",
            "TypeScript",
            "Python",
            "C++",
            "C",
            "Rust",
            "R",
            "Ruby",
            "Solidity",
            "Java",
            "C#",
            "Go",
            // Фреймворки и библиотеки
            "React",
            "CSS",
            "PyTorch",
            "Tailwind",
            "Node.js",
            "Express",
            "Matplotlib",
            "HTML",
            "Utility",
            "Other",
          ],
        ],
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    downloads: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeUpdate: (module) => {
        module.updatedAt = new Date();
      },
    },
  }
);

module.exports = Module;
