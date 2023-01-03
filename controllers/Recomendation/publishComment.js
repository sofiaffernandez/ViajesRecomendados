//Publicar comentarios 
const { getConnection } = require("../../db");
const createComment = require("./createRecomendacion");
const getRecomendacionById = require("./getRecomendacionById");
const { generateError } = require ("../../helpers")

const publishComments = async (req, res, next) => {
    let connection;
  
    try {
      connection = await getConnection();
      const { id }= req.params
      const { comentario } = req.body;
      // Comprobar que la recomendación existe 
      await getRecomendacionById(id);
    
      await createComment(comentario)
  
      res.send({
        status: "ok",
        data: {
          id: result.insertId,
          comentario
        },
  
    })}
    catch (error) {
        next(error);
      }
  };
module.exports = publishComments