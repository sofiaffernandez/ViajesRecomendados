//Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto)
const { getConnection } = require("../../db");
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');

const newRecomendationSchema = Joi.object().keys({
  titulo: Joi.string()
  .min(5)
  .max(50)
  .required()
  .error(
    generateError(
      "El campo titulo debe existir y ser mayor de cinco caracteres",
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
  .min(30)
  .max(255)
  .required()
  .error(
    generateError(
      "El campo entradilla debe existir y ser mayor de treinta caracteres",
        400
    )
  ),
  texto: Joi.string()
    .min(20)
    .max(5000)
    .required()
    .error(
      generateError(
        "El campo texto debe existir y ser mayor de 20 caracteres",
        400
      )
    )
});


const publishRecomendation = async (título, categoría, lugar, entradilla, texto, foto = '') => {
    let connection;
    
    try {
      connection = await getConnection();
      
      await newRecomendationSchema.validateAsync(req.body)
      const [result] = await connection.query(
        `
        INSERT INTO recomendacion (título, categoría, lugar, entradilla, texto, foto)
        VALUES(?,?,?,?,?,?)
      `,
        [título, categoría, lugar, entradilla, texto, foto ]
      );
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
  
      res.send({
        status: "ok",
        message: `Recomendación creada correctamente`,
  
    })}
    catch (error) {
        next(error);
      } finally {
      if (connection) connection.release();
    }
  };
module.exports = publishRecomendation