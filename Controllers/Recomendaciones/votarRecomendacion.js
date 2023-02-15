
const { getConnection } = require("../../DB/db");
const { votoSchema } = require("../../Schemas/Recomendaciones/schemasRecomendaciones");
const { generateError } = require("../../helpers");

async function votarRecomendacion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //Validación de los datos introducidos
    await votoSchema.validateAsync(req.body.voto)

    const { id } = req.params;
    const voto = parseInt(req.body.voto);


    // Comprobar que la recomendación existe y si no dar un 404
    const [entry] = await connection.query(
      `SELECT id
      FROM recomendaciones
      WHERE id=?`,
      [id]
    );

      if(!entry.length){
      throw generateError('La entrada no existe', 404);
    }

    // Comprobar que no hay ningún voto previo con mi usuario
    const [existingVote] = await connection.query(
      `SELECT id
      FROM votos
      WHERE recomendacion_id=? AND usuario_id=?`,
      [id, req.auth.id]
    );

    if (existingVote.length > 0) {
      throw generateError(
        `Ya votaste esta recomendación con tu usuario`,
        403
      );
    }

    // Guardar el voto en la base de datos
    await connection.query(
      `INSERT INTO votos(recomendacion_id, voto, created_at, usuario_id, lastUpdate)
      VALUES(?, ?, UTC_TIMESTAMP, ?, UTC_TIMESTAMP)`,
      [id, voto, req.auth.id]
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

