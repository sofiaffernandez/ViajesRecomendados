const { getConnection } = require("db");


const deteleRecomendation = async (id) => {
    let connection;
    try {
      connection = await getConnection();
  
      await connection.query(
        `
        DELETE FROM recomendacion WHERE id = ?
      `,
        [id]
      );
  
      return;
    }
    catch (error) {
        next(error);
      }
    finally {
      if (connection) connection.release();
    }
  };
  module.exports= deteleRecomendation