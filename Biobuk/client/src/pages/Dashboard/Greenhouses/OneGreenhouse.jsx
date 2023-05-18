import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  ProgressBar,
  Row,
  Table,
  Form,
} from "react-bootstrap";
import { CrearSectorModal } from "../../../components/Modal/CrearSectorModal";
import { VerSectorModal } from "../../../components/Modal/VerSectorModal/VerSectorModal";
import { BiobukContext } from "../../../context/BiobukContext";
import "./OneGreenhouse.scss";
import { SingleProductRow } from "../../../components/Modal/VerSectorModal/SingleProductRow";

const innitialValue = {
  product_id: null,
  concentration: 0,
  application_date: new Date().toISOString().slice(0, 10),
};

export const OneGreenhouse = () => {
  const navigate = useNavigate();
  const { greenhouse_id } = useParams();
  const [greenhouse, setGreenhouse] = useState({});
  const [zones, setZones] = useState([]);
  const [show, setShow] = useState(false);
  const [zone, setZone] = useState();
  const [showZone, setShowZone] = useState(false);
  const { user } = useContext(BiobukContext);
  const [selectedZones, setSelectedZones] = useState([]);
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const [data, setData] = useState();
  const [newProduct, setNewProduct] = useState(innitialValue);
  const [product, setProduct] = useState();
  const [errorProduct, setErrorProduct] = useState(false);
  const [fertilizeOnOff, setfertilizeOnOff] = useState(
    greenhouse.fertilize_system
  );
  const [irrigationOnOff, setirrigationOnOff] = useState(
    greenhouse.irrigation_system
  );
  const [lightOnOff, setlightOnOff] = useState(greenhouse.light_system);
  const [phytoOnOff, setphytoOnOff] = useState(greenhouse.phytosan_system);
  const [windowsOnOff, setwindowsOnOff] = useState(greenhouse.windows);

  useEffect(() => {
    greenhouse.fertilize_system === "on" && setfertilizeOnOff("on");
    greenhouse.fertilize_system === "off" && setfertilizeOnOff("off");
    greenhouse.irrigation_system === "on" && setirrigationOnOff("on");
    greenhouse.irrigation_system === "off" && setirrigationOnOff("off");
    greenhouse.light_system === "on" && setlightOnOff("on");
    greenhouse.light_system === "off" && setlightOnOff("off");
    greenhouse.phytosan_system === "on" && setphytoOnOff("on");
    greenhouse.phytosan_system === "off" && setphytoOnOff("off");
    greenhouse.windows === "on" && setwindowsOnOff("on");
    greenhouse.windows === "off" && setwindowsOnOff("off");
  }, [greenhouse]);

  /**
   * Permite editar los datos de un invernadero.
   */
  const goToEditGreenhouse = () => {
    navigate(`/editGreenhouse/${greenhouse_id}`);
  };

  /**
   * Permite seleccionar distinas zonas de un invernadero para la aplicación de un producto.
   */
  const handleZoneClick = (zone, e) => {
    setErrorProduct(false);
    if (e.target.classList[0] === "card") {
      e.currentTarget.className === "card orange"
        ? (e.target.className = "card")
        : (e.target.className = "card orange");

      setSelectedZones((selectProv) => {
        if (selectProv.includes(zone)) {
          return selectProv.filter((selectedZones) => selectedZones !== zone);
        } else {
          return [...selectedZones, zone];
        }
      });
    }
  };

  /**
   * Registra los productos aplicados en una zona.
   */
  const handleAddProduct = (e) => {
    e.preventDefault();
    selectedZones.map((elem) => {
      return axios
        .post(
          `http://localhost:4000/users/farmer/addProductToZone/${elem.zone_id}`,
          newProduct
        )
        .then((res) => {
          document.getElementsByClassName(["card orange"])[0].className =
            "card";
          setSelectedZones([]);
          setErrorProduct(false);
        })
        .catch((err) => setErrorProduct(true));
    });
  };

  /**
   * Sincroniza los valores introducidos en los inputs con el innitialValue.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  /**
   * Muestra el formulario de añadir sección.
   */
  const handleShow = () => setShow(true);

  /**
   * Trae la información de los productos.
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/products/getAllProducts`)
      .then((res) => setProduct(res.data.result))
      .catch((err) => console.log(err));
  }, []);

  /**
   * Hace aparecer o desaparecer el botón de seleccionar zonas.
   */
  useEffect(() => {
    if (selectedZones.length > 0) {
      setMostrarBoton(true);
    } else {
      setMostrarBoton(false);
    }
  }, [selectedZones]);

  /**
   * Trae la información de los invernaderos.
   */
  useEffect(() => {
    axios
      .get(
        `http://localhost:4000/greenhouses/getOneGreenhouse/${greenhouse_id}`
      )
      .then((res) => setGreenhouse(res.data[0]))
      .catch((err) => console.log(err));
    axios
      .get(`http://localhost:4000/greenhouses/getAllZones/${greenhouse_id}`)
      .then((res) => {
        setZones(res.data.result);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {greenhouse && (
        <Row className="oneGreenhouse">
          <Col xs={12}>
            <h1>{greenhouse.name_greenhouse}</h1>
          </Col>
          {user?.type !== 1 && (
            <Col xs={12}>
              <Button className="bio-btn-primary" onClick={goToEditGreenhouse}>
                Editar
              </Button>
            </Col>
          )}
          <Col className="info" xs={12} lg={6}>
            <h2>{greenhouse.production}</h2>
            <p>{greenhouse.year}</p>
            <p>Marca de la semilla: {greenhouse.seed_brand}</p>
            <p>Lote de semillas: {greenhouse.seed_lot}</p>
            <p>Tipo de fertilizante: {greenhouse.fertilize_type}</p>
            <p>Crecimiento: {greenhouse.growing}</p>
            <p>Salud: {greenhouse.health}</p>
            <p>Calidad de la tierra: {greenhouse.soil_quality}</p>
            <p>Temperatura: {greenhouse.temperature} ºC</p>
            <Row className="gap-5">
              <Col>
                <p>CO2: {greenhouse.co2}%</p>
                <ProgressBar now={greenhouse.co2} variant="warning" />
                <p>Humedad del suelo: {greenhouse.humidity_soil}%</p>
                <ProgressBar now={greenhouse.humidity_soil} variant="info" />
              </Col>
              <Col>
                <p>Humedad del aire: {greenhouse.humidity_air}%</p>
                <ProgressBar now={greenhouse.humidity_air} variant="info" />
                <p>Infección: {greenhouse.infected}%</p>
                <ProgressBar now={greenhouse.infected} variant="danger" />
              </Col>
            </Row>
          </Col>
          <Col xs={12} lg={6} className="infoCard">
            <Card>
              <div>
                <figure>
                  {/* <a href="https://www.flaticon.com/free-icons/watering-can" title="watering can icons">Watering can icons created by Freepik - Flaticon</a> */}
                  <img src="\images\watering-can.png" />
                </figure>
                <article>
                  <p className="sistemas">Sistema de irrigación: </p>
                  <p className={irrigationOnOff}>
                    {greenhouse.irrigation_system}
                  </p>
                </article>
              </div>
              <div>
                <figure>
                  {/* <a href="https://www.flaticon.com/free-icons/greenhouse" title="greenhouse icons">Greenhouse icons created by Freepik - Flaticon</a> */}
                  <img src="\images\light.png" />{" "}
                </figure>
                <article>
                  <p className="sistemas">Sistema lumínico: </p>
                  <p className={lightOnOff}>{greenhouse.light_system}</p>
                </article>
              </div>
              <div>
                <figure>
                  {/* <a href="https://www.flaticon.com/free-icons/fertilizer" title="fertilizer icons">Fertilizer icons created by Freepik - Flaticon</a> */}
                  <img src="\images\fertilizer.png" />
                </figure>
                <article>
                  <p className="sistemas">Sistema de fertilizado: </p>
                  <p className={fertilizeOnOff}>
                    {greenhouse.fertilize_system}
                  </p>
                </article>
              </div>
              <div>
                <figure>
                  {/* credits: https://cdn-icons-png.flaticon.com/512/5221/5221638.png */}
                  <img src="\images\natural-product.png" />
                </figure>
                <article>
                  <p className="sistemas">Sistema fitosanitario: </p>
                  <p className={phytoOnOff}>{greenhouse.phytosan_system}</p>
                </article>
              </div>
              <div>
                <figure>
                  {/* <a href="https://www.flaticon.com/free-icons/window" title="window icons">Window icons created by Freepik - Flaticon</a> */}
                  <img src="\images\window.png" />
                </figure>
                <article>
                  <p className="sistemas">Ventanas:</p>{" "}
                  <p className={windowsOnOff}>{greenhouse.windows}</p>
                </article>
              </div>
            </Card>
          </Col>
          {user?.type === 0 && (
            <>
              {zones.length > 0 && !mostrarBoton && (
                <>
                  <h3>
                    <i>
                      *Para añadir uno o más productos a una zona, pulsa encima
                      de las zonas a las que quieres aplicar el producto y
                      completa los campos.
                    </i>
                  </h3>
                </>
              )}
              {mostrarBoton && (
                <Table
                  striped
                  borderless
                  hover
                  className="oneGreenhouse-table mx-auto"
                >
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Concentración</th>
                      <th>Fecha</th>
                      {user?.type === 0 && (
                        <>
                          <th colSpan={2}></th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map((row, index) => {
                        return (
                          <SingleProductRow
                            product={row}
                            zone_id={zone.zone_id}
                            setShow={setShow}
                          />
                        );
                      })}
                  </tbody>
                  {user?.type === 0 && (
                    <>
                      <tfoot>
                        <tr>
                          <td>
                            <Form.Select
                              name="product_id"
                              onChange={handleChange}
                            >
                              <option value="">---</option>
                              {product &&
                                product?.map((product) => {
                                  return (
                                    <option value={product.product_id}>
                                      {product.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Control
                              placeholder="Concentración"
                              type="number"
                              step="0.01"
                              name="concentration"
                              value={newProduct.concentration}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="date"
                              name="application_date"
                              value={newProduct.application_date}
                              onChange={handleChange}
                            />
                          </td>
                          <td className="text-center" colSpan={2}>
                            <Button
                              className="bio-btn-primary"
                              onClick={handleAddProduct}
                            >
                              Añadir producto
                            </Button>
                          </td>
                        </tr>
                      </tfoot>
                      {errorProduct && (
                        <h2 className="alert alert-danger text-center">
                          Selecciona producto y concentración
                        </h2>
                      )}
                    </>
                  )}
                </Table>
              )}
            </>
          )}
          {user?.type === 2 && (
            <Col xs={12}>
              <Button className="bio-btn-primary" onClick={handleShow}>
                Añadir sector
              </Button>
            </Col>
          )}
          <CrearSectorModal
            show={show}
            setShow={setShow}
            greenhouse_id={greenhouse_id}
            owner_user_id={greenhouse.owner_user_id}
            setZones={setZones}
          />
          {zones?.map((zone) => {
            return (
              <Col
                xs={12}
                md={6}
                lg={3}
                key={zone.zone_id}
                className="zoneList"
              >
                {user?.type === 0 && (
                  <Card onClick={(e) => handleZoneClick(zone, e)}>
                    <h3 className="h3zona">{zone.zone_name}</h3>
                    <p className="p3zona">{zone.extension}</p>
                    <Button
                      className="bio-btn-primary"
                      onClick={() => {
                        setZone(zone);
                        setShowZone(true);
                      }}
                    >
                      Ver zona
                    </Button>
                  </Card>
                )}
                {user?.type === 2 && (
                  <Card>
                    <h3 className="h3zona">{zone.zone_name}</h3>
                    <p className="p3zona">{zone.extension}</p>
                    <Button
                      className="bio-btn-primary"
                      onClick={() => {
                        setZone(zone);
                        setShowZone(true);
                      }}
                    >
                      Ver zona
                    </Button>
                  </Card>
                )}
              </Col>
            );
          })}
          <VerSectorModal
            show={showZone}
            setShow={setShowZone}
            zone={zone}
            name={zone?.zone_name}
          />
        </Row>
      )}
    </>
  );
};
