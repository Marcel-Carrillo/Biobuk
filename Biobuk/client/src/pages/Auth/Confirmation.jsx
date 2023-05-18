import axios from "axios";
import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./Confirmation.scss";

export const Confirmation = () => {
  const { user_id } = useParams();
  //Página intermedia que activa el usuario seteando deleted a 0.

  useEffect(() => {
    axios
      .put(`http://localhost:4000/users/activeAccount/${user_id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Row className="home confirmation">
      <Col xs={12} className="logo-home">
        <img src="/Biobuk_logo.png" alt="Logo de Biobuk" />
      </Col>
      <Col xs={12} className="example background">
        <p>
          <span>Cuenta confirmada y activada,</span> ya puedes disfrutar de
          todos los servicios de la plataforma iniciando sesión
        </p>
      </Col>
    </Row>
  );
};
