const { getConnection } = require("../../DB/db");

async function verDetalleUsuario (req, res, next) {
    let connection;
    try {
      connection = await getConnection();
    const { id } = req.params;

    
    // Comprobar que el usuario existe y si no dar un 404
    const [entry] = await connection.query(
        `SELECT id
        FROM usuarios
        WHERE id=?`,
        [id]
    );
    
    //Selecionar datos usuario creador
    const datosUsuario = await connection.query (
      `SELECT usuarios.*
        FROM usuarios
        WHERE id=?`,
        [id]
)
      // seleccionar recomendaciones
        const datosRecomendacionesUsuario = await connection.query (
          `   SELECT recomendaciones.*
          FROM recomendaciones
          INNER JOIN usuarios
          ON recomendaciones.autor_id = usuarios.id
          WHERE usuarios.id = ?`,
            [id]
    )
     // seleccionar comentarios
     const datosComentariosUsuarios = await connection.query (
        `SELECT comentarios.*
        FROM comentarios
        INNER JOIN usuarios on usuarios.id = comentarios.usuario_id
        WHERE usuarios.id = ?`,
          [id]
  )
  


  
    const detalle  = { datosUsuario, datosRecomendacionesUsuario, datosComentariosUsuarios }
  
    res.send({
        status: "ok",
        data: { detalle,
            datosRecomendacionesUsuario, datosUsuario, datosComentariosUsuarios
        },
    });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = verDetalleUsuario;
