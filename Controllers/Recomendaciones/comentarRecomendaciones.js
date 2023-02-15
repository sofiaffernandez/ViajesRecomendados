const { getConnection } = require("../../DB/db");
const { newComentarioSchema } = require("../../Schemas/Recomendaciones/schemasRecomendaciones");
const { generateError } = require("../../helpers");
async function votarRecomendacion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    
   await newComentarioSchema.validateAsync(req.body.comentario)
    const { id } = req.params;
    const { comentario } = req.body;
    // if ( comentario.length < 20 || comentario.length > 1000) {
    //   throw generateError('El campo comentario debe tener un valor entre 20 y 1000 caracteres (incluídos)', 400);
    // }
    
    // Comprobar que la entrada existe y si no dar un 404
    const [entry] = await connection.query(
      `SELECT id
      FROM recomendaciones
      WHERE id=?`,
      [id]
    );

    // Guardar el comentario en la base de datos
    await connection.query(
      `INSERT INTO comentarios(recomendacion_id, comentario, created_at, usuario_id, lastUpdate)
      VALUES(?, ?, UTC_TIMESTAMP, ?, UTC_TIMESTAMP)`,
      [id, comentario, req.auth.id]
    );

    res.send({
      status: "ok",
      message: `Se guardó el comentario a la recomendación ${id}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = votarRecomendacion;
