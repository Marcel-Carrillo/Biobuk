import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Table, Button } from "react-bootstrap";
import { BiobukContext } from "../../../context/BiobukContext";
import { useParams } from "react-router-dom";
import "./ConfirmPurchase.scss";


export const ConfirmPurchase = () => {
  const { user } = useContext(BiobukContext);
  const { order_id } = useParams();
  const [order, setOrder] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);


  /**
   * Carga y guarda la información de la compra realizada 
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/farmer/orderReceipt/${order_id}`)
      .then((res) => {
        setOrder(res.data);

        let temp = 0;
        for (let element of res.data) {
          temp += parseFloat(element.original_price * element.quantity);
        }
        setFinalPrice(temp.toFixed(2));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  
  return (
    <Row className="confirmPurchase">
      <Col xs={12}>
        <Row className="d-flex justify-content-center">
          <Col xs={12} lg={8} className="receipt">
            <h1 className="text-center">Recibo de compra</h1>
            <Table>
              <thead>
                <tr>
                  <th>Referencia</th>
                  <th>Nombre</th>
                  <th>Precio unitario</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {order &&
                  order.map((element, index) => {
                    return (
                      <tr>
                        <td>{element.reference}</td>
                        <td>{element.product_name}</td>
                        <td>{element.original_price}</td>
                        <td>{element.quantity}</td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>Precio Total</td>
                  <td>{finalPrice && finalPrice} €</td>
                </tr>
              </tfoot>
            </Table>
            <Row>
              <Col xs={12} lg={6}>
                <h4>ID del pedido: {order[0]?.order_id}</h4>
              </Col>
              <Col xs={12} lg={6}>
                <h4 className="direccion">
                  Dirección de envío: {order[0]?.address}, {order[0]?.city},{" "}
                  {order[0]?.province}, {order[0]?.country}
                </h4>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col className="colBotones">
        <Button
          className="bio-btn-primary"
          as={Link}
          to={`/farmerProfile/${user.user_id}`}
        >
          Perfil
        </Button>
        <Button
          className="bio-btn-primary"
          as={Link}
          to={`/allOrders/${order.order_id}`}
        >
          Mis pedidos
        </Button>
      </Col>
    </Row>
  );
};
