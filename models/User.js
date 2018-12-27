const Sequelize = require("sequelize");
const db = require("../database");

module.exports = User = db.define("users", {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING
});
