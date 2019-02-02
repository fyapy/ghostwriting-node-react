const Sequelize = require("sequelize");
const db = require("../database");

module.exports = User = db.define("posts", {
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  budget: Sequelize.INTEGER,
  views: Sequelize.INTEGER,
  workerId: Sequelize.INTEGER,
  completed: Sequelize.TINYINT,
  userId: Sequelize.INTEGER
});
