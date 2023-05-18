import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BiobukContext } from "../../context/BiobukContext";

const initialValues = {
  name: "",
  price: "",
  product_id: "",
  reference: "",
  shop_product_id: "",
  stock: "",
};
export const EditShopProduct = ({
  show,
  setShow,
  shop_id,
  editShopProduct,
  setShopProducts,
  shopName,
}) => {
  const [edit, setEdit] = useState(initialValues);
  const [enterPressed, setEnterPressed] = useState(false);
  const lastInputRef = useRef(null);

  useEffect(() => {
    setEdit(editShopProduct);
  }, [show]);

  useEffect(() => {
    if (enterPressed) {
      handleFormSubmit();
      setEnterPressed(false);
    }
  }, [enterPressed]);

  /**
   * cierra el modal y limpia los campos de los inputs.
   */
  const handleClose = () => {
    setEdit(initialValues);
    setShow(false);
  };

  /**
   * Sincroniza los valores introducidos en los inputs con el innitialValue.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit({ ...edit, [name]: value });
  };

  /**
   * Valida los campos de los imput y los guarda en la base de datos. Limpia los campos de los inputs y cierra el modal.
   */
  const handleFormSubmit = () => {
    axios
      .put(
        `http://localhost:4000/shops/editShopProduct/${shop_id}/${editShopProduct.shop_product_id}`,
        edit
      )
      .then((res) => {
        setShopProducts(res.data);
        setEdit(initialValues);
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
      if (index === inputs.length - 1) {
        lastInputRef.current.focus();
        setEnterPressed(!enterPressed);
      } else {
        inputs[index + 1].focus();
      }
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
          <Modal.Title>Editar producto {editShopProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="price"
                value={edit?.price}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Stock"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="stock"
                value={edit?.stock}
                ref={lastInputRef}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
          <Button
            className="bio-btn-primary"
            type="submit"
            onClick={handleFormSubmit}
          >
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
