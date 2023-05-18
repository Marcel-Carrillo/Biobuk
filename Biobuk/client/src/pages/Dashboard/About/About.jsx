import React from "react";
import { Col, Row } from "react-bootstrap";
import "./about.scss";
export const About = () => {
  return (
    <div className="about">
      <Row className="headerAbout">
        <Col xs={12} md={6}>
          <img className="logo" src="/biobuklogo2.png" />
          <h1 className="letraJunta">
            TECNOLOGÍA,
            <br />
            <span className="orange">
              INNOVACIÓN
              <br />
            </span>
            Y&nbsp;SOSTENIBILIDAD
            <br />
            PARA&nbsp;<span className="orange">INVERNADEROS</span>
          </h1>
        </Col>
        <Col className="huerto"xs={12} md={6}>
          <img src="/Grodi1.jpg"></img>
        </Col>
      </Row>
        <Col xs={12} className="bannerPhoto">
          <h1>SOBRE&nbsp;NOSOTROS</h1>
          <p>
          Grodi Tech es el reto y el sueño de emprendedores, orgullosos y conscientes de que la agricultura es la base de nuestra vida. Ha llegado el momento de renovar y solucionar problemas que han perdurado en los años. Queremos ponerle las cosas más fáciles a una profesión tan importante, llevándoles la precisión tecnológica a sus campos.
          </p>
        </Col>
    </div>
  );
};
