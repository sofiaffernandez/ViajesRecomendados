const { getConnection } = require("../../DB/db");
const { randomString, sendMail, generateError } = require("../../helpers");
const { newUserSchema } = require("../../Schemas/Usuarios/schemasUsuarios");

async function newUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    //Validar el usuario según el esquema
    await newUserSchema.validateAsync(req.body);

    const { nombre, email, contraseña } = req.body;

    // comprobar que no existe un usuario con ese mismo email en la base de datos
    const [existingUser] = await connection.query(
      `SELECT id 
      FROM usuarios
      WHERE email=?`,
      [email]
    );

    if (existingUser.length > 0) {
      throw generateError(
        "Ya existe un usuario en la base de datos con ese email",
        409
      );
    }

    // enviar un mensaje de confirmación de registro al email indicado
    const registrationCode = randomString(40);
    const validationURL = `${process.env.PUBLIC_HOST}/users/validate/${registrationCode}`;

    //Enviamos la url anterior por mail
    try {
      await sendMail({
        email,
        title: "Valida tu cuenta de usuario en la app de recomendaciones de Viajes",
        content: `Para validar tu cuenta de usuario en la app recomendaciones de viajes haz click aquí: ${validationURL}`,
      });
    } catch (error) {
      throw generateError("Error en el envío de mail", 500);
    }

    // meter el nuevo usuario en la base de datos sin activar
    await connection.query(
      `INSERT INTO usuario(nombre, email, contraseña, created_at, codigo_validacion)
      VALUES(?, ?, SHA2(?, 512), UTC_TIMESTAMP, ?)`,
      [nombre, email, contraseña, registrationCode]
    );

    res.send({
      status: "ok",
      message:
        "Usuario registrado. Mira tu email para activarlo. Mira en la carpeta de SPAM si no lo encuentras",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newUser;
