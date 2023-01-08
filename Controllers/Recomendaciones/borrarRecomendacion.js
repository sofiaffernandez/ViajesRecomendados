const { getConnection } = require("../../DB/db");
const { deleteUpload, generateError } = require("../../helpers");

async function borrarRecomendacion(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { id } = req.params;

    // Comprobar que existe esa id y si no dar error404
    const [current] = await connection.query(
      `SELECT usuario_id
      FROM recomendaciones
      WHERE id=? `,
      [id]
    );

    if (current[0].user_id !== req.auth.id && req.auth.role !== "admin") {
      throw generateError("No tienes permisos para borrar esta entrada", 403);
    }

    // Borrar la recomendación de la tabla
    await connection.query(
      `DELETE FROM recomendaciones
      WHERE id=?`,
      [id]
    );

    // Seleccionar posibles imagenes asociadas
    const [images] = await connection.query(
      `SELECT foto
      FROM recomendaciones_fotos
      WHERE recomendacion_id=?`,
      [id]
    );

    // Borra los ficheros
    for (const image of images) {
      await deleteUpload(image.image);
    }

    // Borrar imágenes de la tabla
    await connection.query(
      `DELETE FROM recomendaciones_fotos
      WHERE recomendacion_id=?`,
      [id]
    );

    // Borrar votos asociados a esa entrda en la tabla votos
    await connection.query(
      `DELETE FROM votos
      WHERE recomendacion_id=?`,
      [id]
    );

    res.send({
      status: "ok",
      message: `La recomendacion ${id} fue borrada y también sus votos e imágenes`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = borrarRecomendacion;
