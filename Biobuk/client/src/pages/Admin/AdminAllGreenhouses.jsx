import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AdminAllGreenhouses.scss";


export const AdminAllGreenhouses = () => {
  const [greenhouses, setGreenhouses] = useState([]);
  const navigate = useNavigate();


  //Se trae todos los invernaderos de la base de datos
  useEffect(() => {
    axios
      .get("http://localhost:4000/users/admin/getAllGreenhouses")
      .then((res) => setGreenhouses(res.data))
      .catch((err) => console.log(err));
  }, []);

  
  return (
    <Row className="adminAllGreenhouses">
      <Col xs={12}>
        <h1 className="h1Naranja">Todos los invernaderos</h1>
      </Col>
      {greenhouses?.map((greenhouse) => {
        return (
          <Col
            key={greenhouse.greenhouse_id}
            xs={12}
            md={6}
            lg={3}
            className="mb-3 text-center d-flex flex-column justify-center"
          >
            <Card className="container2">
              <Card.Body className="card2">
                <Card.Title>{greenhouse.name_greenhouse}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {greenhouse.name}
                </Card.Subtitle>
                <Card.Text>
                  <p>{greenhouse.year}</p>
                  <p>{greenhouse.production}</p>
                </Card.Text>
                <Button
                  className="bio-btn-primary greenhouse"
                  onClick={() =>
                    navigate(`/oneGreenhouse/${greenhouse.greenhouse_id}`)
                  }
                >
                  Ver invernadero
                </Button>
                <Button
                  className="bio-btn-primary"
                  onClick={() =>
                    navigate(`/FarmerProfile/${greenhouse.owner_user_id}`)
                  }
                >
                  Ver agricultor
                </Button>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};
