import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./adminProfile.scss";

export const AdminProfile = () => {
  const [farmers, setFarmers] = useState(0);
  const [products, setProducts] = useState(0);
  const [greenhouses, setGreenhouses] = useState(0);
  const navigate = useNavigate();


  //Se trae los contadores de cuantos agricultores, productos e invernaderos existen en base de datos
  useEffect(() => {
    axios
      .get("http://localhost:4000/users/admin/getAllCount")
      .then((res) => {
        setFarmers(res.data.resultUsers[0]["count(user_id)"]);
        setProducts(res.data.resultProducts[0]["count(product_id)"]);
        setGreenhouses(res.data.resultGreenhouse[0]["count(greenhouse_id)"]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  return (
    <Row className="adminProfile">
      <Col xs={12}>
        <h1>
          Bienvenido, <span>Admin</span>
        </h1>
      </Col>
      <Row className="contenedorAzul">
        <Col
          xs={12}
          className="cajaAzul caja1"
          onClick={() => navigate("/allFarmers")}
        >
          <p>Número total de Agricultores: </p>
          <p>{farmers}</p>
        </Col>
        <Col
          xs={12}
          className="cajaAzul caja2"
          onClick={() => navigate("/products")}
        >
          <p>Número total de Productos:</p>
          <p>{products}</p>
        </Col>
        <Col
          xs={12}
          className="cajaAzul caja3"
          onClick={() => navigate("/admin/AllGreenhouses")}
        >
          <p>Número total de Invernaderos:</p>
          <p>{greenhouses}</p>
        </Col>
      </Row>
    </Row>
  );
};
