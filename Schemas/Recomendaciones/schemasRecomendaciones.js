const Joi = require ('joi');
const { generateError } = require("../../helpers");

//Esquema de validación de nueva entrada.
const newRecomendacionSchema = Joi.object().keys({
    titulo: Joi.string()
    .min(2)
    .max(50)
    .required()
    .error(
      generateError(
        "El campo titulo debe existir y ser mayor de dos caracteres",
          400
      )
    ),
    categoria: Joi.string()
    .min(3) 
    .max(50)
    .required()
    .error(
      generateError(
        "El campo categoria debe existir y ser mayor de tres caracteres",
          400
      )
    ),
    lugar: Joi.string()
    .min(3)
    .max(50)
    .required()
    .error(
      generateError(
        "El campo lugar debe existir y ser mayor de tres caracteres",
          400
      )
    ),
    entradilla:Joi.string()
    .min(20)
    .max(255)
    .required()
    .error(
      generateError(
        "El campo entradilla debe existir y ser mayor de 20 caracteres",
          400
      )
    ),
    texto: Joi.string()
      .min(40)
      .max(10000)
      .required()
      .error(
        generateError(
          "El campo texto debe existir y ser mayor de 40 caracteres",
          400
        )
    )
});
//Esquema validación de nuevo comentario.
const newComentarioSchema = Joi.string()
      .min(20)
      .max(1000)
      .required()
      .error(
        generateError(
          "El campo comentario debe existir y ser mayor de 20 caracteres",
          400
        )
    );
  
//Esquema de validación de nuevo voto.
const votoSchema = Joi.number()
    .min(1)
    .max(6)
    .required()
    .error(
      generateError(
        "El campo voto debe tener un valor entre 1 y 5 (incluídos)",
        400
      )
  );

  

module.exports = {
    newRecomendacionSchema,
    newComentarioSchema,
    votoSchema
}