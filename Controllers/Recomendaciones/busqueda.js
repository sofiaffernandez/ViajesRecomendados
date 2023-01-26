const { getConnection } = require("../DB/db");

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
        orderBy = "voto";
        break;
    case "lugar":
        orderBy = "lugar";
        break;
    case "categoria":
        orderBy = "categoria";
        break;
    default:
        orderBy = "voto";
        break;
    }

    let queryResults;

    // Búsqueda por categoría y lugar
    if (categoria && lugar) {
        queryResults = await connection.query(
        `
        SELECT * FROM recommendations 
        WHERE lugar LIKE ? AND categoria LIKE ? 
        ORDER BY ${orderBy} ${orderDirection}
        `,
        [`%${lugar}%`, `%${categoria}%`]
    );
    } else {
      // Ordenar resultados de búsqueda por votos
        queryResults = await connection.query(
        `
        SELECT * FROM votos ORDER BY voto DESC;
        SELECT * FROM recomendaciones JOIN votos ON recomendaciones.id = votos.recomendacion_id ORDER BY votos.votos DESC";
        ORDER BY ${orderBy} ${orderDirection}`
    );
    }

    // Extraigo los resultados reales del resultado de la query
    const [result] = queryResults;

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