
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


// Procesado de body tipo json
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Procesado de body tipo form-data
app.use(fileUpload());


app.get('/', (req, res) => {
    res.send('Prueba de que funciona el Postman')
  })
  
//Middleware para comprobar si es usuario
const esUsuario = require("./Middlewares/esUsuario")
const recomendacionExiste = require("./Middlewares/recomendacionExiste")
const helpers = require("./helpers");

//Importar controllers
    //Recomendaciones
    const borrarFotoRecomendacion = require("./Controllers/Recomendaciones/borrarFotoRecomendacion")
    const borrarRecomendacion = require("./Controllers/Recomendaciones/borrarRecomendacion")
    const comentarRecomendacion = require("./Controllers/Recomendaciones/comentarRecomendaciones")
    const nuevaRecomendacion = require("./Controllers/Recomendaciones/nuevaRecomendacion")
    const votarRecomendacion = require("./Controllers/Recomendaciones/votarRecomendacion")

    //Usuarios
    const editarUsuario = require("./Controllers/Usuarios/editarUsuario")
    const loginUsuario = require("./Controllers/Usuarios/loginUsuario")
    const nuevoUsuario = require("./Controllers/Usuarios/nuevoUsuario")
    const cambioContraseña = require ("./Controllers/Usuarios/cambioContraseña")

    // ENDPOINTS DE CONTENIDO 

//ANÓNIMO (no hace falta verifcar el usuario):
// Buscar recomendaciones por lugar, categoría
app.get("/recomendacion/buscar", )
// Poder ordenar los resultados de búsqueda por votos
app.get("/recomendacion/ordenar", )
// Ver detalle de una recomendación
app.get("/recomendacion/detalle", ) 

// Login (con email y password)
app.post("/usuario/login", loginUsuario);

// Registro (nombre, email y password)
app.post("/usuario/crear", nuevoUsuario);

//USUARIOS REGISTRADOS (hay que verificar el usuario antes):
// Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto)
app.post("/recomendacion", esUsuario, nuevaRecomendacion);

// Votar recomendaciones de otros usuarios
app.post("/recomendacion/:id/votar", esUsuario, recomendacionExiste, votarRecomendacion);


// Gestión del perfil (con posibilidad de añadir a los campos de registro una foto de perfil)
app.put("/usuario/:id", esUsuario, editarUsuario);
//Gestión del perfil (cambio de contraseña)
app.post("/usuario/contrasena", esUsuario,  cambioContraseña);

// Borrar sus recomendaciones
app.delete("/recomendacion/:id", esUsuario, recomendacionExiste, borrarRecomendacion);

// Borrar las fotos de sus  recomendaciones
app.delete("/recomendacion/:id/fotos", esUsuario, recomendacionExiste, borrarFotoRecomendacion);

// Publicar comentarios en las recomendaciones
app.post("/recomendacion/:id/commentar", esUsuario, recomendacionExiste, comentarRecomendacion);


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

const port = process.env.PORT || 4000;
console.log(process.env.PORT)

app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port} `);
});

