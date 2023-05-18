import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiobukContext } from "../../../context/BiobukContext";
import "./shopProfile.scss";


export const ShopProfile = () => {
  const { user } = useContext(BiobukContext);
  const { shop_id } = useParams();
  const [shopOwner, setShopOwner] = useState({});
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();


  /**
   * Carga y guarda la información de propietario
   * y la información de sus tiendas
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/getOneUser/${shop_id}`)
      .then((res) => setShopOwner(res.data.resultUser[0]))
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:4000/shops/getAllOwnerShops/${user.user_id}`)
      .then((res) => {
        setShops(res.data);
      })
      .catch((err) => console.log(err));
  }, [shop_id, user.user_id]);

  
  return (
    <Row className="farmer-profile shopProfile">
      {shopOwner && (
        <>
          <Col className="farmer-name">
            <Row className="mb-4">
              <Col xs={12} lg={9}>
                <h1>
                  <span>Bienvenido, </span>
                  {shopOwner.name} {shopOwner.lastname}
                </h1>
              </Col>
              <Col
                xs={12}
                lg={3}
                className="d-flex justify-content-lg-end"
              ></Col>
            </Row>
          </Col>
          <Row>
            <Col xs={12} md={6} lg={8} className="mb-4">
              <Row className="profile">
                {user?.type === 1 && (
                  <Button
                    // variant="primary"
                    className="bio-btn-primary mt-3 btn-fix"
                    onClick={() => navigate(`/editShopProfile/${shop_id}`)}
                  >
                    Editar perfil
                  </Button>
                )}
                <Col xs={12} lg={6} className="profile-img">
                  {shopOwner?.user_img ? (
                    <img
                      src={`/images/users/${shopOwner.user_img}`}
                      alt="Imagen de usuario del agricultor"
                    />
                  ) : (
                    <img
                      src={`/images/user_default.png`}
                      alt="Imagen de usuario del agricultor"
                    />
                  )}
                </Col>
                <Col xs={12} lg={6} className="farmer-info">
                  {shopOwner?.dni && <p>DNI: {shopOwner.dni}</p>}
                  {shopOwner?.phone && <p>Teléfono: {shopOwner.phone}</p>}
                  {shopOwner?.address && <p>Dirección: {shopOwner.address}</p>}
                  {shopOwner?.email && <p>Email: {shopOwner.email}</p>}
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6} lg={4}>
              {shops &&
                shops.map((shop) => {
                  return (
                    <Card
                      key={shop.shop_id}
                      className="card-shopProfile mb-4"
                      onClick={() => navigate(`/oneShop/${shop.shop_id}`)}
                    >
                      <h3 className="text-center mx-auto">{shop.name}</h3>
                    </Card>
                  );
                })}
            </Col>
          </Row>
        </>
      )}
      <Row>
        <Col xs={12} md={6} className="mb-3">
          <Card
            className="cardFarmerGreenhouse cardPedidos"
            onClick={() => navigate(`/shop/orders/${shopOwner.user_id}`)}
          >
            <h1>Pedidos</h1>
          </Card>
        </Col>
        <Col xs={12} md={6} className="mb-3">
          <Card
            className="cardFarmerGreenhouse cardProducts"
            onClick={() => navigate(`/products`)}
          >
            <h1>Productos</h1>
          </Card>
        </Col>
      </Row>
    </Row>
  );
};
