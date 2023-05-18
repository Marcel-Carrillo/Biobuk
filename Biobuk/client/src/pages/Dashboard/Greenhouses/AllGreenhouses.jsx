import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Card, ProgressBar, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiobukContext } from "../../../context/BiobukContext";
import "./AllGreenhouses.scss";

export const AllGreenhouses = () => {
  const { user } = useContext(BiobukContext);
  const [zones, setZones] = useState();
  const [greenhouses, setGreenhouses] = useState();
  const { farmer_id } = useParams();
  const navigate = useNavigate();

  const createGreenhouse = () => {
    navigate(`/createGreenhouse/${farmer_id}`);
  };

  /**
   *  Obtiene y almacena una lista de invernaderos asociados a un agricultor específico
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/greenhouses/getAllgreenhouses/${farmer_id}`)
      .then((res) => {
        setGreenhouses(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Row className="allGreenhouses">
      <Col xs={12}>
        <h1>Invernaderos</h1>
      </Col>
      <Col xs={12}>
        <Button className="bio-btn-primary" onClick={createGreenhouse}>
          Crear Invernadero
        </Button>
        <Button className="bio-btn-primary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Col>
      <Col>
        <Row>
          {greenhouses &&
            greenhouses.map((elem) => {
              return (
                <Col key={elem.greenhouse_id} xs={12} md={6} lg={4}>
                  <Card>
                    <h2>{elem.name_greenhouse}</h2>
                    <p>Año: {elem.year}</p>
                    <p>CO2: {elem.co2}%</p>
                    <ProgressBar now={elem.co2} variant="warning" />
                    <p>Humedad del suelo: {elem.humidity_soil}%</p>
                    <ProgressBar now={elem.humidity_soil} variant="info" />
                    <p>Humedad del aire: {elem.humidity_air}%</p>
                    <ProgressBar now={elem.humidity_air} variant="info" />
                    <p>Infección: {elem.infected}%</p>
                    <ProgressBar now={elem.infected} variant="danger" />
                    <Button
                      className="bio-btn-primary"
                      onClick={() =>
                        navigate(`/oneGreenhouse/${elem.greenhouse_id}`)
                      }
                    >
                      Ir al Invernadero
                    </Button>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Col>
    </Row>
  );
};
