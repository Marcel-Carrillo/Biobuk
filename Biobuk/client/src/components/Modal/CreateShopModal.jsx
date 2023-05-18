import React, { useContext, useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BiobukContext } from "../../context/BiobukContext";

const innitialValue = {
  name: "",
  address: "",
  city: "",
  province: "",
  country: "",
};

export const CreateShopModal = ({ show, setShow, setShops, setRefresh }) => {
  const { user } = useContext(BiobukContext);
  const [newShop, setNewShop] = useState(innitialValue);
  const [shopFile, setShopFile] = useState();
  const [message, setMessage] = useState();

  /**
   * cierra el modal y limpia los campos de los inputs.
   */
  const handleClose = () => {
    setNewShop(innitialValue);
    setShow(false);
  };

  /**
   * Sincroniza los valores introducidos en los inputs con el innitialValue
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewShop({ ...newShop, [name]: value });
  };

  /**
   * Carga las imagenes de los productos y las guarda.
   */
  const handleFile = (e) => {
    setShopFile(e.target.files[0]);
  };

  /**
   * Valida los campos de los imput y los guarda en la base de datos, cirerra el modal y borra los campos de los imput.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newFormData = new FormData();
    newFormData.append("newShop", JSON.stringify(newShop));

    if (shopFile) {
      newFormData.append("file", shopFile);
    }

    if (
      newShop.name === "" ||
      newShop.address === "" ||
      newShop.city === "" ||
      newShop.province === "" ||
      newShop.country === ""
    ) {
      setMessage("Debes rellenar todos los campos");
    } else {
      axios
        .post(
          `http://localhost:4000/shops/createShop/${user.user_id}`,
          newFormData
        )
        .then((res) => {
          e.preventDefault();
          setShops(res.data);
          setNewShop(innitialValue);
          setRefresh(true);
          setShow(false);
        })
        .catch((err) => console.log(err));
    }
  };

  /**
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
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear una tienda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="name"
                value={newShop.name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Dirección"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="address"
                value={newShop.address}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ciudad"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="city"
                value={newShop.city}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Provincia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Provincia"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="province"
                value={newShop.province}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>País</Form.Label>
              <Form.Control
                type="text"
                placeholder="País"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="country"
                value={newShop.country}
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Imagen de la tienda</Form.Label>
              <Form.Control type="file" onChange={handleFile} />
            </Form.Group>
            {message && (
              <h2 className="alert alert-danger">
                {" "}
                Debes rellenar todos los campos
              </h2>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" type="submit" onClick={handleFormSubmit}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
