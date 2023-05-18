import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const CrearSectorModal = ({
  show,
  setShow,
  greenhouse_id,
  owner_user_id,
  setZones,
}) => {
  const handleClose = () => setShow(false);
  const [newZone, setNewZone] = useState({});
  const lastInputRef = useRef(null);
  const [enterPressed, setEnterPressed] = useState(false);

  /**
   * Hace que, después de haber rellenado los inputs, al presionar enter, guarde los datos introducidos en los inputs.
   */
  useEffect(() => {
    if (enterPressed) {
      addZone();
      setEnterPressed(false);
    }
  }, [enterPressed]);

  /**
   * Sincroniza los valores introducidos en los inputs con el innitialValue
   */
  const handleChange = (e) => {
    let { name, value } = e.target;
    setNewZone({ ...newZone, [name]: value });
  };

  /**
   * Crea un nuevo sector en el invernadero.
   */
  const addZone = () => {
    axios
      .post(
        `http://localhost:4000/users/admin/createZone/${owner_user_id}/${greenhouse_id}`,
        newZone
      )
      .then((res) => {
        setZones(res.data);
        setShow(false);
        setNewZone({});
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
        onKeyDown={handleKeyDown}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Añade una zona</Modal.Title>
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
                name="zone_name"
                value={newZone.zone_name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicExtension">
              <Form.Label>Extensión</Form.Label>
              <Form.Control
                type="text"
                placeholder="Extensión"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="extension"
                value={newZone.extension}
                ref={lastInputRef}
              />
            </Form.Group>
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
            onClick={addZone}
          >
            Añadir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
