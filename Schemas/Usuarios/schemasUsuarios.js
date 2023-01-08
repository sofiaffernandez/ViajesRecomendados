const Joi = require ('joi');
const { generateError } = require("../../helpers");

//Esquema validación de creación de Usuario.
const newUserSchema = Joi.object().keys({
    nombre:Joi.string()
    .required()
    .error(
        new Error ("El campo nombre debe existir y ser mayor de 2 carecteres", 400)
      ),
    email: Joi.string()
      .email()
      .required()
      .error(
        new Error ("El campo email debe existir y ser un email válido", 400)
      ),
    contraseña: Joi.string()
      .min(8)
      .alphanum()
      .required()
      .error(
        new Error(
          "El campo password debe existir, ser alfanumérica y ser mayor de 8 caracteres",
          400
        )
      ),
  });

//Esquema validación de Login.
  const loginUserSchema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
      .error(
        new Error ("El campo email debe existir y ser un email válido", 400)
      ),
    contraseña: Joi.string()
      .min(8)
      .alphanum()
      .required()
      .error(
        new Error(
          "El campo password debe existir, ser alfanumérica y ser mayor de 8 caracteres",
          400
        )
      ),
  });
module.exports = {
  newUserSchema,
  loginUserSchema
}