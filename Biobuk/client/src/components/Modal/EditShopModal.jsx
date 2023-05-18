import React, { useContext, useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BiobukContext } from "../../context/BiobukContext";

const initialValues = {
  address: "",
  city: "",
  country: "",
  deleted: "",
  name: "",
  owner_user_id: "",
  province: "",
  shop_id: "",
  shop_img: "",
};

export const EditShopModal = ({
  show,
  setShow,
  setShops,
  shopEdit,
  setShopEdit,
  setRefresh,
}) => {
  const { user } = useContext(BiobukContext);
  const [shopFileEdit, setShopFileEdit] = useState();

  /**
   * cierra el modal y limpia los campos de los inputs.
   */
  const handleClose = () => {
    setShopEdit(initialValues);
    setShow(false);
  };

  /**
   * Sincroniza los valores introducidos en los inputs con el innitialValue.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopEdit({ ...shopEdit, [name]: value });
  };

  /**
   * Carga las imagenes de los productos y las guarda.
   */
  const handleFile = (e) => {
    setShopFileEdit(e.target.files[0]);
  };

  /**
   * Valida los campos de los imput y los guarda en la base de datos. Limpia los campos de los inputs y cierra el modal.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newFormData = new FormData();
    newFormData.append("newShop", JSON.stringify(shopEdit));

    if (shopFileEdit) {
      newFormData.append("file", shopFileEdit);
    }

    axios
      .put(
        `http://localhost:4000/shops/editShop/${user.user_id}/${shopEdit.shop_id}`,
        newFormData
      )
      .then((res) => {
        setShops(res.data);
        setShopEdit("");
        setShow(false);
      })
      .catch((err) => console.log(err));
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

  /**
   * Elimina la tienda.
   */
  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:4000/shops/deleteShop/${shopEdit.shop_id}`)
      .then((res) => {
        setRefresh(true);
        setShow(false);
      })
      .catch((err) => console.log(err));
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
          <Modal.Title>Editar una tienda</Modal.Title>
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
                value={shopEdit?.name}
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
                value={shopEdit?.address}
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
                value={shopEdit?.city}
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
                value={shopEdit?.province}
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
                value={shopEdit?.country}
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Imagen de la tienda</Form.Label>
              <Form.Control type="file" onChange={handleFile} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            <Button variant="danger" onClick={handleDelete}>
              Borrar Definitivamente
            </Button>
          </div>
          <div>
            <Button variant="outline-danger" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit" onClick={handleFormSubmit}>
              Añadir
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
