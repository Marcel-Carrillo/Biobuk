import React, { useContext, useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BiobukContext } from "../../context/BiobukContext";

export const CreateProduct = ({ show2, setShow2, initialValue, setBool }) => {
  const [productData, setProductData] = useState(initialValue);
  const [message, setMessage] = useState();
  const { user } = useContext(BiobukContext);
  const [productFiles, setProductFiles] = useState();

  /**
   * Cierra el modal borrando todos los datos de los campos.
   */
  const handleClose = () => {
    setShow2(false);
    setProductData(initialValue);
    setMessage("");
  };

  /**
   * Carga las imagenes de los productos y las guarda.
   */
  const handleFiles = (e) => {
    setProductFiles(e.target.files);
  };

  /**
   * Sincroniza los valores introducidos en los inputs con el innitialValue
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  /**
   * Valida los campos de los imput y los guarda en la base de datos, cirerra el modal y borra los campos de los imput.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      productData.name === "" ||
      productData.reference === "" ||
      productData.crop_type === "" ||
      productData.composition === "" ||
      productData.description === ""
    ) {
      setMessage("Debes rellenar todos los campos");
    } else if (productData.duration < 0) {
      setMessage("El valor de la duración no es válida");
    } else {
      const newFormData = new FormData();
      if (productFiles) {
        for (let file of productFiles) {
          newFormData.append("file", file);
        }
      }

      newFormData.append("newProduct", JSON.stringify(productData));

      e.preventDefault();
      axios
        .post(
          `http://localhost:4000/products/createProduct/${user.user_id}`,
          newFormData
        )

        .then((res) => {
          setBool(true);
          setShow2(false);
          setProductData(initialValue);
          setMessage("");
          e.preventDefault();
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
        show={show2}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear un producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="name"
                value={productData.name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Referencia *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Referencia"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="reference"
                value={productData.reference}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Tipo de cultivo *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tipo de cultivo"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="crop_type"
                value={productData.crop_type}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Composición *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Composición"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="composition"
                value={productData.composition}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Descripción *</Form.Label>
              <Form.Control
                type="textarea"
                placeholder="Descripción"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="description"
                value={productData.description}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Como se usa *</Form.Label>
              <Form.Control
                type="textarea"
                placeholder="Como se usa"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="how_to_use"
                value={productData.how_to_use}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Cantidad mínima</Form.Label>
              <Form.Control
                type="text"
                placeholder="Cantidad mínima"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="minimum_amount"
                value={productData.minimum_amount}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Duración</Form.Label>
              <Form.Control
                type="number"
                placeholder="Duración"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="duration"
                value={productData.duration}
              />
            </Form.Group>

            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" onChange={handleFiles} multiple />
            </Form.Group>
            {message && <h2 className="alert alert-danger">{message}</h2>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="bio-btn-primary"
            onClick={handleFormSubmit}
          >
            Añadir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
