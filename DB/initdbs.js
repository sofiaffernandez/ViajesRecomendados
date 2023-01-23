require("dotenv").config();

const { getConnection } = require("./db");

let connection;

async function main() {
  try {
    // Conseguir conexión a la base de datos
    connection = await getConnection();

    // Borrar las tablas si existen 
    console.log("Borrando tablas");
    await connection.query("DROP TABLE IF EXISTS usuarios");
    await connection.query("DROP TABLE IF EXISTS recomendaciones");
    await connection.query("DROP TABLE IF EXISTS recomendaciones_fotos");
    await connection.query("DROP TABLE IF EXISTS votos");
    await connection.query("DROP TABLE IF EXISTS comentarios");
    // Crear las tablas de nuevo
    console.log("Creando tablas");
    // Tabla usuarios:
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(200),
        activo BOOLEAN NOT NULL DEFAULT false,
        email VARCHAR(200) UNIQUE NOT NULL,
        contraseña VARCHAR(512) NOT NULL,
        avatar VARCHAR(500),
        created_at DATETIME NOT NULL,
        codigo_validacion VARCHAR(100),
        eliminado BOOLEAN DEFAULT false,
        ultimo_cambio_contraseña DATETIME,
        codigo_recuperacion VARCHAR(100)
      );
    `);
    // Tabla recomendaciones:
    await connection.query(`
    CREATE TABLE recomendaciones (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(50) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        lugar VARCHAR(50) NOT NULL,
        entradilla VARCHAR(255) NOT NULL,
        texto TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        autor_id INTEGER,
	    FOREIGN KEY (autor_id) REFERENCES usuarios (id)
        );
    `);
    // Tabla fotos de recomendaciones:
    await connection.query(`
      CREATE TABLE recomendaciones_fotos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        foto VARCHAR(64) NOT NULL,
        created_at DATETIME NOT NULL,
        recomendacion_id INT NOT NULL,
        FOREIGN KEY (recomendacion_id) REFERENCES recomendaciones(id) ON DELETE CASCADE
      )
    `);
    // Tabla de votos:
    await connection.query(`
      CREATE TABLE votos (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        voto TINYINT NOT NULL,
        created_at DATETIME NOT NULL,
        lastUpdate DATETIME NOT NULL,
        usuario_id INT NOT NULL,
        FOREIGN KEY (usuario_id ) REFERENCES usuarios(id),
        recomendacion_id INT NOT NULL,
        FOREIGN KEY (recomendacion_id) REFERENCES recomendaciones(id) ON DELETE CASCADE
      )
    `);
    // Tabla de comentarios:
    await connection.query(`
    CREATE TABLE comentarios (
      id INTEGER PRIMARY KEY AUTO_INCREMENT,
      comentario TEXT NOT NULL, 
      created_at DATETIME NOT NULL,
      lastUpdate DATETIME NOT NULL,
      usuario_id INT NOT NULL,
      FOREIGN KEY (usuario_id ) REFERENCES usuarios(id),
      recomendacion_id INT NOT NULL,
      FOREIGN KEY (recomendacion_id) REFERENCES recomendaciones(id) ON DELETE CASCADE
    )
  `);
  
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Todo hecho, liberando conexión");
    if (connection) connection.release();
    process.exit();
  }
}

main();