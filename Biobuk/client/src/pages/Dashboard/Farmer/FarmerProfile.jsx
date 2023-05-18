import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Row, Col, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiobukContext } from "../../../context/BiobukContext";
import "./FarmerProfile.scss";

export const FarmerProfile = () => {
  const { user } = useContext(BiobukContext);
  const { farmer_id } = useParams();
  const [farmer, setFarmer] = useState({});
  const navigate = useNavigate();

  const handleError = (e) => {
    e.target.src = `./../images/user_default.png`;
  };
  /**
   * Carga y guarda la información del agricultor
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/getOneUser/${farmer_id}`)
      .then((res) => setFarmer(res.data.resultUser[0]))
      .catch((err) => console.log(err));
  }, [farmer_id]);

  return (
    <Container fluid className="farmer-profile">
      {farmer && (
        <>
          <Col className="farmer-name w-100 mb-4">
            <Row>
              <Col xs={12} lg={9}>
                <h1>
                  <span>Bienvenido, </span>
                  {farmer.name} {farmer.lastname}
                </h1>
              </Col>
            </Row>
          </Col>
          <Row>
            <Col xs={12} md={6} lg={8} className="profile mb-3">
              {user?.type === 0 && (
                <Button
                  variant="primary"
                  className="bio-btn-primary mt-3 btn-fix"
                  onClick={() => navigate(`/editfarmer/${farmer_id}`)}
                >
                  Editar
                </Button>
              )}
              <Row>
                <Col xs={12} lg={6} className="profile-img">
                  {farmer?.user_img && (
                    <img
                      src={`./../images/users/${farmer.user_img}`}
                      alt="Imagen de usuario del agricultor"
                      onError={(e) => handleError(e)}
                    />
                  )}
                </Col>

                <Col xs={12} lg={6} className="farmer-info">
                  <p>{farmer.dni}</p>
                  <p>{farmer.email}</p>
                  <p>{farmer.phone}</p>
                  <p>{farmer.address}</p>
                </Col>
              </Row>
            </Col>
            <Col
              xs={12}
              md={6}
              lg={4}
              className="invernaderos d-flex align-items-center"
            >
              <Row>
                <Col xs={12} className="farmer-greenhouses">
                  <div
                    className="invernaderos-circle d-flex justify-content-center align-items-center"
                    onClick={() =>
                      navigate(`/allGreenhouses/${farmer.user_id}`)
                    }
                  >
                    <h2>Invernaderos</h2>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col className="mt-4">
              <Row>
                {user?.type === 0 && (
                  <Col xs={12} md={6} className="mb-3">
                    <Card
                      className="cardFarmerGreenhouse cardPedidos"
                      onClick={() => navigate(`/allOrders/${farmer.user_id}`)}
                    >
                      <h1>Pedidos</h1>
                    </Card>
                  </Col>
                )}
                {user?.type === 0 && (
                  <>
                    <Col xs={12} md={6} className="mb-3">
                      <Card
                        className="cardFarmerGreenhouse cardProducts"
                        onClick={() => navigate(`/products`)}
                      >
                        <h1>Productos</h1>
                      </Card>
                    </Col>
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};
