import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "./editOneProduct.scss";
export const EditOneProduct = ({
  show,
  setShow,
  productEdit,
  setProductEdit,
  imgEdit,
  setImgEdit,
  setBool,
}) => {
  const [productFiles, setProductFiles] = useState();
  const [message, setMessage] = useState("");

  /**
   * Sincroniza los valores introducidos en los inputs con el innitialValue.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductEdit({ ...productEdit, [name]: value });
  };

  /**
   * Carga las imagenes de los productos y las guarda.
   */
  const handleFiles = (e) => {
    setProductFiles(e.target.files);
  };

  /**
   * cierra el modal.
   */
  const handleClose = () => {
    setShow(false);
  };

  /**
   * Elimina una imagen de un producto.
   */
  const delImg = (id) => {
    axios
      .put(`http://localhost:4000/products/deleteImg/${id}`)
      .then((res) => {
        const imgProv = imgEdit.filter((img) => img.product_img_id !== id);
        setImgEdit(imgProv);
      })
      .catch((err) => console.log(err));
  };

  /**
   * Valida los campos de los imput y los guarda en la base de datos. Muetra un error en caso de que los campos no estén rellenos correctamente.
   */
  const handleSubmit = () => {
    let productProv = { ...productEdit };
    if (productProv.product_id === productEdit.product_id) {
      productProv.name = productEdit.name;
      productProv.reference = productEdit.reference;
      productProv.crop_type = productEdit.crop_type;
      productProv.composition = productEdit.composition;
      productProv.description = productEdit.description;
      productProv.how_to_use = productEdit.how_to_use;
      productProv.minimum_amount = productEdit.minimum_amount;
      productProv.duration = productEdit.duration;
      productProv.user_id = productEdit.user_id;
    }

    if (
      productEdit.name === "" ||
      productEdit.reference === "" ||
      productEdit.crop_type === "" ||
      productEdit.composition === "" ||
      productEdit.description === ""
    ) {
      setMessage("Debes de rellenar todos los campos obligatorios");
    } else if (productEdit.duration < 0) {
      setMessage("El campo de la duración no es valida");
    } else {
      const newFormData = new FormData();
      if (productFiles) {
        for (let file of productFiles) {
          newFormData.append("file", file);
        }
      }

      newFormData.append("editProduct", JSON.stringify(productEdit));

      axios
        .put(
          `http://localhost:4000/products/editProduct/${productEdit.product_id}`,
          newFormData
        )
        .then((res) => {
          console.log(productProv);
          setProductEdit(productProv);
          setBool(true);
          setShow(false);
        })
        .catch((err) => console.log(err));
      setMessage("Debes de rellenar todos los campos obligatorios");
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
    <Modal show={show} onHide={handleClose} className="modalEditOneProduct">
      <Modal.Body className="botoncito">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nombre*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Cambiar nombre"
              name="name"
              value={productEdit?.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Referencia*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Cambiar referencia"
              name="reference"
              value={productEdit?.reference}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Tipo de cultivo*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Cambiar tipo de cultivo"
              name="crop_type"
              value={productEdit?.crop_type}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Composición*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Cambiar composicion"
              name="composition"
              value={productEdit?.composition}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Descripción*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Cambiar descripción"
              name="description"
              value={productEdit?.description}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Uso*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Uso"
              name="how_to_use"
              value={productEdit?.how_to_use}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Cantidad mínima</Form.Label>
            <Form.Control
              type="text"
              placeholder="Cantidad minima"
              name="minimum_amount"
              value={productEdit?.minimum_amount}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Duración</Form.Label>
            <Form.Control
              type="text"
              placeholder="Duración"
              name="duration"
              value={productEdit?.duration}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          {message !== "" && <h1 className="alert alert-danger">{message}</h1>}
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" onChange={handleFiles} multiple />
          </Form.Group>
        </Form>
        <div>
          {imgEdit?.map((img, index) => {
            return (
              <div key={index} className="contenedorFoto">
                <img
                  src={`/images/productos/${img.product_img_name}`}
                  alt="First slide"
                />
                <Button
                  onClick={() => delImg(img.product_img_id)}
                  variant="danger"
                  className="delete"
                >
                  <img alt="" src="/images/delete.svg" />
                </Button>
              </div>
            );
          })}
        </div>
        <Button className="bio-btn-primary" onClick={handleSubmit}>
          Cambiar
        </Button>
      </Modal.Body>
    </Modal>
  );
};
