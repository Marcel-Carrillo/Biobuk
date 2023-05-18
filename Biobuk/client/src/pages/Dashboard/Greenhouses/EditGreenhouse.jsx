import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiobukContext } from "../../../context/BiobukContext";

const initialValue = {
  co2: "",
  deleted: "",
  fertilize_system: "",
  fertilize_type: "",
  greenhouse_id: "",
  growing: "",
  health: "",
  humidity_air: "",
  humidity_soil: "",
  infected: "",
  irrigation_system: "",
  light_system: "",
  name_greenhouse: "",
  owner_user_id: "",
  phytosan_system: "",
  production: "",
  seed_brand: "",
  seed_lot: "",
  soil_quality: "",
  temperature: "",
  windows: "",
  year: "",
};

export const EditGreenhouse = () => {
  const { user } = useContext(BiobukContext);
  const { greenhouse_id } = useParams();
  const [greenhouse, setGreenhouse] = useState({});
  const [editedGreenhouse, setEditedGreenhouse] = useState(initialValue);
  const [message, setMessage] = useState();
  const navigate = useNavigate();

  /**
   * Sincroniza los valores introducidos en los inputs con el innitialValue
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGreenhouse({ ...editedGreenhouse, [name]: value });
  };

  /**
   * Edita un invernadero y en caso de que los campos introducidos sean incorrectos, saldrá un mensaje de error.
   * Los campos de la edición de los invernaderos están limitados según el usuario (0 para agricultor, 1 para propietario y 2 para administrador)
   */
  const editGreenhouse = (e) => {
    e.preventDefault();

    if (editedGreenhouse.year < 1900 || editedGreenhouse.year > 2154) {
      setMessage("No es una fecha válida");
      setEditedGreenhouse({
        ...editedGreenhouse,
        ["year"]: new Date().getFullYear(),
      });
    } else if (
      editedGreenhouse.infected < 0 ||
      editedGreenhouse.infected > 100 ||
      editedGreenhouse.humidity_soil < 0 ||
      editedGreenhouse.humidity_soil > 100 ||
      editedGreenhouse.humidity_air < 0 ||
      editedGreenhouse.humidity_air > 100 ||
      editedGreenhouse.co2 < 0 ||
      editedGreenhouse.co2 > 100
    ) {
      setMessage("Los campos numericos están comprendidos del 0 al 100");
    } else if (
      editedGreenhouse.name_greenhouse !== "" &&
      editedGreenhouse.year !== "" &&
      editedGreenhouse.seed_brand !== "" &&
      editedGreenhouse.production !== "" &&
      editedGreenhouse.fertilize_type !== ""
    ) {
      if (user?.type === 0) {
        axios
          .put(
            `http://localhost:4000/users/farmer/editGreenhouse/${greenhouse_id}`,
            editedGreenhouse
          )
          .then((res) => {
            setGreenhouse(res.data);
            console.log(res);
            navigate(`/oneGreenhouse/${greenhouse_id}`);
          })
          .catch((err) => console.log(err));
      } else if (user?.type === 2) {
        axios
          .put(
            `http://localhost:4000/users/admin/editGreenhouse/${greenhouse_id}`,
            editedGreenhouse
          )
          .then((res) => {
            setGreenhouse(res.data);
            navigate(`/oneGreenhouse/${greenhouse_id}`);
          })
          .catch((err) => console.log(err));
      }
    } else {
      setMessage("Rellena los campos obligatorios");
    }
  };

  /**
   * Elimina un invernadero
   */
  const deleteGreenhouse = () => {
    axios
      .post(
        `http://localhost:4000/users/farmer/deleteGreenhouse/${greenhouse_id}`
      )
      .then((res) => {
        if (user.type === 0) {
          navigate(`/farmerProfile/${user.user_id}`);
        } else if (user.type === 2) {
          navigate(`/admin/allGreenhouses`);
        }
      })
      .catch((err) => console.log(err));
  };

  /**
   * Trae toda la información de un invernadero
   */
  useEffect(() => {
    axios
      .get(
        `http://localhost:4000/greenhouses/getOneGreenhouse/${greenhouse_id}`
      )
      .then((res) => setEditedGreenhouse(res.data[0]))
      .catch((err) => console.log(err));
  }, []);

  /**
   * Hace que pases de un input a otro pulsando la tecla intro
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const inputs = Array.from(document.querySelectorAll("input"));
      const index = inputs.indexOf(e.target);
      inputs[index + 1].focus();
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="primeraCol">
            <div className="cpal">
              <h1>Edita tu invernadero</h1>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Nombre del Invernadero*</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="Nombre del invernadero"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="name_greenhouse"
                    value={editedGreenhouse?.name_greenhouse}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicYear">
                  <Form.Label>Año*</Form.Label>
                  <Form.Control
                    className="label"
                    type="number"
                    placeholder="Año"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="year"
                    value={editedGreenhouse?.year}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicProduction">
                  <Form.Label>Cultivo*</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="Cultivo"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="production"
                    value={editedGreenhouse?.production}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicBrand">
                  <Form.Label>Marca de la Semilla*</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="Marca de la semilla"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="seed_brand"
                    value={editedGreenhouse?.seed_brand}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicFertilize">
                  <Form.Label>Tipo de Fertilizante*</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="Tipo de fertilizante"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="fertilize_type"
                    value={editedGreenhouse?.fertilize_type}
                  />
                </Form.Group>
                {user?.type === 2 && (
                  <>
                    <Form.Group className="mb-3" controlId="formBasicGrowing">
                      <Form.Label>Etapa de Crecimiento</Form.Label>
                      <Form.Control
                        className="label"
                        type="text"
                        placeholder="Etapa de crecimiento"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="growing"
                        value={editedGreenhouse?.growing}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCO2">
                      <Form.Label>CO2</Form.Label>
                      <Form.Control
                        className="label"
                        type="number"
                        placeholder="CO2"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="co2"
                        value={editedGreenhouse?.co2}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicHumiditySoil"
                    >
                      <Form.Label>Humedad del Suelo</Form.Label>
                      <Form.Control
                        className="label"
                        type="number"
                        placeholder="Humedad del suelo"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="humidity_soil"
                        value={editedGreenhouse?.humidity_soil}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicHumidityAir"
                    >
                      <Form.Label>Humedad del Aire</Form.Label>
                      <Form.Control
                        className="label"
                        type="number"
                        placeholder="Humedad del aire"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="humidity_air"
                        value={editedGreenhouse?.humidity_air}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicSoilQuality"
                    >
                      <Form.Label>Calidad del Suelo</Form.Label>
                      <Form.Control
                        className="label"
                        type="text"
                        placeholder="Calidad del suelo"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="soil_quality"
                        value={editedGreenhouse?.soil_quality}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicTemperature"
                    >
                      <Form.Label>Temperatura</Form.Label>
                      <Form.Control
                        className="label"
                        type="number"
                        placeholder="Temperatura"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="temperature"
                        value={editedGreenhouse?.temperature}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicIrrigationSystem"
                    >
                      <Form.Label>Sistema de Irrigación</Form.Label>
                      <Form.Control
                        className="label"
                        type="text"
                        placeholder="Sistema de irrigación"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="irrigation_system"
                        value={editedGreenhouse?.irrigation_system}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicLightSystem"
                    >
                      <Form.Label>Sistema de Iluminado</Form.Label>
                      <Form.Control
                        className="label"
                        type="text"
                        placeholder="Sistema de iluminado"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="light_system"
                        value={editedGreenhouse?.light_system}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicFertilizeSystem"
                    >
                      <Form.Label>Sistema de Fertilización</Form.Label>
                      <Form.Control
                        className="label"
                        type="text"
                        placeholder="Tipo de fertilizante"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="fertilize_system"
                        value={editedGreenhouse?.fertilize_system}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicHealth">
                      <Form.Label>Salud del Cultivo</Form.Label>
                      <Form.Control
                        className="label"
                        type="text"
                        placeholder="Salud del cultivo"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="health"
                        value={editedGreenhouse?.health}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicPhysosanSystem"
                    >
                      <Form.Label>Sistema Fitosanitario</Form.Label>
                      <Form.Control
                        className="label"
                        type="text"
                        placeholder="Sistema fitosanitario"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="phytosan_system"
                        value={editedGreenhouse?.phytosan_system}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicSeedLot">
                      <Form.Label>Lote de Semilla</Form.Label>
                      <Form.Control
                        className="label"
                        type="text"
                        placeholder="Lote de semilla"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="seed_lot"
                        value={editedGreenhouse?.seed_lot}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicWindows">
                      <Form.Label>Organización de Ventanas</Form.Label>
                      <Form.Control
                        className="label"
                        type="text"
                        placeholder="Organización de ventanas"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="windows"
                        value={editedGreenhouse?.windows}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicInfection">
                      <Form.Label>Nivel de Infección</Form.Label>
                      <Form.Control
                        className="label"
                        type="number"
                        placeholder="Nivel de infección"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        name="infected"
                        value={editedGreenhouse?.infected}
                      />
                    </Form.Group>
                  </>
                )}
              </Form>
              <Col className="d-flex justify-content-between mb-2">
                <Button
                  className="bio-btn-primary"
                  type="submit"
                  onClick={editGreenhouse}
                >
                  Guardar
                </Button>
                <Button variant="danger" onClick={deleteGreenhouse}>
                  Eliminar invernadero
                </Button>
              </Col>
              {message && (
                <h1 className="alert alert-danger text-center">{message}</h1>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
