
//buscador por ciudad, categoria y votos

const { getConnection } = require("../ViajesRecomendados/DB/db");

async function listEntries(req, res, next) {
    let connection;

    try {
    connection = await getConnection();

    //buscador
    const { categoria, lugar } = req.query;

    // Proceso la dirección de orden
    const orderDirection =
    (orderDirection) === "desc" ? "DESC" : "ASC";

    // Proceso el campo de orden
    let orderBy;
    switch (order) {
        case "voteAverage":
        orderBy = "voteAverage";
        break;
        case "lugar":
        orderBy = "lugar";
        break;
    }
    let queryResults;
    //buscador por categoria y lugar 
    if (categoria, lugar) {
        queryResults = await connection.query(
        `
        SELECT * FROM recommendations WHERE lugar =? AND categoria =? 
        `,
        [`%${lugar}%`, `%${categoria}%`]
    );
    } else {
        //ordenar resultados de busqueda por votos
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
