const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.upload = !isEmpty(data.upload) ? data.upload : "";

  if (Validator.isEmpty(data.upload)) {
    errors.upload = "Поле с изображением обязательно";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
