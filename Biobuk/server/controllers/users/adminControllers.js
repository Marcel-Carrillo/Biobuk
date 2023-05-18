const connection = require("../../config/db");

class adminControllers {
  // Hace una consulta a la base de datos que selecciona datos del usuario, producto, producto de zona
  // e invernadero de cada usuario
  //localhost:4000/users/admin/getAllFarmersProduct/:id
  getAllFarmersProduct = (req, res) => {
    const id = req.params.id;
    let sql = `SELECT user.name, user.lastname, user.user_id FROM user, product, zone_product, zone, greenhouse WHERE product.product_id = ${id} AND user.type = 0 AND greenhouse.owner_user_id = user.user_id AND greenhouse.greenhouse_id = zone.greenhouse_id AND zone.zone_id = zone_product.zone_id AND zone_product.product_id = product.product_id;`;
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      } else {
        res.status(200).json({ result });
      }
    });
  };

  // Inserta en la base de datos una nueva zona y selecciona toda la información antigua y nueva del
  // invernadero al cual añadimos la zona
  //localhost:4000/users/admin/createZone/:id_user/:id_greenhouse
  createZone = (req, res) => {
    const { id_user, id_greenhouse } = req.params;
    let { zone_name, extension } = req.body;

    let sql = `INSERT INTO zone (creator_user_id, greenhouse_id, zone_name, extension) VALUES (${id_user}, ${id_greenhouse}, "${zone_name}", "${extension}")`;
    let sql2 = `SELECT * FROM zone WHERE deleted = 0 && greenhouse_id = ${id_greenhouse}`;
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
    });
    // Manda el resultado de la información del invernadero con la nueva zona
    connection.query(sql2, (error, resultZone) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultZone);
    });
  };

  // Selecciona la información de todos los agricultores
  //localhost:4000/users/admin/getAllFarmers
  getAllFarmers = (req, res) => {
    let sql = `SELECT * FROM user WHERE type = 0`;
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      res.status(200).json(result);
    });
  };

  // Activa un usuario
  //localhost:4000/users/admin/enableUser/:id
  enableUser = (req, res) => {
    let { id } = req.params;
    let sql = `UPDATE user SET deleted = 0 WHERE user_id = ${id}`;
    let sql2 = `SELECT * from user WHERE type = 0`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
    });
    // Envía el resultado de la información de los agricultores
    connection.query(sql2, (error, resultUsers) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultUsers);
    });
  };

  // Desactiva un usuario
  //localhost:4000/users/admin/disableUser/:id
  disableUser = (req, res) => {
    let { id } = req.params;
    let sql = `UPDATE user SET deleted = 1 WHERE user_id = ${id}`;
    let sql2 = `SELECT * from user WHERE type = 0`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
    });
    // Envía la información editada de los agricultores
    connection.query(sql2, (error, resultUsers) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultUsers);
    });
  };

  // Elimina un comentario de manera lógica y selecciona todos los comentarios del producto de nuevo sin los comentarios borrados
  //localhost:4000/users/admin/deleteComment/:id
  deleteComment = (req, res) => {
    let { commentary_id, product_id } = req.params;
    let sql = `UPDATE commentary SET deleted = 1 WHERE commentary_id = ${commentary_id}`;
    let sql2 = `SELECT commentary.commentary_id, commentary.commentary_text, commentary.rating, commentary.product_id, commentary.user_id, user.name, user.lastname FROM commentary, user WHERE commentary.user_id = user.user_id AND commentary.product_id = ${product_id} && commentary.deleted = 0`;
    connection.query(sql, (error, result) => {
      if (error) throw error;
    });
    // Envía la información editada de los agricultores
    connection.query(sql2, (error, resultCommentary) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultCommentary);
    });
  };

  // Trae la cantidad de usuarios, productos e invernadero que hay registrados que no estén borrados
  //localhost:4000/users/admin/getAllCount
  getAllCount = (req, res) => {
    let sqlUsers =
      "select count(user_id) from user where deleted = 0 AND type = 0";
    let sqlProducts = "select count(product_id) from product where deleted = 0";
    let sqlGreenhouse =
      "select count(greenhouse_id) from greenhouse where deleted=0";

    // Envía el resultado del número de usuarios
    connection.query(sqlUsers, (error, resultUsers) => {
      if (error) throw error;
      // Envía el resultado del número de productos
      connection.query(sqlProducts, (error, resultProducts) => {
        if (error) throw error;
        // Envía el resultado del número de invernaderos
        connection.query(sqlGreenhouse, (error, resultGreenhouse) => {
          if (error) throw error;
          res
            .status(200)
            .json({ resultUsers, resultProducts, resultGreenhouse });
        });
      });
    });
  };

  // Edita la información de un invernadero
  //localhost:4000/users/admin/editGreenhouse/:greenhouse_id
  editGreenhouse = (req, res) => {
    let { greenhouse_id } = req.params;
    let {
      name_greenhouse,
      year,
      production,
      seed_brand,
      fertilize_type,
      growing,
      co2,
      humidity_soil,
      humidity_air,
      soil_quality,
      temperature,
      irrigation_system,
      light_system,
      fertilize_system,
      health,
      phytosan_system,
      seed_lot,
      windows,
      infected,
    } = req.body;

    // si alguno de los sistemas está vacío o no es "on" será "off"
    if (irrigation_system === "" || irrigation_system !== "on") {
      irrigation_system = "off";
    }
    if (light_system === "" || light_system !== "on") {
      light_system = "off";
    }
    if (fertilize_system === "" || fertilize_system !== "on") {
      fertilize_system = "off";
    }
    if (phytosan_system === "" || phytosan_system !== "on") {
      phytosan_system = "off";
    }
    if (windows === "" || windows !== "on") {
      windows = "off";
    }

    let sql = `UPDATE greenhouse SET name_greenhouse = "${name_greenhouse}", year = "${year}", production = "${production}", seed_brand = "${seed_brand}", fertilize_type = "${fertilize_type}", growing = "${growing}", co2 = ${co2}, humidity_soil = "${humidity_soil}", humidity_air = "${humidity_air}", soil_quality = "${soil_quality}", temperature = "${temperature}", irrigation_system = "${irrigation_system}", light_system = "${light_system}", fertilize_system = "${fertilize_system}", health = "${health}", phytosan_system = "${phytosan_system}", seed_lot = "${seed_lot}", windows = "${windows}", infected = ${infected}  WHERE greenhouse_id = ${greenhouse_id}`;

    let sql2 = `SELECT * FROM greenhouse WHERE greenhouse_id = ${greenhouse_id}`;
    connection.query(sql, (error, result) => {
      if (error) throw error;
    });
    // Envía el resultado de la información del invernadero editado
    connection.query(sql2, (error, resultGreenhouse) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultGreenhouse);
    });
  };

  // Trae la información de todos los invernaderos
  //localhost:4000/users/admin/getAllGreenhouses
  getAllGreenhouses = (req, res) => {
    let sql =
      "SELECT name_greenhouse, year, production, name, owner_user_id, greenhouse_id FROM greenhouse, user WHERE greenhouse.owner_user_id = user.user_id AND greenhouse.deleted = 0;";

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };
}

module.exports = new adminControllers();
