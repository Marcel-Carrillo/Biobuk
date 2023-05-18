const host = "smtp.gmail.com";
const emailPpal = "ralbae.tic@gmail.com";
const passwordPpal = "xngsrcwjszjaokai";
// email y contraseña para el nodemailer

const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

class userControllers {

  //Para loguearse
  //localhost:4000/users/login
  login = (req, res) => {
    let { email, password, keepLogged } = req.body;
    //Seleccionamos al usuario que coincide con el email
    let sql = `SELECT * FROM user WHERE email = '${email}' AND deleted = 0`;
    keepLogged === true ? (keepLogged = null) : (keepLogged = "1d");

    connection.query(sql, (error, result) => {
      // console.log(result);
      //en caso de error en la consulta
      if (error) return res.status(400).json(error);
      //en caso de no encontrar un user con dicho o mail.
      if (!result || !result.length || result[0].is_deleted == 1) {
        res.status(401).json("Usuario no registrado");
      } else {
        //en caso de que el email sea CORRECTO
        const [user] = result;
        const hash = user.password;

        //capturo el user_id
        const user_id = user.user_id;

        //compramos contraseñas
        bcrypt.compare(password, hash, (error, response) => {
          if (error) res.status(400).JSON(error);
          //si las contraseñas coinciden
          if (response === true) {
            const token = jwt.sign(
              {
                user: {
                  email: user.email,
                  name: user.name,
                  id: user_id,
                  type: user.type,
                  img: user.img,
                },
              },
              process.env.SECRET,
              keepLogged === false && { expiresIn: keepLogged }
            );
            // console.log("este es el token");
            res.status(200).json({ token, user: result[0] });
            //si las contraseñas coinciden
          } else {
            res.status(401).json("El usuario o la contraseña son incorrectos");
          }
        });
      }
    });
  };

  //Para crear una cuenta
  //localhost:4000/users/register
  register = (req, res) => {
    const { name, lastname, email, password, type } = req.body;
    //Hasheamos la contraseña
    let saltRounds = 8;
    bcrypt.genSalt(saltRounds, function (err, saltRounds) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        let sql = `INSERT INTO user (name, lastname, dni, email, password, phone, address, type) VALUES ('${name}', '${lastname}', "", '${email}', '${hash}', "", "", ${type})`;
        //Llamamos a la base de datos para enviar el mail
        connection.query(sql, (error, result) => {
          if (error) {
            res.status(400).json({ error });
          } else {
            async function main() {
              let transporter = nodemailer.createTransport({
                host: host,
                port: 465,
                secure: true, // true para 465, false para otros puertos
                auth: {
                  user: emailPpal, // usuario etéreo generado
                  pass: passwordPpal, // contraseña etérea generada
                },
                result: result,
              });
              // Se envía mail con objeto definido de transporter
              let info = await transporter.sendMail({
                from: '"Biobuk" <biobuk@example.com>', // dirección del emisor
                to: `"${name}" ${email}`, // lista de remitentes
                subject: "Biobuk", // Asunto
                text: "Confirma tu cuenta", // Texto del body
                html: `<h1>¡Hola ${name}!</h1><br /><b>Haz click a la siguiente dirección de enlace o copiala y pégala en tu ordenador para confirmar tu cuenta</b> <a href="http://localhost:3000/confirmation/${result.insertId}">Haz click aquí</a>`, // html del body
              });
              console.log("Message sent: %s", info.messageId);
              // Mensaje enviado: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              // Previsualización solo disnponible cuando se envía a través de una cuenta etérea.
              console.log(
                "Preview URL: %s",
                nodemailer.getTestMessageUrl(info)
              );
              // URL de previsualización: https://ethereal.email/message/WaQKMgKddxQDoou...
            }
            main().catch(console.error);
            res.status(201).json(result);
          }
        });
      });
    });
  };

  //Para editar un usuario
  //localhost:4000/users/editOneUser/:id
  editOneUser = (req, res) => {
    let { id } = req.params;
    let { name, lastname, dni, phone, address } = JSON.parse(req.body.farmer);
    //Dos casuísticas, con y sin imagen
    let sql = `UPDATE user SET name = "${name}", lastname = "${lastname}", dni = "${dni}", phone = "${phone}", address = "${address}" WHERE user_id = ${id}`;
    if (req.file != undefined) {
      sql = `UPDATE user SET name = "${name}", lastname = "${lastname}", dni = "${dni}", phone = "${phone}", address = "${address}", user_img = "${req.file.filename}" WHERE user_id = ${id}`;
    }
    let sql2 = `SELECT * FROM user WHERE user_id = ${id} AND deleted = 0`;
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      } else {
        connection.query(sql2, (error, resultUser) => {
          error
            ? res.status(400).json({ error })
            : res.status(200).json(resultUser);
        });
      }
    })
  };

  //Para traer todos los datos de un usuario
  //localhost:4000/users/getOneUser/:id
  getOneUser = (req, res) => {
    const user_id = req.params.user_id;

    let sqlUser = `SELECT * FROM user WHERE user_id = ${user_id} and deleted = 0`;
    connection.query(sqlUser, (error, resultUser) => {
      if (error) {
        res.status(400).json({ error });
      }
      res.status(200).json({ resultUser });
    });
  };

  //Para activar el usuario seteándolo a 0
  //localhost:4000/users/activeAccount/:user_id
  activeAccount = (req, res) => {
    const { user_id } = req.params;

    let sql = `UPDATE user SET deleted = 0 WHERE user_id = ${user_id}`;

    connection.query(sql, (error, result) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json({ result });
    });
  };
}

module.exports = new userControllers();
