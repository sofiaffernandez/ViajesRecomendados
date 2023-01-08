# Viajes Recomendados


## DESCRIPCIÓN

Implementar una API que permita gestionar un portal donde los usuarios puedan publicar recomendaciones de viaje de sitios o experiencias poco conocidas.
### ENDPOINTS
ANÓNIMO (no hace falta verifcar el usuario):
// Buscar recomendaciones por lugar, categoría
// Poder ordenar los resultados de búsqueda por votos
// Ver detalle de una recomendación

#### Login (con email y password)
app.post("/usuario/login", loginUsuario);
**VALIDACIONES**
1. - Se extraen del body los datos requeridos
2. - Validar que se reciben los datos necesarios
3. - Se selecionan el usuario de la base de datos y comprobar que coiciden las contraseñas

#### Validar usuario
app.post("/usuario/validar", validarUsuario);
**VALIDACIONES**
1. - Se extraen del body los datos requeridos
2. - Se comprueba si esta validado
3. - Se actualiza la tabla marcando como activo al usuario 

#### Registro (nombre, email y password)
app.post("/usuario/crear", nuevoUsuario);
**VALIDACIONES**
1. - Se extraen del body los datos requeridos
2. - Comprobamos que no existe un usuario con ese mismo email en la base de datos
3. - Enviamos un mensaje de confirmación de registro
4. - Metemos el usuario en la base de datos sin activar

USUARIOS REGISTRADOS (hay que verificar el usuario antes):
#### Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto)
app.post("/recomendacion", esUsuario, nuevaRecomendacion);
**VALIDACIONES**
1. - Validamos que sea un usuario registrado
2. - Validamos los datos introduccidos según el esquema
3. - Se extraen del body los datos requeridos
4. - Se guardan en la tabla recomendaciones
5. - Si hay imagenes, cada una se procesa y se guarda en la tabla recomendaciones_fotos con la referencia a la entrada


#### Votar recomendaciones de otros usuarios
app.post("/recomendacion/:id/votar", esUsuario, recomendacionExiste, votarRecomendacion);
**VALIDACIONES**
1. - Validamos que sea un usuario registrado
2. - Validamos que la recomendación existe
3. - Validamos los datos introduccidos según el esquema
4. - Se extraen del body los datos requeridos
5. - Comprobamos que no hay ningún voto previo con el usuario
6. - Guardamos el voto en la base de datos 

#### Gestión del perfil (con posibilidad de añadir a los campos de registro una foto de perfil)
app.put("/usuario/:id", esUsuario, editarUsuario);
**VALIDACIONES**
1. - Validamos que sea un usuario registrado
2. - Validamos la información del body según esquemas
3. - Validamos que el id del usuario es el mismo que firma la petición
4. - Comprobamos que existe
5. - Si enviamos foto, se guarda el avatar
6. - Si cambiamos el email, lo validamos
7. - Actualizamos el usuario en la base de datos

#### Borrar sus recomendaciones
app.delete("/recomendacion/:id", esUsuario, recomendacionExiste, borrarRecomendacion);
**VALIDACIONES**
1. - Validamos que sea un usuario registrado
2. - Validamos que la recomendación existe
3. - Seleccionamos la recomendación con la id
4. - Comprobamos que el usuario puede editar esta entrada
5. - Seleccionamos la imagen
6. - Borramos la imagen que coincida de la petición y la base de datos


#### Borrar las fotos de sus  recomendaciones
app.delete("/recomendacion/:id/fotos", esUsuario, recomendacionExiste, borrarFotoRecomendacion);
**VALIDACIONES**
1. - Validamos que sea un usuario registrado
2. - Validamos que la recomendación existe
3. - Seleccionamos la recomendación con la id
4. - Comprobamos que el usuario puede editar esta entrada
5. - Borramos la recomendación
6. - Borramos la imagenes asociadas
7. - Borramos los votos asociados
8. - Borramos los comentarios asociados

#### Publicar comentarios en las recomendaciones
app.post("/recomendacion/:id/commentar", esUsuario, recomendacionExiste, comentarRecomendacion);
**VALIDACIONES**
1. - Validamos que sea un usuario registrado
2. - Validamos que la recomendación existe
3. - Validamos los datos introduccidos
4. - Comprobamos que la entrada existe
5. - Guardamos el comentario en la base de datos


------------
#### Iniciar la API
1. Instalar los node_modules con el comando **"npm install"**.
    Los módulos son los siguientes;
    > - eslint; detecta errores de código
    > - prettier; formatea el código
    > -  express;creación de servidor http.
    > - express-fileupload: leer los ficheros
    > - body-parser; leer información 
    > - mysql2; acceso a la base de datos
    > - dotenv; Guarda las variables de entorno
    > - bcrypt; Encripta las contraseñas.
    > - jsonwebtoken; crea un token de inicio de sesión 
    > - morgan; captura las solicitudes HTTP
    > - sharp; manejo de imagenes
    > - uuid; genera nombres únicos 
    > - path; manejo de rutas
    > - joi: validación de esquemas
    > - nodemon; reinicia el servidor cada vez que se efecuta un cambio
    
    
2. Modificar el archivo ***.env*** con los datos necesarios. (Por ejemplo, se puede necesitar modificar la contraseña). 

------------
#### Postman
En los archivos de la API se encuentra el archivo ***API_SHOP.postman_collection.json*** . Se puede descargar para importar en nuestro postman personal y así probar los diferentes endpoints.

------------
