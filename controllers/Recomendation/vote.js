const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

const votoSchema = Joi.object().keys({
  vote: Joi.number()
    .min(1)
    .max(5)
    .required()
    .error(
      generateError(
        "El campo voto debe existir y tener un valor entre 1 y 5 (incluídos)",
        400
      )
    ),
});

async function voteEntry(req, res, next) {
    let connection;
  
    try {
      connection = await getConnection();
  
      await votoSchema.validateAsync(req.body);
  
      const { id } = req.params;
      const { vote } = req.body;
  
      // Comprobar que la entrada existe y si no dar un 404
      const [entry] = await connection.query(
        `
        SELECT id 
        FROM recomendaciones
        WHERE id=?
      `,
        [id]
      );
  
      // Comprobar que no hay ningún voto previo con mi usuario
      const [existingVote] = await connection.query(
        `
        SELECT id
        FROM votos
        WHERE recomendacion_id=? AND usuario_id=?
      `,
        [id, req.auth.id]
      );
  
      if (existingVote.length > 0) {
        throw generateError(
          `Ya votaste la entrada "${entry[0].place}" con tu usuario`,
          403
        );
      }
  
      // Guardar el voto en la base de datos
      await connection.query(
        `
        INSERT INTO votos(recomendacion_id, voto, usuario_id, voted_at)
        VALUES(?, ?, ?, UTC_TIMESTAMP)
      `,
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
module.exports = voteEntry;
