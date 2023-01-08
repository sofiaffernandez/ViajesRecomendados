const { getConnection } = require("../../DB/db");
const { generateError, deleteUpload } = require("../../helpers");

async function borrarFotoRecomendacion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id, imageID } = req.params;

    // Seleccionar la recomendación con la id
    const [current] = await connection.query(
      `SELECT usuario_id
      FROM recomendaciones
      WHERE id=?`,
      [id]
    );

    // Comprobar que el usuario puede editar esta entrada
    const [currentEntry] = current;
    if (currentEntry.user_id !== req.auth.id) {
      throw generateError("No tienes permisos para editar esta entrada", 403);
    }

    // Seleccionar la imagen
    const [image] = await connection.query(
      `SELECT foto
      FROM recomendaciones_fotos
      WHERE id=? AND recomendacion_id=?
    `,
      [imageID, id]
    );

    if (image.length === 0) {
      throw generateError("La imagen no existe", 404);
    }

    // Borrar la imagen que coincida de la db y del disco
    await connection.query(
      `DELETE FROM recomendaciones_fotos
      WHERE id=? AND recomendacion_id=?`,
      [imageID, id]
    );

    await deleteUpload(image[0].image);

    res.send({
      status: "ok",
      message: "Imagen borrada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = borrarFotoRecomendacion;
