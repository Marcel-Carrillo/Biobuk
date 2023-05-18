import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BiobukContext } from "../../context/BiobukContext";
import { deleteLocalStorageBiobuk } from "../../helpers/localstorage/localStorageBiobuk";
import "./styles.scss";


export const BiobukNavbar = ({ showNavBar, handleShowAside }) => {
  const { user, setUser, isLogged, setIsLogged } = useContext(BiobukContext);
  const [showSession, setShowSession] = useState(false);
  const navigate = useNavigate();
  

  /**
   * Control de la navegación del enlace a perfil según que usuario a iniciado
   * Type = 0 : Agricultar
   * Type = 1 : Propietario
   * Type = 2 : Administrador
   */
  const handleClick = () => {
    if (user.type === 0) {
      navigate(`/farmerProfile/${user.user_id}`);
    } else if (user.type === 1) {
      navigate(`/shop/${user?.user_id}`);
    } else if (user.type === 2) {
      navigate(`/adminProfile/${user.user_id}`);
    }
  };


  /**
   * Controla el cierre de sesión del usuario
   */
  const handleLogout = () => {
    setUser("");
    setIsLogged(false);
    deleteLocalStorageBiobuk();
    setShowSession(false);
    navigate("/");
  };


  return (
    <Navbar id="NavBAR">
      <Container>
        <div className="fondo d-flex">
          <Navbar.Brand
            as={Link}
            to="/"
            className="logoContainer d-none d-md-block"
          >
            <img src="/Biobuk_logo.png" />
          </Navbar.Brand>
          <Navbar.Brand
            as={Link}
            to="/"
            className="logoContainer2 d-block d-md-none"
          >
            <img src="/Biobuklogo2.png" />
          </Navbar.Brand>
          <div
            onClick={handleShowAside}
            className={`menuBurger ${showNavBar === true ? "blueMenu" : ""}`}
          ></div>
        </div>
        <Nav className="me-auto">
          {showSession ? (
            <Nav.Link className="d-flex">
              <span className="d-none d-md-block">
                ¿Seguro que quieres cerrar tu sesión?
              </span>
              <span className="d-block d-md-none">¿Estás seguro?</span>
              <Button variant="danger" className="mx-2" onClick={handleLogout}>
                Sí
              </Button>
              <Button
                variant="danger"
                className="bio-btn-primary mx-2"
                onClick={() => setShowSession(false)}
              >
                No
              </Button>
            </Nav.Link>
          ) : isLogged === true ? (
            <>
              {user?.type === 0 && (
                <div className="carritoBoton" onClick={() => navigate("/shopping_cart")}>
                  <div className="background1">
                    <img src="/images/iconos_sidebar/shopping-cart.png" alt="imagen del carrito de la compra" />
                  </div>
                </div>
              )}
              <Navbar.Brand onClick={handleClick} className="photoContainer">
                {!user?.user_img && <img src={`/images/user_default.png`} />}
                {user?.user_img && (
                  <img src={`/images/users/${user?.user_img}`} />
                )}
              </Navbar.Brand>
              <Nav.Link onClick={handleClick} className="d-none d-md-block greetings">
                Bienvenido <span>{user?.name}</span>!
              </Nav.Link>
              <Button
                className="bio-btn-primary"
                onClick={() => setShowSession(true)}
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">
                Iniciar Sesión
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};
