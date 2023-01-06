//Publicar comentarios 
const { getConnection } = require("../../db");
const createComment = require("./createRecomendacion");
const { generateError } = require ("../../helpers")

const publishComments = async (req, res, next) => {
    let connection;
  
    try {
      connection = await getConnection();
      const { id }= req.params
      const { comentario } = req.body;
      // Comprobar que la recomendación existe 
      const [entry] = await connection.query(
        `SELECT id 
        FROM recomendaciones
        WHERE id=? `,
        [id]
      );
      if (entry.length > 0) {
        throw generateError(
          `La recomendación que quieres comentar no existe `,
          404
        );
      }
      await createComment(req.userId, recomendacion_id,
         comentario)
  
      res.send({
        status: "ok",
        message: "El comentario ha sido creado correctamente",
      
  
    })}
    catch (error) {
        next(error);
      }
  };
module.exports = publishComments