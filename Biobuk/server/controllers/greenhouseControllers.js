const connection = require("../config/db");

class greenhouseControllers {
  // Trae la información de de todos los invernaderos de un agricultor concreto
  //localhost:4000/greenhouses/getAllGreenhouses/:id
  getAllGreenhouses = (req, res) => {
    let { id } = req.params;
    let sql = `SELECT * FROM greenhouse WHERE owner_user_id = ${id} AND deleted = 0`;
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      res.status(200).json(result);
    });
  };

  // Trae la información de un invernadero concreto
  //localhost:4000/greenhouses/getOneGreenhouse/:id
  getOneGreenhouse = (req, res) => {
    let { greenhouse_id } = req.params;
    let sql = `SELECT * FROM greenhouse WHERE greenhouse_id = ${greenhouse_id} AND deleted = 0`;
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      res.status(200).json(result);
    });
  };

  // Trae la información de todas las zonas de un invernadero concreto
  //localhost:4000/greenhouses/getAllZones/:id
  getAllZones = (req, res) => {
    const greenhouse_id = req.params.greenhouse_id;

    let sql = `SELECT * FROM zone WHERE greenhouse_id = ${greenhouse_id} and deleted = 0`;

    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      res.status(200).json({ result });
    });
  };

  // Trae la información de una zona concreta
  //localhost:4000/greenhouses/getOneZone/:greenhouse_id
  getOneZone = (req, res) => {
    const zone_id = req.params.zone_id;

    let sqlZone = `SELECT * FROM zone WHERE greenhouse_id = ${zone_id} and deleted = 0`;
    let sqlZoneProduct = `SELECT * FROM zone_product WHERE zone_id = ${zone_id} and deleted = 0`;

    connection.query(sqlZone, (error, resultZone) => {
      if (error) {
        res.status(400).json({ error });
      }
      // Trae la información de los productos aplicados en dicha zona
      connection.query(sqlZoneProduct, (error2, resultZoneProduct) => {
        if (error2) {
          res.status(400).json({ error2 });
        }
        res.status(200).json({ resultZone, resultZoneProduct });
      });
    });
  };
}

module.exports = new greenhouseControllers();
