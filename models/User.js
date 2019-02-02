const Sequelize = require("sequelize");
const db = require("../database");

module.exports = User = db.define("users", {
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  description: Sequelize.STRING,
  balance: Sequelize.INTEGER,
  avatar: Sequelize.STRING,
  likes: Sequelize.INTEGER,
  dislikes: Sequelize.INTEGER,
  password: Sequelize.STRING
});
