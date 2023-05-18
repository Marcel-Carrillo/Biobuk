import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Col, Row, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiobukContext } from "../../../context/BiobukContext";


const initialUser = {
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


export const EditShopProfile = () => {
  const { setUser } = useContext(BiobukContext);
  const { owner_id } = useParams();
  const [editedOwner, setEditedOwner] = useState(initialUser);
  const [editedOwnerFiles, setOwnerFarmerFiles] = useState(initialUser);
  const navigate = useNavigate();


  /**
   * Carga y guarda la información de un propietario de tienda
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/getOneUser/${owner_id}`)
      .then((res) => {
        setEditedOwner(res.data.resultUser[0]);
      })
      .catch((err) => console.log(err));
  }, [owner_id]);

  /**
   * Controla los valores de los campos de edición de un propietario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedOwner({ ...editedOwner, [name]: value });
  };


  /**
   * Guarda la nueva foto de un propietario
   */
  const handleFile = (e) => {
    setOwnerFarmerFiles(e.target.files[0]);
  };

  
  /**
   * Edita la información de un propietario de tienda
   */
  const editOwner = (e) => {
    e.preventDefault();
    const newFormData = new FormData();
    newFormData.append("farmer", JSON.stringify(editedOwner));

    if (editedOwnerFiles) {
      newFormData.append("file", editedOwnerFiles);
    }

    axios
      .put(`http://localhost:4000/users/editOneUser/${owner_id}`, newFormData)
      .then((res) => {
        setUser(res.data[0]);
        navigate(`/shop/${owner_id}`);
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
                    name="name"
                    value={editedOwner.name}
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
                    name="lastname"
                    value={editedOwner.lastname}
                  />
                </Form.Group>

                <Form.Group className=" label mb-3" controlId="formBasicDNI">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="DNI"
                    onChange={handleChange}
                    name="dni"
                    value={editedOwner.dni}
                  />
                </Form.Group>

                <Form.Group className=" label mb-3" controlId="formBasicPhone">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="Teléfono"
                    onChange={handleChange}
                    name="phone"
                    value={editedOwner.phone}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    className="label"
                    type="text"
                    placeholder="Dirección"
                    onChange={handleChange}
                    name="address"
                    value={editedOwner.address}
                  />
                </Form.Group>
                <Form.Group controlId="formFile" className=" label mb-3">
                  <Form.Label>Imagen de perfil</Form.Label>
                  <Form.Control type="file" onChange={handleFile} />
                </Form.Group>
              </Form>
              <Button
                className="bio-btn-primary"
                type="submit"
                onClick={editOwner}
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
