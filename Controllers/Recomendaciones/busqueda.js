const { getConnection } = require("../../DB/db");

async function listEntries(req, res, next) {
let connection;

try {
    connection = await getConnection();

    // Proceso los parámetros de búsqueda
    const { categoria, lugar, order } = req.query;

    // Proceso la dirección de orden
    const orderDirection = order === "desc" ? "DESC" : "ASC";

    // Proceso el campo de orden
    let orderBy;
    switch (order) {
    case "voto":
        orderBy = "votos";
        break;
    case "lugar":
        orderBy = "lugar";
        break;
    case "categoria":
        orderBy = "categoria";
        break;
    default:
        orderBy = "votos";
        break;
    }

    let queryResults;

    // Búsqueda por categoría y lugar
    if (categoria && lugar) {
        queryResults = await connection.query(
          `
          SELECT * FROM recomendaciones
          WHERE lugar LIKE ? OR categoria LIKE ? 
          ORDER BY ${orderBy} ${orderDirection}
          `,
          [`%${lugar}%`, `%${categoria}%`]
        );
    } else {
        // Ordenar resultados de búsqueda por votos
        queryResults = await connection.query(
          `
          SELECT recomendaciones.*, AVG(votos.voto) AS votos FROM recomendaciones
          LEFT JOIN votos ON recomendaciones.id = votos.recomendacion_id
          GROUP BY recomendaciones.id
          ORDER BY votos ${orderDirection}
          `
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