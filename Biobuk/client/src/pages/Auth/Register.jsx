import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Form, Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./register.scss";

let initialValue = {
  name: "",
  lastname: "",
  email: "",
  password: "",
  type: "",
};
//hecho por Roque
export const Register = () => {
  const [user, setUser] = useState(initialValue);
  const navigate = useNavigate();
  const [messageError, setMessageError] = useState("");
  const [confirmation, setConfirmation] = useState();
  //Aplicamos los valores de los input al objeto temporal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = () => {
    //Comprobamos que el email es algo@algo.algo y sino lanzamos el mensaje de error
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!user.name || !user.email || !user.password) {
      setMessageError("Debes rellenar todos los campos");
    } else if (!isValidEmail.test(user.email)) {
      setMessageError(
        "Introduce el e-mail en un formato nombre@nombre.dominio"
      );
    } else if (!user.type) {
      //Comprobamos que ha elegido un tipo de usuario
      setMessageError("Elige un tipo de usuario");
    } else {
      //Llamamos al controlador y registramos al usuario
      axios
        .post(`http://localhost:4000/users/register`, user)
        .then((res) => {
          setMessageError("");
          setConfirmation(
            `Se ha enviado un correo a la cuenta de correo electrónico registrada. \n\nEn caso de no recibirlo en 24h, contacta con nosotros en info@groditech,com o en el teléfono +34674467243`
          );
          setTimeout(() => {
            navigate("/");
          }, 10000);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data.error.errno === 1062) {
            setMessageError("E-mail duplicado");
          } else {
            setMessageError("Debes elegir un tipo de usuario");
          }
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
    <Container fluid className={`register-user ${confirmation && "oscuro"}`}>
      <Row>
        <Col className={confirmation && "blurTodo"}>
          <div className="primeraCol">
            <div className="cpal">
              <Form className="formulario">
                <Form.Group className="mb-3">
                  <Form.Label className="input">Nombre *</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    value={user.name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Nombre"
                    name="name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Apellidos *</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    value={user.lastname}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Apellidos"
                    name="lastname"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>E-mail *</Form.Label>
                  <Form.Control
                    className="label"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="correo@correo.com"
                  />
                  <Form.Text className="text-muted">
                    Nunca compartiremos tu correo con nadie más.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña *</Form.Label>
                  <Form.Control
                    className="label"
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="bioBuk123!"
                  />
                </Form.Group>

                <Form.Group className="label mb-3">
                  <Form.Label>Soy...</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="type"
                  >
                    <option value=""></option>
                    <option value="0">Agricultor</option>
                    <option value="1">Dueño de Tienda</option>
                  </Form.Select>
                </Form.Group>

                <p className="mensajeError">{messageError}</p>
                <Button
                  className="boton bio-btn-primary btn-fix mx-auto"
                  variant="primary"
                  onClick={handleSubmit}
                >
                  Crear Usuario
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        {confirmation && (
          <Col xs={12} className="confirmacionCol">
            <h2 className="confirmacion">{confirmation}</h2>
          </Col>
        )}
      </Row>
    </Container>
  );
};
