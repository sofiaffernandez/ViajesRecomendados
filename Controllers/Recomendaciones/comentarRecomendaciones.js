const { getConnection } = require("../../DB/db");
const { newComentarioSchema } = require("../../Schemas/Recomendaciones");
async function votarRecomendacion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    
    const { id } = req.params;
    const { comentario } = req.body;
    
    //Validación de los datos introducidos
      await newComentarioSchema.validateAsync(req.body);
      
    // Comprobar que la entrada existe y si no dar un 404
    const [entry] = await connection.query(
      `SELECT id
      FROM recomendaciones
      WHERE id=?`,
      [id]
    );

    // Guardar el comentario en la base de datos
    await connection.query(
      `INSERT INTO comentario(recomendacion_id, comentario, created_at, usuario_id, lastUpdate)
      VALUES(?, ?, UTC_TIMESTAMP, ?, UTC_TIMESTAMP)`,
      [id, comentario, req.auth.id]
    );

    res.send({
      status: "ok",
      message: `Se guardó el voto (${voto} puntos) a la recomendación ${id}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = votarRecomendacion;
