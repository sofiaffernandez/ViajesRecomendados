const { getConnection } = require("../../DB/db");
const {
  processAndSaveImage,
  generateError,
  showDebug,
} = require("../../helpers");

const { newRecomendacionSchema } = require("../../Schemas/Recomendaciones/schemasRecomendaciones");

async function nuevaRecomendacion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    //Validar según el esquema creado los datos introducidos
    await newRecomendacionSchema.validateAsync(req.body);

    // Sacar de req.body los datos que necesitio
    const { titulo, categoria, lugar, entradilla, texto } = req.body

    // Ejecutar la query
    const [result] = await connection.query(
        `INSERT INTO recomendaciones (titulo, categoria, lugar, entradilla, texto, created_at, autor_id)
        VALUES(?,?,?,?,?, UTC_TIMESTAMP,?)`,
        [titulo, categoria, lugar, entradilla, texto, req.auth.id]
      );


    // Si hay imágenes, procesar cada imagen y meterla en la tabla recomendaciones_fotos con la referencia a la entrada
    const fotos = [];

    if (req.files && Object.keys(req.files).length > 0) {
      for (const [imageName, imageData] of Object.entries(req.files).slice(
        0,
        3
      )) {
        try {
          showDebug(imageName);

          const processedImage = await processAndSaveImage(imageData);

          fotos.push(processedImage);

          await connection.query(
            `INSERT INTO recomendaciones_fotos (created_at, foto, recomendacion_id)
            VALUES(UTC_TIMESTAMP, ?, ?)`,
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

    // Devolver el resultado

    res.send({
      status: "ok",
      data: {
        id: result.insertId,
        titulo, categoria, lugar, entradilla, texto, fotos
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = nuevaRecomendacion;
