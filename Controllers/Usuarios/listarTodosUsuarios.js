const { getConnection } = require("../../DB/db");

const listarTodasRecomendaciones = async (req, res, next) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(`
      SELECT u.id, u.nombre, u.activo, u.email, u.contraseña, u.avatar, u.created_at, u.codigo_validacion, u.eliminado, u.ultimo_cambio_contraseña, u.codigo_recuperacion, r.titulo, r.categoria, r.lugar, r.entradilla, r.texto, rf.foto, v.voto, c.comentario 
FROM usuarios u 
LEFT JOIN recomendaciones r ON u.id = r.autor_id 
LEFT JOIN recomendaciones_fotos rf ON r.id = rf.recomendacion_id 
LEFT JOIN votos v ON u.id = v.usuario_id 
LEFT JOIN comentarios c ON u.id = c.usuario_id
ORDER BY created_at DESC;
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