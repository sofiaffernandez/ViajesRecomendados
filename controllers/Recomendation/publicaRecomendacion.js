//Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto)

const { generateError } = require ("../../helpers")
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');
const Joi = require ('joi');
const createRecomendacion = require("./createRecomendacion");

const newRecomendationSchema = Joi.object().keys({
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
    .max(5000)
    .required()
    .error(
      generateError(
        "El campo texto debe existir y ser mayor de 40 caracteres",
        400
      )
    )
});


const publicaRecomendacion = async (req, res, next) => {
    try {
      const { titulo, categoria, lugar, entradilla, texto } = req.body
      await newRecomendationSchema.validateAsync(req.body)
     //Gestión de la imagen
    let imageFileName;
    if (req.files && req.files.image) {
      // Creo el path del directorio uploads
      const uploadsDir = path.join(__dirname, '../uploads');

      // Creo el directorio si no existe
      await createPathIfNotExists(uploadsDir);

      // Procesar la imagen
      const image = sharp(req.files.image.data);
      image.resize(1000);

      // Guardo la imagen con un nombre aleatorio en el directorio uploads
      imageFileName = `${nanoid(24)}.jpg`;

      await image.toFile(path.join(uploadsDir, imageFileName));
    }
    await createRecomendacion(titulo, categoria, lugar, entradilla, texto, imageFileName)
    res.send({
      status: "ok",
      message: `Recomendación creada correctamente`,  
    })
  }
    catch (error) {
        next(error);
}}
module.exports = publicaRecomendacion