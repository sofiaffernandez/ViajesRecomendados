const Joi = require("@hapi/joi");
const { generateError } = require("../../helpers");

const newUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(
      generateError("El campo email debe existir y ser un email válido", 400)
    ),
  password: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        "El campo password debe existir y ser mayor de 8 caracteres",
        400
      )
    ),
});

const loginUserSchema = newUserSchema;

const editUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .error(generateError("El campo email debe contener un email válido", 400)),
  name: Joi.string()
    .max(100)
    .error(
      generateError(
        "El campo nombre no debe de tener más de 100 caracteres",
        400
      )
    ),
});

const editUserPasswordSchema = Joi.object().keys({
  oldPassword: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        "El campo oldPassword debe existir y ser mayor de 8 caracteres",
        400
      )
    ),
  newPassword: Joi.string()
    .min(8)
    .required()
    .invalid(Joi.ref("oldPassword"))
    .error(
      generateError(
        "El campo newPassword debe existir, ser diferente a oldPassword y ser mayor de 8 caracteres",
        400
      )
    ),
});

const recoverUserPasswordSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(generateError("El campo email debe contener un email válido", 400)),
});

const resetUserPasswordSchema = Joi.object().keys({
  recoverCode: Joi.string()
    .length(40)
    .required()
    .error(
      generateError(
        "El campo recoverCode debe existir y tener 40 caracteres",
        400
      )
    ),
  newPassword: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        "El campo newPassword debe existir, y ser mayor de 8 caracteres",
        400
      )
    ),
});

module.exports = {
  newUserSchema,
  loginUserSchema,
  editUserSchema,
  editUserPasswordSchema,
  recoverUserPasswordSchema,
  resetUserPasswordSchema,
};
