const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");
const getRecomendacionById = async (id) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
        `
        SELECT * FROM recomendaciones WHERE id = ?
      `,
        [id]
      );
  
      if (result.length === 0) {
        throw generateError(`La recomendación con id: ${id} no existe`, 404);
      }
  
      return result[0];
    } finally {
      if (connection) connection.release();
    }
  };

  module.exports =getRecomendacionById