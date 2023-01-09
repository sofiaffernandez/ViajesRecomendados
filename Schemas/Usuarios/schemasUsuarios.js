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

//Esquema validación cambio contraseña

const editUserPasswordSchema = Joi.object().keys({
  viejaContraseña: Joi.string()
    .min(8)
    .required()
    .alphanum()
    .error(
      generateError(
        "El campo oldPassword debe existir y ser mayor de 8 caracteres",
        400
      )
    ),
  nuevaContraeña: Joi.string()
    .min(8)
    .required()
    .alphanum()
    .invalid(Joi.ref("oldPassword"))
    .error(
      generateError(
        "El campo newPassword debe existir, ser diferente a oldPassword y ser mayor de 8 caracteres",
        400
      )
    ),
});

module.exports = {
  editUserPasswordSchema,
  newUserSchema,
  loginUserSchema
}
