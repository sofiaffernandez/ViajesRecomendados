//Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto)
const { getConnection } = require("db");

const newEntrySchema = Joi.object().keys({
  place: Joi.string()
    .min(3)
    .max(100)
    .required()
    .error(
      generateError(
        "El campo place debe existir y ser mayor de 2 caracteres",
        400
      )
    ),
  description: Joi.string().max(10000),
});


const publishRecomendation = async (título, categoría, lugar, entradilla, texto, foto = '') => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
        `
        INSERT INTO recomendacion (título, categoría, lugar, entradilla, texto, foto)
        VALUES(?,?,?)
      `,
        [título, categoría, lugar, entradilla, texto, ]
      );

      const images = [];

      if (req.files && Object.keys(req.files).length > 0) {
        for (const [imageName, imageData] of Object.entries(req.files).slice(
          0,
          3
        )) {
          try {
            showDebug(imageName);
  
            const processedImage = await processAndSaveImage(imageData);
  
            images.push(processedImage);
  
            await connection.query(
              `
              INSERT INTO diary_images (uploadDate, image, entry_id)
              VALUES(UTC_TIMESTAMP, ?, ?)
            `,
              [processedImage, result.insertId]
            );
          } catch (error) {
            throw generateError(
              "No se pudo procesar la imagen. Inténtalo de nuevo",
              400
            );
          }
        }
      }
  
  
      res.send({
        status: "ok",
        data: {
          id: result.insertId,
          título, categoría, lugar, entradilla, texto, 
        },
  
    })}
    catch (error) {
        next(error);
      } finally {
      if (connection) connection.release();
    }
  };
module.exports = publishRecomendation