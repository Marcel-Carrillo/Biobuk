import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiobukContext } from "../../../context/BiobukContext";
import "./shopOneOrder.scss";

export const ShopOneOrder = ({ setHide, setShowNavBar }) => {
  const { owner_id } = useParams();
  const { user } = useContext(BiobukContext);
  const { order_id } = useParams();
  const [order, setOrder] = useState();
  const [finalPrice, setfinalPrice] = useState();
  const navigate = useNavigate();

  
  /**
   * Guarda y carga la información de un pedido concreto de un agricultor que ha comprado
   * productos de una tienda del propietario de tienda 
   */
  useEffect(() => {
    axios
      .get(
        `http://localhost:4000/users/owner/getOneFarmerOrder/${order_id}/${owner_id}`
      )
      .then((res) => {
        setOrder(res.data);
        let provPrice = 0;
        for (let i = 0; i < res.data.length; i++) {
          provPrice += res.data[i].original_price * res.data[i].quantity;
        }
        setfinalPrice(provPrice);
      })
      .catch((error) => console.log(error));
  }, []);


  return (
    <Row className="shopOneOrder">
      <Col xs={12}>
        <h1>
          {order && (
            <>
              Pedido número {order[0]?.order_id}, comprado el{" "}
              {order[0]?.purchase_date.slice(0, 10)} por{" "}
              <span>
                {order[0]?.name} {order[0]?.lastname}
              </span>{" "}
              en {order[0]?.shop_name}
            </>
          )}
        </h1>
        <Table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Referencia</th>
              <th>Precio</th>
              <th>Precio Actual</th>
              <th className="address">Dirección de envío</th>
            </tr>
          </thead>
          <tbody>
            {order?.map((elem) => {
              return (
                <tr key={Math.random() * new Date()}>
                  <td>
                    <p className="pulsarNombre" onClick={()=>navigate(`/oneProduct/${elem.product_id}`)}>{elem.product_name}</p>
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
                  <td>
                    <p>{elem.destination}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              {
                <>
                  <th colSpan={5}>Precio Total: </th>
                  <th>{finalPrice?.toFixed(2)} €</th>
                </>
              }
            </tr>
          </tfoot>
        </Table>
      </Col>
      <Col xs={12}>
        <div className="imageContainer">
          <img src="/Biobuk_logo.png" />
        </div>
        <Button
          className="bio-btn-primary"
          onClick={() => navigate(`/shop/orders/${user.user_id}`)}
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
