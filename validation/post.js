const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.text = !isEmpty(data.text) ? data.text : "";
  data.budget = !isEmpty(data.budget) ? data.budget : "";

  if (!Validator.isLength(data.title, { min: 5, max: 255 })) {
    errors.title = "Название проекта должно быть от 5 до 255 символов";
  }

  if (!Validator.isLength(data.text, { min: 15 })) {
    errors.text = "Описание задания должно быть от 15 символов";
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = "Название проекта обязательно";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Описание задания обязательно";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
