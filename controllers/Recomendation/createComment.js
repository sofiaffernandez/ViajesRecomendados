const { getConnection } = require("../../db");
const createComment = async (comentario = "") => {
    let connection;
    
    try {
      connection = await getConnection();
    
      const [result] = await connection.query(
        `
        INSERT INTO recomendaciones (comentario, created_at)
        VALUES(?, UTC_TIMESTAMP)
      `,
        [comentario]
      );
      
    return result.insertId;
      } finally {
      if (connection) connection.release();
    }
  };
module.exports = createComment