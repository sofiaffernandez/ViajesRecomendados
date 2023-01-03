require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;
  try {
    connection = await getConnection();
  // await connection.query(` CREATE DATABASE IF NOT EXISTS ProyectoViajes`)
    // await connection.query(`USE DATABASE ProyectoViajes`)
    
    console.log('Borrando tablas existentes');
    await connection.query('DROP TABLE IF EXISTS usuarios');
    await connection.query('DROP TABLE IF EXISTS recomendaciones');
    await connection.query('DROP TABLE IF EXISTS votos');
    await connection.query('DROP TABLE IF EXISTS comentarios');


    console.log('Creando tablas');

    // Tabla usuarios:
    await connection.query(`
    CREATE TABLE usuarios (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        contraseña VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        avatar VARCHAR(100)
        )`
    );
  
   //Tabla recomendaciones:
    await connection.query(`
    CREATE TABLE recomendaciones (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(50) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        lugar VARCHAR(50) NOT NULL,
        entradilla VARCHAR(255) NOT NULL,
        texto TEXT NOT NULL,
        foto VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        usuario_id INTEGER,
	      FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        )`
    );

    //Tabla votos:
    await connection.query(`
    CREATE TABLE votos (
        voto_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
        voto INTEGER NOT NULL,
        recomendacion_id INTEGER,
        usuario_id INTEGER,
        voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recomendacion_id) REFERENCES recomendaciones (id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )`
    );
    
   //Tabla comentarios:
    await connection.query(`
    CREATE TABLE comentarios (
      comentario_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	    comentario TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	    recomendacion_id INTEGER,
	    usuario_id INTEGER,
	    FOREIGN KEY (recomendacion_id) REFERENCES recomendaciones (id),
	    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )`
    );

  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();