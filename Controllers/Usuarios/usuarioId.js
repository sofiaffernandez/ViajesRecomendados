const { generateError } = require('../../helpers');
const { getConnection } = require('../../DB/db');

const getUsuarioById = async (id = true) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
        `
        SELECT id, email, created_at 
        FROM usuarios 
        WHERE id = ?
      `,
        [id]
      );
  
      if (result.length === 0) {
        throw generateError('No hay ningún usuario con esa id', 404);
      }
  
      return result[0];
    } finally {
      if (connection) connection.release();
    }
  };

module.exports = getUsuarioById