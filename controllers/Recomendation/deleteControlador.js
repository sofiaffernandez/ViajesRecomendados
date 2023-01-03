const deleteRecomendaciones = require("./deteleRecomendations");
const getRecomendacionById = require("./getRecomendacionById");
const { generateError } = require("../../helpers");


const deleteRecomendacionControlador = async (req, res, next) => {
    try {
      //req.userId
      const { id } = req.params;
  
      // Conseguir la información de la recomendación que quiero borrar
      const recomendacion = await getRecomendacionById(id);
  
      // Comprobar que el usuario del token es el mismo que la creo
      if (req.userId !== recomendacion.usuario_id) {
        throw generateError(
          'Estás intentando borrar una recomendación que no es tuya',
          401
        );
      }
  
      // Borrar la recomendación
      await deleteRecomendaciones(id);
  
      res.send({
        status: 'ok',
        message: `La recomendación, sus votos y comentarios, con id: ${id} fue borrado`,
      });
    } catch (error) {
      next(error);
    }
  };

  module.exports = deleteRecomendacionControlador