const { getConnection } = require("../../DB/db");
const { generateError } = require("../../helpers");

async function votosMedios(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { id } = req.params;
    const [current] = await connection.query(
       `SELECT AVG(voto) 
       AS votos_medios 
       FROM votos 
       WHERE recomendacion_id = ?`,
       [id]);
    if (current.length === 0) {
        throw generateError("No existen votos aún", 404);
      }

    res.send({
      status: "ok",
      data: current,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = votosMedios;