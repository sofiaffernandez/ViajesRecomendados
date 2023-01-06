const { getConnection } = require("../../db");
const createComment = async (userId, recomendacion_id, comentario = "") => {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.query(
        `INSERT INTO comentarios (usuario_id, recomendacion_id, comentario, created_at)
        VALUES(?, ?, ? , UTC_TIMESTAMP)`,
        [userId, recomendacion_id, comentario]
      );
      
    return result.insertId;
      } finally {
      if (connection) connection.release();
    }
  };
module.exports = createComment