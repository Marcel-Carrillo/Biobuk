import React, { useContext } from "react";
import { Nav, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiobukContext } from "../../context/BiobukContext";
import "./styles.scss";


export const BiobukSidebar = ({
  showNavBar,
  hide,
  handleShowAside,
}) => {
  
  const { user, isLogged } = useContext(BiobukContext);
  

  //Esta funcion hace que se vea el sidebar completo en la vista movil
  const handleSizeClick = () => {
    if (window.frames.innerWidth <= 575) {
      handleShowAside();
    }
  };


  return (
    <>
      {showNavBar && (
        <Nav
          onClick={handleSizeClick}
          className={`col-md-12 d-block sidebar ${hide ? "des" : ""}${
            showNavBar ? "aparecer" : ""
          }`}
          activeKey="/home"
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          <div className="sidebar-sticky"></div>
          {/* SideBar Global */}
          {isLogged === false && (
            <>
              <Nav.Item>
                <Nav.Link as={Link} to="/" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/home.svg" />
                    </Col>
                    <Col>Home</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/login" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/login.svg" />
                    </Col>
                    <Col>Acceso</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/about" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/sobrenosotros.svg" />
                    </Col>
                    <Col>Sobre Nosotros</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/register" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/registro.svg" />
                    </Col>
                    <Col>Registro</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
            </>
          )}
          {/* SideBar Para Agricultor */}
          {isLogged === true && user?.type === 0 && (
            <>
              <Nav.Item>
                <Nav.Link as={Link} to="/" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/home.svg" />
                    </Col>
                    <Col>Home</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to={`/farmerProfile/${user.user_id}`}
                  onClick={handleShowAside}
                >
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/perfil.svg" />
                    </Col>
                    <Col>Perfil</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to={`/allGreenhouses/${user.user_id}`}
                  onClick={handleShowAside}
                >
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/Invernaderos.svg" />{" "}
                    </Col>
                    <Col>Invernaderos</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/products" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/productos.svg" />
                    </Col>
                    <Col>Productos</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to={`/allOrders/${user.user_id}`}
                  onClick={handleShowAside}
                >
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/shopping-list.png" />
                    </Col>
                    <Col>Pedidos</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
            </>
          )}
          {/* SideBar Para Propietario de Tienda */}
          {isLogged === true && user?.type === 1 && (
            <>
              <Nav.Item>
                <Nav.Link as={Link} to="/" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/home.svg" />
                    </Col>
                    <Col>Home</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to={`/shop/${user?.user_id}`}
                  onClick={handleShowAside}
                >
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/perfil.svg" />
                    </Col>
                    <Col>Perfil</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/products" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/productos.svg" />
                    </Col>
                    <Col>Productos</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/myShops" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/mistiendas.svg" />{" "}
                    </Col>
                    <Col>Mis tiendas</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to={`/shop/orders/${user.user_id}`}
                  onClick={handleShowAside}
                >
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/shopping-list.png" />
                    </Col>
                    <Col>Pedidos</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
            </>
          )}
          {/* SideBar para Admin */}
          {isLogged === true && user?.type === 2 && (
            <>
              <Nav.Item>
                <Nav.Link as={Link} to="/" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/home.svg" />
                    </Col>
                    <Col>Home</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to={`/adminProfile/${user.user_id}`}
                  onClick={handleShowAside}
                >
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/perfil.svg" />
                    </Col>
                    <Col>Perfil</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/allFarmers" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/agricultores.svg" />{" "}
                    </Col>
                    <Col>Agricultores</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/products" onClick={handleShowAside}>
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/productos.svg" />
                    </Col>
                    <Col>Productos</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/admin/AllGreenhouses"
                  onClick={handleShowAside}
                >
                  <Row>
                    <Col xs={2} sm={3}>
                      <img src="/images/iconos_sidebar/Invernaderos.svg" />
                    </Col>
                    <Col>Invernaderos</Col>
                  </Row>
                </Nav.Link>
              </Nav.Item>
            </>
          )}
        </Nav>
      )}
    </>
  );
};
