//Publicar comentarios 
const { getConnection } = require("db");

const publishComments = async () => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
        `
        INSERT INTO recomendacionComentarios (comentarios)
        VALUE(?)
      `,
        [comentario]
      );

  
      res.send({
        status: "ok",
        data: {
          id: result.insertId,
          comentario
        },
  
    })}
    catch (error) {
        next(error);
      } finally {
      if (connection) connection.release();
    }
  };
module.exports = publishComments