const fs = require('fs');
const path = require("path");
async function verFoto(req, res, next)  {
    try {
    const imagen = req.params.imagen;
    const pathImagen = path.join(__dirname, '/ImagenesProyectoViajes/' + imagen);
   
    if (fs.existsSync(pathImagen)) {
      res.sendFile(pathImagen);
    } else {
      res.status({
        ok: false,
        mensaje: 'Imagen no encontrada'
      });
    }
  } catch (error) {
    next(error);
  }}
  module.exports =verFoto