import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Row, Container, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CreateShopModal } from "../../../components/Modal/CreateShopModal";
import { EditShopModal } from "../../../components/Modal/EditShopModal";
import { BiobukContext } from "../../../context/BiobukContext";
import "./myShops.scss";


export const MyShops = () => {
  const { user } = useContext(BiobukContext);
  const [shops, setShops] = useState();
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [shopEdit, setShopEdit] = useState();
  const navigate = useNavigate();


  /**
   * Carga y guarda la información de todas las tiendas del propietario
   */
  useEffect(() => {
    if (refresh) {
      axios
        .get(`http://localhost:4000/shops/getAllOwnerShops/${user.user_id}`)
        .then((res) => {
          setShops(res.data);
          setRefresh(false);
        })
        .catch((err) => console.log(err));
    }
  }, [refresh, user.user_id]);


  /**
   * Guarda la información de la tienda en una constante
   * y carga un modal de edicion
   * @param {*} shop
   */
  const handleEdit = (shop) => {
    setShopEdit(shop);
    setShowEdit(true);
  };


  /**
   * Carga la imagen por defecto para el baner de una tienda
   */
  const handleError = (e) => {
    e.target.src = "./images/dueno-negocio-feliz-sosteniendo-estamos-abiertos-signo.jpg";
  };

  
  return (
    <Container fluid className="myshops">
      <div className="misTiendas">
        <h1 className="tiendas">Mis tiendas</h1>
      </div>
      <Row>
        <Col xs={12}>
          <Button
            className="addShop bio-btn-primary mb-4"
            onClick={() => setShow(true)}
          >
            Añadir tienda
          </Button>
        </Col>

        {shops?.length !== 0 ? (
          <Row>
            {shops?.map((shop, index) => {
              return (
                <Card key={index}>
                  <Card.Body>
                    <Card.Title>
                      <div className="nombreTienda">
                        <h1>{shop.name}</h1>
                      </div>
                    </Card.Title>
                    <div className="card-text">
                      <div className="shop-banner2 mb-3 mx-auto">
                        <img
                          src={`/images/tienda/${shop?.shop_img}`}
                          onError={(e) => handleError(e)}
                          alt="imagen de tienda"
                        />
                      </div>
                      <h3>{shop.address}</h3>
                      <h3>{shop.city}</h3>
                      <h3>{shop.province}</h3>
                      <h3>{shop.country}</h3>
                    </div>
                    <Button
                      className="bio-btn-primary"
                      variant="primary"
                      onClick={() => handleEdit(shop)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/oneShop/${shop.shop_id}`)}
                    >
                      Ver tienda
                    </Button>
                  </Card.Body>
                </Card>
              );
            })}
          </Row>
        ) : (
          <>
            <h2>
              Aún no tienes creada ninguna tienda, ¡tal vez sea el momento de
              crear una!
            </h2>
          </>
        )}
        <CreateShopModal
          show={show}
          setShow={setShow}
          setShops={setShops}
          setRefresh={setRefresh}
        />
        <EditShopModal
          show={showEdit}
          setShow={setShowEdit}
          setShops={setShops}
          shopEdit={shopEdit}
          setShopEdit={setShopEdit}
          setRefresh={setRefresh}
        />
      </Row>
    </Container>
  );
};
