

const { getConnection } = require("../../DB/db");

async function listEntries(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    // Proceso los parámetros de búsqueda
    const { categoria, lugar, order } = req.query;

    let orderDirection;
if (order === "DESC") {
  orderDirection = "DESC";
} else if (order === "ASC"){
  orderDirection = "ASC";
} else {
  orderDirection = "DESC"
}
console.log(orderDirection)
    let queryResults;

    // Búsqueda por categoría y lugar
    if (categoria && lugar) {
      queryResults = await connection.query(
        `
        SELECT recomendaciones.*, AVG(votos.voto) AS votos 
        FROM recomendaciones 
        LEFT JOIN votos ON recomendaciones.id = votos.recomendacion_id 
        WHERE lugar LIKE ? OR categoria LIKE ? 
        GROUP BY recomendaciones.id 
        ORDER BY votos ${orderDirection}

        `,
        [lugar, categoria]
      );
    } else if (categoria && !lugar) {
      queryResults = await connection.query(
        `
        SELECT recomendaciones.*, AVG(votos.voto) AS votos 
        FROM recomendaciones 
        LEFT JOIN votos ON recomendaciones.id = votos.recomendacion_id 
        WHERE categoria LIKE ? 
        GROUP BY recomendaciones.id 
        ORDER BY votos ${orderDirection}

        `,
        [categoria]
      );
    } else if (!categoria && lugar) {
      queryResults = await connection.query(
        `
        SELECT recomendaciones.*, AVG(votos.voto) AS votos 
        FROM recomendaciones 
        LEFT JOIN votos ON recomendaciones.id = votos.recomendacion_id 
        WHERE lugar LIKE ? 
        GROUP BY recomendaciones.id 
        ORDER BY votos ${orderDirection}

        `,
        [lugar]
      );
    }else if (!categoria && !lugar) {
        queryResults = await connection.query(
          `
          SELECT recomendaciones.*, AVG(votos.voto) AS votos 
          FROM recomendaciones 
          LEFT JOIN votos ON recomendaciones.id = votos.recomendacion_id 
          GROUP BY recomendaciones.id 
          ORDER BY votos ${orderDirection}
  
          `,
        );
        }
    // Extraigo los resultados reales del resultado de la query
    const result = queryResults[0];

    // Mando la respuesta
    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listEntries;