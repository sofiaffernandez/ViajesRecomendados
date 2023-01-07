const { createUser } =require("./newUser.js")
const { generateError } = require('../../helpers');
const Joi = require("@hapi/joi");
const { join } = require("path");
const newUserSchema = Joi.object().keys({
  nombre: Joi.string()
  .required()
  .error(
    generateError("El campo nombre debe existir", 400)
  ),
    email: Joi.string()
      .email()
      .required()
      .error(
        generateError("El campo email debe existir y ser un email válido", 400)
      ),
    contraseña: Joi.string()
      .min(8)
      .required()
      .error(
        generateError(
          "El campo password debe existir y ser mayor de 8 caracteres",
          400
        )
      ),
  });
const newUserController = async (req, res, next) => {
    try {
      const { email, contraseña, nombre } = req.body;
      await newUserSchema.validateAsync(req.body)
     
      const id = await createUser(email, contraseña, nombre);
  
      res.send({
        status: 'ok',
        message: `User created with id: ${id}`,
      });
    } catch (error) {
      next(error);
    }
  };
  module.exports = newUserController
