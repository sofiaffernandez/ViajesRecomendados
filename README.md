# Viajes Recomendados


## DESCRIPCIÓN

Implementar una API que permita gestionar un portal donde los usuarios puedan publicar recomendaciones de viaje de sitios o experiencias poco conocidas.
### ENDPOINTS
ANÓNIMO (no hace falta verifcar el usuario):
// Buscar recomendaciones por lugar, categoría
// Poder ordenar los resultados de búsqueda por votos
// Ver detalle de una recomendación
// Login (con email y password)
// Registro (nombre, email y password)

USUARIOS REGISTRADOS (hay que verificar el usuario antes):
#### Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto)
app.post("/recomendation", publicaRecomendacion);

#### Votar recomendaciones de otros usuarios
app.post("/recomendation/:id/votes", vote);


#### Gestión del perfil (con posibilidad de añadir a los campos de registro una foto de perfil)
app.put("/users/:id", editUser);

#### Borrar sus recomendaciones
app.delete("/recomendation/:id",  deleteRecomendacionControlador);

#### Publicar comentarios en las recomendaciones
app.post("/recomendation/:id/comments", /* hay que verificar el usuario antes */  publishComments);



------------
#### Iniciar la API
1. Instalar los node_modules con el comando **"npm install"**.
2. Modificar el archivo ***.env*** con los datos necesarios. (Por ejemplo, se puede necesitar modificar la contraseña). 

------------
