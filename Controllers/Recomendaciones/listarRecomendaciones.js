const { getConnection } = require("../../DB/db");

const listarTodasRecomendaciones = async (req, res, next) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(`
      SELECT recomendaciones.id, recomendaciones.titulo, recomendaciones.categoria, recomendaciones.lugar, recomendaciones.entradilla, recomendaciones.texto, recomendaciones.created_at, recomendaciones_fotos.foto, AVG(votos.voto) AS votos FROM recomendaciones LEFT JOIN usuarios on recomendaciones.autor_id = usuarios.id LEFT JOIN recomendaciones_fotos on recomendaciones.id = recomendaciones_fotos.recomendacion_id LEFT JOIN votos ON recomendaciones.id = votos.recomendacion_id GROUP BY recomendaciones.id ORDER BY recomendaciones.created_at DESC
      `);

      res.send({
        status: "ok",
        data: result,
      });
  
    }  catch (error) {
        next(error);
    }finally {
      if (connection) connection.release();
    }
  };
  module.exports = listarTodasRecomendaciones