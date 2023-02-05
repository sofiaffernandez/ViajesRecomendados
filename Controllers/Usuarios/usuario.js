const getUsuarioById = require("./usuarioId");
const getMeController = async (req, res, next) => {
    try {
      const usuario = await 
      getUsuarioById(req.userId, false);
  
      res.send({
        status: 'ok',
        data: usuario,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports =  {
    getMeController
}