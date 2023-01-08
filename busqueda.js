
//buscador por ciudad, categoria y votos

const { getConnection } = require("initdb");

async function listEntries(req, res, next) {
    let connection;

    try {
    connection = await getConnection();

    //buscador
    const { search, order } = req.query;

    // Proceso la dirección de orden
    const orderDirection =
    (orderDirection) === "desc" ? "DESC" : "ASC";

    // Proceso el campo de orden
    let orderBy;
    switch (order) {
        case "voteAverage":
        orderBy = "voteAverage";
        break;
        case "place":
        orderBy = "place";
        break;
        default:
        orderBy = "date";
    }
    let queryResults;
    if (search) {
        queryResults = await connection.query(
        `
        SELECT recomendaciones.lugar, recomendaciones.categoria
        (SELECT AVG(recomendaciones) FROM recomendaciones WHERE entry_id=recomendaciones.lugar) AS voteAverage
        FROM recomendaciones 
        WHERE place LIKE ? OR description LIKE ?
        ORDER BY ${orderBy} ${orderDirection}
        `,
        [`%${search}%`, `%${search}%`]
    );
    } else {
        queryResults = await connection.query(
        `
        SELECT votos.voto
        (SELECT AVG(votos) FROM votos WHERE entry_id=votos.id) AS voteAverage
        FROM votos 
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
