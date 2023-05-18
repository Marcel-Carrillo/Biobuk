import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Col, Row, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiobukContext } from "../../../context/BiobukContext";


const initialValue = {
  address: "",
  deleted: "",
  dni: "",
  email: "",
  lastname: "",
  name: "",
  password: "",
  phone: "",
  type: "",
  user_id: "",
  user_img: "",
};


export const EditFarmerProfile = () => {
  const { setUser, user } = useContext(BiobukContext);
  const { farmer_id } = useParams();
  const [editedFarmer, setEditedFarmer] = useState(initialValue);
  const [editedFarmerFiles, setEditedFarmerFiles] = useState({});
  const navigate = useNavigate();

  
/**
 * Carga y guarda la información del agricultor
 */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/getOneUser/${farmer_id}`)
      .then((res) => {
        setEditedFarmer(res.data.resultUser[0]);
      })
      .catch((err) => console.log(err));
  }, []);


  /**
   * 
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const inputs = Array.from(document.querySelectorAll("input"));
      const index = inputs.indexOf(e.target);
      inputs[index + 1].focus();
    }
  };


  /**
   * Controla los cambios de los valores en los campos a editar
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedFarmer({ ...editedFarmer, [name]: value });
  };

  
  /**
   * Registra la nueva foto a reemplazar
   */
  const handleFile = (e) => {
    setEditedFarmerFiles(e.target.files[0]);
  };


  /**
   * Edita la información del agricultor actual
   * @param {*} e 
   */
  const editFarmer = (e) => {
    e.preventDefault();
    const newFormData = new FormData();
    newFormData.append("farmer", JSON.stringify(editedFarmer));

    if (editedFarmerFiles) {
      newFormData.append("file", editedFarmerFiles);
    }

    axios
      .put(`http://localhost:4000/users/editOneUser/${farmer_id}`, newFormData)
      .then((res) => {
        setUser(res.data[0]);
        e.preventDefault();
        navigate(`/farmerProfile/${farmer_id}`);
      })
      .catch((err) => console.log(err));
  };


  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="primeraCol">
            <div className="cpal">
              <h1>Edita tu perfil</h1>
              <Form>
                <Form.Group className="label mb-3" controlId="formBasicName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="Nombre"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="name"
                    value={editedFarmer.name}
                  />
                </Form.Group>

                <Form.Group
                  className=" label mb-3"
                  controlId="formBasicLastname"
                >
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="Apellidos"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="lastname"
                    value={editedFarmer.lastname}
                  />
                </Form.Group>

                <Form.Group className=" label mb-3" controlId="formBasicDNI">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="DNI"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="dni"
                    value={editedFarmer.dni}
                  />
                </Form.Group>

                <Form.Group className=" label mb-3" controlId="formBasicPhone">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="Teléfono"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="phone"
                    value={editedFarmer.phone}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="Dirección"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    name="address"
                    value={editedFarmer.address}
                  />
                </Form.Group>
                <Form.Group controlId="formFile" className=" label mb-3">
                  <Form.Label>Imagen de perfil</Form.Label>
                  <Form.Control type="file" onChange={handleFile} />
                </Form.Group>
              </Form>
              <Button
                className="boton bio-btn-primary"
                type="submit"
                onClick={editFarmer}
              >
                Guardar
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
