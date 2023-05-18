import axios from "axios";
import React, { useState, useRef } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateGreenhouse.scss";
let initialValue = {
  name_greenhouse: "",
  year: "",
  production: "",
  seed_brand: "",
  fertilize_type: "",
  owner_user_id: "",
};

export const CreateGreenhouse = () => {
  const { farmer_id } = useParams();
  const [greenhouse, setGreenhouse] = useState(initialValue);
  const [enterPressed, setEnterPressed] = useState(false);
  const lastInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGreenhouse({ ...greenhouse, [name]: value });
  };

  /**
   * Valida los campos de los imput y los guarda en la base de datos, cirerra el modal y borra los campos de los imput.
   */
  const handleSubmit = () => {
    if (
      greenhouse.name_greenhouse === "" ||
      greenhouse.year === "" ||
      greenhouse.production === "" ||
      greenhouse.seed_brand === "" ||
      greenhouse.fertilize_type === ""
    ) {
      setMessage("Debes rellenar todos los campos obligatorios");
    } else if (greenhouse.year < 1900 || greenhouse.year > 2155) {
      setMessage("El año tiene que estar entre 1901 y 2155");
    } else {
      axios
        .post(
          `http://localhost:4000/users/farmer/createGreenhouse/${farmer_id}`,
          greenhouse
        )
        .then((res) => {
          console.log(res);
          navigate(`/allGreenhouses/${farmer_id}`);
        })
        .catch((err) => {
          if (err.response.data.error.code === "ER_WARN_DATA_OUT_OF_RANGE") {
            setMessage("El año tiene que estar entre 1901 y 2155");
          }
          console.log(err);
        });
    }
  };

  /**
   * Hace que pases de un input a otro pulsando intro
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const inputs = Array.from(document.querySelectorAll("input"));
      const index = inputs.indexOf(e.target);
      if (index === inputs.length - 1) {
        lastInputRef.current.focus();
        setEnterPressed(!enterPressed);
      } else {
        inputs[index + 1].focus();
      }
    }
  };

  return (
    <Container fluid className="CreateGreenhouse">
      <Row>
        <Col>
          <div className="primeraCol">
            <div className="cpal">
              <Form>
                <h1>Formulario de creación de invernadero</h1>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Invernadero*</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    value={greenhouse.name_greenhouse}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Nombre"
                    name="name_greenhouse"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Año*</Form.Label>
                  <Form.Control
                    className="label"
                    type="number"
                    name="year"
                    value={greenhouse.year}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Año"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Cultivo*</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    name="production"
                    value={greenhouse.production}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Producción"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Marca de la Semilla*</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    name="seed_brand"
                    value={greenhouse.seed_brand}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Marca de la semilla"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Fertilizante*</Form.Label>
                  <Form.Control
                    className="label"
                    type="fertilize_type"
                    name="fertilize_type"
                    value={greenhouse.fertilize_type}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Tipo de Fertilizante"
                    ref={lastInputRef}
                  />
                </Form.Group>
                <Button className="bio-btn-primary mb-2" onClick={handleSubmit}>
                  Crear
                </Button>
                {message && (
                  <h2 className={"alert alert-danger text-center"}>
                    {message}
                  </h2>
                )}
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
