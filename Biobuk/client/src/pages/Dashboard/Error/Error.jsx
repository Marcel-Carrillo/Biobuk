import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Error.scss";


export const Error = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 500);
  }, []);


  return (
    <>
      {loading ? (
        <Row className="error">
          <Col xs={12} className="error-title">
            <h1>Error</h1>
          </Col>
          <Col xs={12} className="sub-error">
            <h2>En este terreno no se puede cultivar</h2>
          </Col>
          <Col xs={12} className="error-home">
            <h3>
              Puedes volver a la página de inicio{" "}
              <span onClick={() => navigate("/")}>pinchando aquí</span>
            </h3>
          </Col>
          {/* <p>
            <a href="https://www.freepik.es/foto-gratis/tierra-sequia_28944354.htm#query=tierra%20seca&position=6&from_view=search&track=ais">
              Imagen de kamchatka
            </a>{" "}
            en Freepik
          </p> */}
        </Row>
      ) : (
        <Row className="spinner">
          <svg
            viewBox="0 0 120 120"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <circle class="load one" cx="60" cy="60" r="40" />
            <circle class="load two" cx="60" cy="60" r="40" />
            <circle class="load three" cx="60" cy="60" r="40" />
            <g>
              <circle class="point one" cx="45" cy="70" r="5" />
              <circle class="point two" cx="60" cy="70" r="5" />
              <circle class="point three" cx="75" cy="70" r="5" />
            </g>
          </svg>
        </Row>
      )}
    </>
  );
};
