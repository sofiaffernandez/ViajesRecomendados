const { getConnection } = require("../../DB/db");
const { generateError } = require("../../helpers");

async function verDetalle(req, res, next) {
    let connection;
    try {
      connection = await getConnection();
    const { id } = req.params;

    
    // Comprobar que la entrada existe y si no dar un 404


    const [entry] = await connection.query(
        `SELECT id
        FROM recomendaciones
        WHERE id=?`,
        [id]
    );
      //Selecionar datos recomendacion
        const datosRecomendacion = await connection.query (
          `SELECT *
            FROM recomendaciones
            WHERE id=?`,
            [id]
    )
    //Selecionar datos usuario creador
    const datosUsuario = await connection.query (
      `SELECT usuarios.*
        FROM usuarios
        INNER JOIN recomendaciones
        ON usuarios.id= recomendaciones.autor_id
        WHERE recomendaciones.id=?`,
        [id]
)
      // seleccionar fotos recomendacion
        const fotosRecomendacion = await connection.query (
            `SELECT *
            FROM recomendaciones_fotos
            WHERE recomendacion_id=?`,
            [id]
    )
      //selecionar votos recomendacion 
        const datosVotos = await connection.query (
          `SELECT *
            FROM votos
            WHERE recomendacion_id=?`,
            [id]
    )
    //votos average
    const mediaVotos = await connection.query(
      `SELECT AVG(voto)
      FROM votos
      WHERE recomendacion_id=?`,
      [id]
    )
      // selecionar comentarios recomendacion 
        const datosComentarios = await connection.query (
          `SELECT *
            FROM comentarios
            WHERE recomendacion_id=?`,
            [id]
    )
  
    const detalle  = { datosRecomendacion, datosUsuario,  fotosRecomendacion, datosComentarios, datosVotos, mediaVotos }
  
    res.send({
        status: "ok",
        data: {
            detalle
        },
    });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = verDetalle;
