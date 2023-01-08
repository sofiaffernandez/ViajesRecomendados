
//buscador por ciudad, categoria y votos

const { getConnection } = require("db");

async function listEntries(req, res, next) {
    let connection;

    try {
    connection = await getConnection();
    //  Querystring:
    //  search: para listar solo las entradas que contengan su valor en place o description
    //  order: para ordernar el listado por voteAverage, place o date
    //  direction: para la dirección de la ordenación desc o asc
    const { search, order, direction } = req.query;

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
        (SELECT AVG(voto) FROM votos WHERE entry_id=votos.id) AS voteAverage
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
