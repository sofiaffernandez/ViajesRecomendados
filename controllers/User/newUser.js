const { getConnection } = require("../../db");
const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createUser = async (email, contraseña, nombre) => {
  let connection;

  try {
    connection = await getConnection();
    //Comprobar que no exista otro usuario con ese email
    const [user] = await connection.query(
      ` SELECT id FROM usuarios WHERE email = ? `,
      [email]
    );

    if (user.length > 0) {
      throw generateError(
        'Ya existe un usuario en la base de datos con ese email',
        409
      );
    }

    //Encriptar la password
    const passwordHash = await bcrypt.hash(contraseña, 8);

    //Crear el usuario
    const [newUser] = await connection.query(
      `INSERT INTO usuarios (email, contraseña, nombre) VALUES(?, ?, ?)`,
      [email, passwordHash, nombre]
    );

    //Devolver la id
    return newUser.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createUser
};