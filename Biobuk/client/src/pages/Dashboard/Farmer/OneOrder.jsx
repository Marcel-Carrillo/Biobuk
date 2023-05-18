import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiobukContext } from "../../../context/BiobukContext";
import "./oneOrder.scss";

export const OneOrder = ({ setHide, setShowNavBar }) => {
  const { user } = useContext(BiobukContext);
  const { order_id } = useParams();
  const [order, setOrder] = useState();
  const [orderNumber, setOrderNumber] = useState();
  const [orderDate, setOrderDate] = useState();
  const [finalPrice, setfinalPrice] = useState();
  const navigate = useNavigate();

  /**
   * Carga y guarda la información de un pedido concreto 
   * realizado por el agricultor
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/farmer/getOneOrder/${order_id}`)
      .then((res) => {
        setOrder(res.data);
        res.data.length > 0
          ? setOrderNumber(res.data[0].order_id)
          : setOrderNumber(res.data.order_id);
        res.data.length > 0
          ? setOrderDate(res.data[0].purchase_date)
          : setOrderDate(res.data.purchase_date);
        let provPrice = 0;
        for (let i = 0; i < res.data.length; i++) {
          provPrice += res.data[i].original_price * res.data[i].quantity;
        }
        setfinalPrice(provPrice);
      })
      .catch((error) => console.log(error));
  }, []);


  return (
    <Row className="oneOrder">
      <Col xs={12}>
        <h1>
          Pedido número : {orderNumber && orderNumber}, comprado el{" "}
          {orderDate && orderDate.slice(0, 10)}
        </h1>
        <Table borderless className="mb-3">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Referencia</th>
              <th>Precio</th>
              <th>Precio Actual</th>
            </tr>
          </thead>
          <tbody>
            {order?.map((elem) => {
              return (
                <tr key={Math.random() * new Date()}>
                  <td>
                    <p className="pulsarNombre" onClick={()=>navigate(`/oneProduct/${elem.product_id}`)}>{elem.name}</p>
                  </td>
                  <td>
                    <p>{elem.quantity}</p>
                  </td>
                  <td>
                    <p>{elem.reference}</p>
                  </td>
                  <td>
                    <p>{elem.original_price} €</p>
                  </td>
                  <td>
                    <p>{elem.price} €</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={4}>Precio Total: </th>
              <td>{finalPrice?.toFixed(2)} €</td>
            </tr>
          </tfoot>
        </Table>
      </Col>
      <Col xs={12}>
        <div className="imageContainer">
          <img src="/Biobuk_logo.png" />
        </div>
        <Button
          className="bio-btn-primary volver"
          onClick={() => navigate(`/allOrders/${user.user_id}`)}
        >
          Volver
        </Button>
        <Button
          className="bio-btn-primary"
          onClick={() => {
            setHide(true);
            setShowNavBar(false);
            setTimeout(() => {
              window.print();
            }, 0);
          }}
        >
          Imprimir
        </Button>
      </Col>
    </Row>
  );
};
