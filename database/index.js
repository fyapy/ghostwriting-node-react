const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = new Sequelize("gwapp", "root", "", {
  dialect: "mysql",
  logging: false,
  operatorsAliases: {
    $and: Op.and,
    $or: Op.or,
    $eq: Op.eq,
    $gt: Op.gt,
    $lt: Op.lt,
    $lte: Op.lte,
    $like: Op.like
  }
});
