const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "./.env") });
const express =require("express");
const app =express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

app.use(express.json());
// Procesado de body tipo json
app.use(bodyParser.json());

// Procesado de body tipo form-data
app.use(fileUpload());


//Importar controllers recomendation
const deteleRecomendation = require ("./controllers/Recomendation/deteleRecomendations")
const deleteRecomendacionControlador = require ("./controllers/Recomendation/deleteControlador")
const publicaRecomendacion = require ("./controllers/Recomendation/publicaRecomendacion")
const publishComments = require ("./controllers/Recomendation/publishComment")
const vote = require ("./controllers/Recomendation/vote")

//Importar controllers User
const editUser = require ("./controllers/User/editUser");


app.get('/', (req, res) => {
    res.send('Prueba de que funciona el Postman')
  })
  
// ENDPOINTS DE CONTENIDO 

//ANÓNIMO (no hace falta verifcar el usuario):
// Buscar recomendaciones por lugar, categoría
// Poder ordenar los resultados de búsqueda por votos
// Ver detalle de una recomendación
// Login (con email y password)
// Registro (nombre, email y password)

//USUARIOS REGISTRADOS (hay que verificar el usuario antes):
// Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto)
app.post("/recomendation", publicaRecomendacion);

// Votar recomendaciones de otros usuarios
app.post("/recomendation/:id/votar", /* hay que verificar el usuario antes */  vote);


// Gestión del perfil (con posibilidad de añadir a los campos de registro una foto de perfil)
app.put("/users/:id",/* hay que verificar el usuario antes */ editUser);

// Borrar sus recomendaciones
app.delete("/recomendation/:id", /* hay que verificar el usuario antes */  deleteRecomendacionControlador);

// Publicar comentarios en las recomendaciones
app.post("/recomendation/:id/commentar", /* hay que verificar el usuario antes */  publishComments);

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

