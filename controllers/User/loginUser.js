const { getConnection } = require("../../db");
const jsonwebtoken = require("jsonwebtoken");

const { generateError } = require("../../helpers");

const loginUserSchema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
      .error(
        generateError("El campo email debe existir y ser un email válido", 400)
      ),
    password: Joi.string()
      .min(8)
      .required()
      .error(
        generateError(
          "El campo password debe existir y ser mayor de 8 caracteres",
          400
        )
      ),
  });
  
  
async function loginUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    // comprobar que se reciben los datos necesarios
    await loginUserSchema.validateAsync(req.body);

    const { email, password } = req.body;

    // Seleccionar el usuario de la base de datos y comprobar que las passwords coinciden
    const [dbUser] = await connection.query(
      `
      SELECT id,  
      FROM usuario
      WHERE email=? AND password=SHA2(?, 512)
    `,
      [email, password]
    );

    if (dbUser.length === 0) {
      throw generateError(
        "No hay ningún usuario registrado con ese email o la password es incorrecta",
        401
      );
    } 

    // Generar token con información del usuario
    const tokenInfo = {
      id: dbUser[0].id
    };

    const token = jsonwebtoken.sign(tokenInfo, process.env.SECRET, {
      expiresIn: "30d",
    });

    // Devolver el token
    res.send({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = loginUser;
