# Viajes Recomendados


## DESCRIPCIÓN

Implementar una API que permita gestionar un portal donde los usuarios puedan publicar recomendaciones de viaje de sitios o experiencias poco conocidas.

### ENDPOINTS

### ANÓNIMO (no hace falta verifcar el usuario):
#### Buscar recomendaciones por lugar, categoría
app.get("/recomendacion/buscar", listEntries)
**VALIDACIONES**
> - Creo el buscador
> - Proceso la direccion del orden
> - Busco por categoria y lugar

#### Poder ordenar los resultados de búsqueda por votos
app.get("/recomendacion/ordenar", voteAverage)
**VALIDACIONES**
> - Creo el buscador
> - Proceso la direccion del orden
> - Busco por votos

#### Ver detalle de una recomendación
app.get("/recomendacion/detalle", verDetalle)
**VALIDACIONES**
> - Comprobar que la entrada existe
> - Seleccionamos datos, fotos, comentarios, votos

#### Login (con email y password)
app.post("/usuario/login", loginUsuario);

**VALIDACIONES**
> - Se extraen del body los datos requeridos
> - Validar que se reciben los datos necesarios
> - Se selecionan el usuario de la base de datos y comprobar que coiciden las contraseñas


**Registro (nombre, email y password)**
app.post("/usuario/crear", nuevoUsuario);

#### VALIDACIONES
> - Se extraen del body los datos requeridos
> - Comprobamos que no existe un usuario con ese mismo email en la base de datos
> - Enviamos un mensaje de confirmación de registro
> - Metemos el usuario en la base de datos sin activar

### USUARIOS REGISTRADOS (hay que verificar el usuario antes):

**Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto)**
app.post("/recomendacion", esUsuario, nuevaRecomendacion);

#### VALIDACIONES
> - Validamos que sea un usuario registrado
> - Validamos los datos introduccidos según el esquema
> - Se extraen del body los datos requeridos
> - Se guardan en la tabla recomendaciones
> - Si hay imagenes, cada una se procesa y se guarda en la tabla recomendaciones_fotos con la referencia a la entrada


**Votar recomendaciones de otros usuarios**
app.post("/recomendacion/:id/votar", esUsuario, recomendacionExiste, votarRecomendacion);

#### VALIDACIONES
> - Validamos que sea un usuario registrado
> - Validamos que la recomendación existe
> - Validamos los datos introduccidos según el esquema
> - Se extraen del body los datos requeridos
> - Comprobamos que no hay ningún voto previo con el usuario
> - Guardamos el voto en la base de datos 

**Gestión del perfil (con posibilidad de añadir a los campos de registro una foto de perfil)**
app.put("/usuario/:id", esUsuario, editarUsuario);

#### VALIDACIONES
> - Validamos que sea un usuario registrado
> - Validamos la información del body según esquemas
> - Validamos que el id del usuario es el mismo que firma la petición
> - Comprobamos que existe
> - Si enviamos foto, se guarda el avatar
> - Si cambiamos el email, lo validamos
> - Actualizamos el usuario en la base de datos

**Borrar sus recomendaciones**
app.delete("/recomendacion/:id", esUsuario, recomendacionExiste, borrarRecomendacion);

#### VALIDACIONES
> - Validamos que sea un usuario registrado
> - Validamos que la recomendación existe
> - Seleccionamos la recomendación con la id
> - Comprobamos que el usuario puede editar esta entrada
> - Seleccionamos la imagen
> - Borramos la imagen que coincida de la petición y la base de datos


**Borrar las fotos de sus  recomendaciones**
app.delete("/recomendacion/:id/fotos", esUsuario, recomendacionExiste, borrarFotoRecomendacion);

#### VALIDACIONES
> - Validamos que sea un usuario registrado
> - Validamos que la recomendación existe
> - Seleccionamos la recomendación con la id
> - Comprobamos que el usuario puede editar esta entrada
> - Borramos la recomendación
> - Borramos la imagenes asociadas
> - Borramos los votos asociados
> - Borramos los comentarios asociados

**Publicar comentarios en las recomendaciones**
app.post("/recomendacion/:id/commentar", esUsuario, recomendacionExiste, comentarRecomendacion);

#### VALIDACIONES
> - Validamos que sea un usuario registrado
> - Validamos que la recomendación existe
> - Validamos los datos introduccidos
> - Comprobamos que la entrada existe
> - Guardamos el comentario en la base de datos


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
#### SQL
Table: usuarios

Columns:
> - id int AI PK
> - nombre varchar(200)
> - activo tinyint(1)
> - email varchar(200)
> - contraseña varchar(512)
> - avatar varchar(500)
> - created_at datetime
> - codigo_validacion varchar(100)
> - eliminado tinyint(1)
> - ultimo_cambio_contraseña datetime
> - codigo_recuperacionvarchar(100)

Table: recomendaciones

Columns:
> - id int AI PK
> - titulo varchar(50)
> - categoria varchar(50)
> - lugar varchar(50)
> - entradilla varchar(255)
> - texto text
> - created_at datetime
> - autor_id int

Table: recomendaciones_fotos

Columns:
> - id int AI PK
> - foto varchar(64)
> - created_at datetime
> - recomendacion_id int


Table: comentarios

Columns:
> - id int AI PK
> - comentario text
> - created_at datetime
> - lastUpdate datetime
> - usuario_id int
> - recomendacion_id int

Table: votos

Columns:
> - id int AI PK
> - voto tinyint
> - created_at datetime
> - lastUpdate datetime
> - usuario_id int
> - recomendacion_id int
