const { getConnection } = require("../../db");
//const { generateError } = require("../../helpers");

const deleteRecomendaciones = async (id) => {
    let connection;
    try {
      connection = await getConnection();
      const { id } = req.params;
//Borrar recomendaciones
      await connection.query(
        `DELETE FROM recomendaciones WHERE id = ?`,
        [id]
      );
//Borrar votos
const [votos] = await connection.query(
  `
  SELECT * FROM votos WHERE recomendacion_id = ?
`,
  [id]
);
    if (votos.length > 0 ) {
      await connection.query( `
        DELETE FROM votos WHERE recomendacion_id=? `,
        [id]
      );
    }
//Borrar comentarios
const [comentarios] = await connection.query(
  `
  SELECT * FROM comentarios WHERE recomendacion_id = ?
`,
  [id]
);
if (comentarios.length > 0) {
  await connection.query( `
  DELETE FROM comentarios
  WHERE recomendacion_id=? `,
  [id]
);

}
      return;
    }
    finally {
      if (connection) connection.release();
    }
  };
  module.exports = deleteRecomendaciones