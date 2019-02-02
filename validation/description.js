const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateDescriptionInput(data) {
  let errors = {};

  data.description = !isEmpty(data.description) ? data.description : "";

  if (Validator.isEmpty(data.description)) {
    errors.description = "Поле с описанием обязательно";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
