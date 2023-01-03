const { getConnection } = require("../../db");
const createRecomendacion = async (titulo, categoria, lugar, entradilla, texto, foto = '') => {
    let connection;
    
    try {
      connection = await getConnection();
    
      const [result] = await connection.query(
        `
        INSERT INTO recomendaciones (titulo, categoria, lugar, entradilla, texto, foto, created_at)
        VALUES(?,?,?,?,?,?, UTC_TIMESTAMP)
      `,
        [titulo, categoria, lugar, entradilla, texto, foto]
      );
      
    return result.insertId;
      } finally {
      if (connection) connection.release();
    }
  };
module.exports = createRecomendacion