require("dotoenv").config();
const express =requiere ("express");
const app =express();
//Importar controllers recomendation
const deteleRecomendation = require ("./controllers/Recomendation/deteleRecomendations")
const publishRecomendation = require ("./controllers/Recomendation/publishRecomendation")
const publishComments = require ("./controllers/Recomendation/publishComment")
const vote = require ("./controllers/Recomendation/vote")
const entryExist = require ("./controllers/Recomendation/entryExist")
//Importar controllers User
const editUser = require ("./controllers/User/editUser")

// ENDPOINTS DE CONTENIDO 

//ANÓNIMO (no hace falta verifcar el usuario):
// Buscar recomendaciones por lugar, categoría
// Poder ordenar los resultados de búsqueda por votos
// Ver detalle de una recomendación
// Login (con email y password)
// Registro (nombre, email y password)

//USUARIOS REGISTRADOS (hay que verificar el usuario antes):
// Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto)
app.post("/recomendation/:id/", /* hay que verificar el usuario antes */ publishRecomendation);

// Votar recomendaciones de otros usuarios
app.post("/recomendation/:id/votes", /* hay que verificar el usuario antes */ entryExist, vote);


// Gestión del perfil (con posibilidad de añadir a los campos de registro una foto de perfil)
app.put("/users/:id",/* hay que verificar el usuario antes */ editUser);

// Borrar sus recomendaciones
app.delete("/recomendation/:id", /* hay que verificar el usuario antes */ entryExist, deteleRecomendation);

// Publicar comentarios en las recomendaciones
app.post("/recomendation/:id/comments", /* hay que verificar el usuario antes */ entryExist, publishComments);

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

