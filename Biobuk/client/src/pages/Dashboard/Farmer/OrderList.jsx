import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import { BiobukContext } from "../../../context/BiobukContext";
import { useNavigate } from "react-router-dom";
import "./orderList.scss";


export const OrderList = () => {
  const { user } = useContext(BiobukContext);
  const [orders, setOrders] = useState();
  const navigate = useNavigate();

  /**
   * Carga y almacena la información de todos los pedidos 
   * que ha realizado un agricultor
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/farmer/getAllOrders/${user.user_id}`)
      .then((res) => {
        if (res.data.length !== 0) {
          setOrders(res.data);
          let dataArray = res.data;
          const finalArray = dataArray.reduce((acc, item) => {
            const index = acc.findIndex(
              (arr) => arr[0]?.order_id === item.order_id
            );
            if (index === -1) {
              acc.push([item]);
            } else {
              acc[index].push(item);
            }
            return acc;
          }, []);

          setOrders(finalArray);
        }
      })
      .catch((error) => console.log(error));
  }, []);


  return (
    <Row className="orderlist">
      {orders !== undefined ? (
        <>
          <Row>
            <Col>
              <h1>Pedidos Realizados</h1>
            </Col>
          </Row>
          <Row className="rowPedido">
            {orders?.map((elem) => {
              let totalPrice = 0;
              return (
                <Col
                  className="pedido"
                  key={Math.random() * new Date()}
                  xs={12}
                  onClick={() => navigate(`/oneOrder/${elem[0].order_id}`)}
                >
                  <h3>
                    Pedido número {elem[0].order_id}, comprado el
                    {elem[0].purchase_date.slice(0, 10)}:
                  </h3>
                  <div className="d-flex justify-content-between">
                    <h4>
                      {elem.map((element, index) => {
                        totalPrice += element.original_price * element.quantity;
                        return (
                          <>
                            {index ? "," : ""} {element.name}
                          </>
                        );
                      })}
                      .
                    </h4>
                    <h4> Precio del Pedido: {totalPrice.toFixed(2)} €</h4>
                  </div>
                </Col>
              );
            })}
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Col>
              <h1>
                Aún no has realizado ningún pedido... ¡Tal vez sea el momento
                perfecto!
              </h1>
              <Button
                className="bio-btn-primary"
                onClick={() => navigate("/products")}
              >
                Ver Productos
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Row>
  );
};
