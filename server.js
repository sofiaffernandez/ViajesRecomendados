const cors = require("cors");
const path = require("path");
// Módulo que carga las variables del archivo .env en las variables de entorno
require("dotenv").config({ path: path.join(__dirname, "./.env") });

// Módulo para la creación de servidor http.
// Definición de aplicación Express.
const express =require("express");
const app =express();


// MIddleware log de eventos de express.
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
// Log de peticiones a la consola
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use('/public', express.static('public'));


// Procesado de body tipo json
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Procesado de body tipo form-data
app.use(fileUpload());

app.use(cors({origin: 'http://localhost:3000'}))


  
//Middleware para comprobar si es usuario
const esUsuario = require("./Middlewares/esUsuario")
const recomendacionExiste = require("./Middlewares/recomendacionExiste")
const helpers = require("./helpers");

//Importar controllers
    //Recomendaciones
    //Borrar foto de la recomendación
    const borrarFotoRecomendacion = require("./Controllers/Recomendaciones/borrarFotoRecomendacion")
    //Borrar la recomendación
    const borrarRecomendacion = require("./Controllers/Recomendaciones/borrarRecomendacion")
    //Comentar una recomendación
    const comentarRecomendacion = require("./Controllers/Recomendaciones/comentarRecomendaciones")
    //Publicar una recomendación nueva
    const nuevaRecomendacion = require("./Controllers/Recomendaciones/nuevaRecomendacion")
    //Votar la recomendación
    const votarRecomendacion = require("./Controllers/Recomendaciones/votarRecomendacion")
    
    
    //buscador recomendaciones
    const listEntries = require("./Controllers/Recomendaciones/busqueda")


    //buscador por voto
    const voteAverage = require("./Controllers/Recomendaciones/busqueda")


    //detalles recomendaciones
    const verDetalle = require("./Controllers/Recomendaciones/detalles")
    const verFoto = require("./Controllers/Recomendaciones/verFotosRecomendacion")
    //listar todas las recomendaciones
    const listarTodasRecomendaciones = require("./Controllers/Recomendaciones/listarRecomendaciones");

    //Usuarios
    //Editar usuario (cambiar foto de perfil)
    const editarUsuario = require("./Controllers/Usuarios/editarUsuario")
    //Hacer login de un usuario ya registrado
    const loginUsuario = require("./Controllers/Usuarios/loginUsuario")
    //Crear un nuevo usuario
    const nuevoUsuario = require("./Controllers/Usuarios/nuevoUsuario")
    //Cambiar la contraseña de un usuario ya registrado
    const cambioContraseña = require ("./Controllers/Usuarios/cambioContraseña");
    const listarRecomendacionesUsuario = require("./Controllers/Usuarios/listarRecomendacionesUsuario.js");
const verDetalleUsuario = require("./Controllers/Usuarios/verDetalleUsuario");
const listarTodosUsuarios = require("./Controllers/Usuarios/listarTodosUsuarios");
const deleteUser = require("./Controllers/Usuarios/eliminarUsuario");
const borrarComentarios = require("./Controllers/Recomendaciones/borrarComentarios");
const votosMedios = require("./Controllers/Recomendaciones/votosMedios");
const editarRecomendacion = require("./Controllers/Recomendaciones/editarRecomendacion");


    // ENDPOINTS DE CONTENIDO 

//ANÓNIMO (no hace falta verifcar el usuario):
// Buscar recomendaciones por lugar, categoría
app.get("/recomendaciones/buscar", listEntries)

//Ver recomendaciones en lista 
app.get("/recomendaciones", listarTodasRecomendaciones)

app.get("/usuarios", listarTodosUsuarios)
//Ver todas las recomendaciones de un usuario 
app.get("/usuario/:id/recomendaciones", listarRecomendacionesUsuario)
// Ver detalle de una recomendación
app.get("/recomendacion/:id/detalle", verDetalle) 
//ver fotos de una recomendacion 
app.get('public/:imagen', verFoto  );
//Ver datos de un usuario
app.get("/usuario/:id/detalle", verDetalleUsuario )
//Obtener votos medios
app.get("/votos/:id", votosMedios )

// Login (con email y password)
app.post("/usuario/login", loginUsuario);

// Registro (nombre, email y password)
app.post("/usuario/crear", nuevoUsuario);

//USUARIOS REGISTRADOS (hay que verificar el usuario antes):

// Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto)
app.get("/recomendacion/formulario", esUsuario, nuevaRecomendacion)
app.post("/recomendacion/crear", esUsuario, nuevaRecomendacion);

// Votar recomendaciones de otros usuarios
app.post("/recomendacion/:id/votar", esUsuario, recomendacionExiste, votarRecomendacion);

//Ver tu propio perfil 



// Gestión del perfil (con posibilidad de añadir a los campos de registro una foto de perfil)
app.put("/usuario/:id", esUsuario, editarUsuario);

app.put("/recomendacion/:id/editar", editarRecomendacion)

//Gestión del perfil (cambio de contraseña)
app.post("/usuario/:id/contrasena", esUsuario,  cambioContraseña);

// Borrar sus recomendaciones
app.delete("/recomendacion/:id", esUsuario, recomendacionExiste, borrarRecomendacion);

// Borrar usuario
app.delete("/usuario/:id", esUsuario, deleteUser );
// Borrar comentario
app.delete("/comentario/:id", esUsuario,recomendacionExiste, borrarComentarios );

// Publicar comentarios en las recomendaciones
app.post("/recomendacion/:id/comentar", esUsuario, recomendacionExiste, comentarRecomendacion);




//Middleware 
app.use ((error, req, res, next) =>{
    console.error (error);
    res.status(error.httpStatus || 500).send({
        status:"error",
        message:error.message,
    })
})
//No existe
app.use ((req, res) => {
  res.status(404).send({
  status: "error",
  message: "Not found",
  });
});

const port = process.env.PORT;


app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port} `);
});

