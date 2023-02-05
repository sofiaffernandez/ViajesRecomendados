const { getConnection } = require("../../DB/db");

const listarRecomendacionesUsuario = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
          SELECT recomendaciones.*, usuario.nombre 
          FROM recomendaciones 
          LEFT JOIN usuarios on recomendaciones.autor_id = usuario.id 
          WHERE recomendaciones.autor_id = ?
    `,
      [id]
    );

    return result;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listarRecomendacionesUsuario