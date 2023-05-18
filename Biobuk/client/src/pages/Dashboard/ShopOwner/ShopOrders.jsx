import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import "./shopOrders.scss";


export const ShopOrders = () => {
  const { owner_id } = useParams();
  const [orders, setOrders] = useState();
  const [buyers, setBuyers] = useState();
  const navigate = useNavigate();

  
  /**
   * Guarda y carga la información de pedidos de agricultores que han comprado
   * productos las tiendas del propietario de tienda 
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/owner/getAllOrders/${owner_id}`)
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

          let buyersArray = finalArray.map((elem) => elem[0].buyer_id);
          let buyersFinalArray = [];
          buyersArray.map((elem) => {
            setTimeout(() => {
              axios
                .get(`http://localhost:4000/users/getOneUser/${elem}`)
                .then((res) => {
                  buyersFinalArray.push(res.data.resultUser[0].name);
                })
                .catch((error) => console.log(error));
            }, 100);
          });
          setBuyers(buyersFinalArray);
          setOrders(finalArray);
        }
      })
      .catch((err) => console.log(err));
  }, []);


  return (
    <Row className="orderlistTienda">
      {orders !== undefined ? (
        <>
          <Row>
            <Col>
              <h1>Pedidos Recibidos</h1>
            </Col>
          </Row>

          <Row className="rowPedidoTienda">
            {orders?.map((elem, index) => {
              let totalPrice = 0;
              return (
                <Col
                  className="pedidoTienda"
                  key={Math.random() * new Date()}
                  xs={12}
                  onClick={() =>
                    navigate(
                      `/shop/orders/oneOrder/${elem[0].order_id}/${owner_id}`
                    )
                  }
                >
                  <h3 key={Math.random() * new Date()}>
                    Pedido número {elem[0].order_id}, comprado el{" "}
                    {elem[0].purchase_date.slice(0, 10)} por {buyers[index]}
                  </h3>
                  <div className="d-flex justify-content-between">
                    <h4>
                      {elem.map((element, index) => {
                        totalPrice += element.original_price * element.quantity;
                        return (
                          <>
                            {index ? "," : ""} {element.product_name}
                          </>
                        );
                      })}
                      .
                    </h4>
                    <h4>Precio Total: {totalPrice?.toFixed(2)} €</h4>
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
              <h1>Aún no tienes ningún pedido, ¡pronto llegarán!</h1>
            </Col>
          </Row>
        </>
      )}
    </Row>
  );
};
