import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BiobukContext } from "../../context/BiobukContext";
import { saveLocalStorageBiobuk } from "../../helpers/localstorage/localStorageBiobuk";
import "./login.scss";

const initialValue = {
  email: "",
  password: "",
  keepLogged: false,
};

//Hecho por roque
export const Login = () => {
  const { setIsLogged, setUser } = useContext(BiobukContext);
  const [loginUser, setLoginUser] = useState(initialValue);
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState();

  //Seteamos los valores de los input en el objeto temporal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginUser({ ...loginUser, [name]: value });
  };

  //Comprobamos si ha seleccionado el input o no
  const handleChecked = (e) => {
    const { name, checked } = e.target;
    setLoginUser({ ...loginUser, [name]: checked });
  };

  const handleSubmit = () => {
    /*
     * Si falta algún dato nos quedamos donde estamos con mensaje de error,
     * si no, creamos el perfil y vamos a su página.
     */
    if (!loginUser.email || !loginUser.password) {
      setMensaje("Falta email o contraseña");
    } else {
      axios
        .post(`http://localhost:4000/users/login`, loginUser)
        .then((res) => {
          saveLocalStorageBiobuk(res.data.token);
          setUser(res.data.user);
          setIsLogged(true);
          const type = res.data.user.type;
          const user_id = res.data.user.user_id;
          type === 0 && navigate(`/farmerProfile/${user_id}`);
          type === 1 && navigate(`/shop/${user_id}`);
          type === 2 && navigate(`/adminProfile/${user_id}`);
        })
        .catch((err) => {
          setMensaje("El usuario o la contraseña son incorrectos");
        });
    }
  };

  /*
   * Hace que pases de un input a otro pulsando intro
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const inputs = Array.from(document.querySelectorAll("input"));
      const index = inputs.indexOf(e.target);
      inputs[index + 1].focus();
    }
  };

  return (
    <Row className="formlogin">
      <Col sm={12} md={8} lg={6}>
        <Form className="formulario">
          <Form.Group>
            <h2 className={mensaje && "alert alert-danger"}>{mensaje}</h2>
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              className="input"
              type="email"
              name="email"
              value={loginUser.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="correo@correo.com"
            />
            <Form.Text className="text-muted">
              Nunca compartiremos tu correo con nadie más.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-3">Contraseña</Form.Label>
            <Form.Control
              className="input"
              type="password"
              name="password"
              value={loginUser.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="bioBuk123!"
            />
          </Form.Group>
          <Button
            className="bio-btn-primary mt-4"
            variant="primary"
            onClick={handleSubmit}
          >
            Iniciar Sesión
          </Button>
          <Form.Group className="d-flex gap-2 mt-3">
            <Form.Label className="text-muted">
              Mantener la sesión activa
            </Form.Label>
            {["checkbox"].map((type) => (
              <div key={`default-${type}`} className="d-flex">
                <Form.Check
                  type={type}
                  onChange={handleChecked}
                  name="keepLogged"
                  id={`default-${type}`}
                />
              </div>
            ))}
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};
