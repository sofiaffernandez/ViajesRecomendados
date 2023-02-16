const { getConnection } = require("../../DB/db");
const {
  processAndSaveImage,
  generateError,
  showDebug,
} = require("../../helpers");

const { newRecomendacionSchema } = require("../../Schemas/Recomendaciones/schemasRecomendaciones");

async function editarRecomendacion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    //Validar según el esquema creado los datos introducidos
    await newRecomendacionSchema.validateAsync(req.body);
    const { id } = req.params;
    // Sacar de req.body los datos que necesitio
    const { titulo, categoria, lugar, entradilla, texto } = req.body

     // Comprobar que el id de usuario que queremos cambiar es el mismo que firma la petición 
     if (req.auth.id !== id) {
        throw generateError("No tienes permisos para editar esta entradilla", 403);
      }
  
    // Ejecutar la query
    const [result] = await connection.query(
        `UPDATE  recomendaciones 
        SET titulo=?, categoria=?, lugar=?, entradilla=?, texto=?, autor_id?=?
        WHERE id =?`,
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
            `UPDATE recomendaciones_fotos
            SET created_at=UTC_TIMESTAMP, foto =?, recomendacion_id=?
            WHERE recomendacion_id=?`,
            [processedImage,id, id]
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

module.exports = editarRecomendacion;
