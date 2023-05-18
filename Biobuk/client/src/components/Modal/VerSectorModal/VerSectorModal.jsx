import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Modal, Table } from "react-bootstrap";
import { BiobukContext } from "../../../context/BiobukContext";
import { SingleProductRow } from "./SingleProductRow";
import "./VerSectorModal.scss";

const innitialValue = {
  product_id: null,
  concentration: 0,
  application_date: new Date().toISOString().slice(0, 10),
};

export const VerSectorModal = ({ show, setShow, zone, name }) => {
  const { user } = useContext(BiobukContext);
  const [data, setData] = useState();
  const [product, setProduct] = useState();
  const [newProduct, setNewProduct] = useState(innitialValue);
  const [message, setMessage] = useState("");

  /**
   * Cierra el modal
   */
  const handleClose = () => {
    setShow(false);
    setNewProduct(innitialValue);
  };

  /**
   * Sincroniza los valores introducidos en los inputs con el innitialValue
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  /**
   * Recoge información de la concentración de un producto que se aplica en una zona y lo gurada en la base de datos, mostrando un mensaje en el caso que los datos introducidos no sean correctos.
   */
  const handleAddProduct = (e) => {
    if (
      newProduct.product_id &&
      newProduct.concentration &&
      newProduct.concentration !== 0 &&
      newProduct.application_date
    ) {
      e.preventDefault();
      axios
        .post(
          `http://localhost:4000/users/farmer/addProductToZone/${zone.zone_id}`,
          newProduct
        )
        .then((res) => {
          setMessage("");
          handleClose();
        })
        .catch((err) => console.log(err));
    } else {
      setMessage("Selecciona producto y concentración");
    }
  };

  /**
   * Muestra todos los productos aplicados en una zona de un invernadero.
   */
  useEffect(() => {
    if (show) {
      axios
        .get(
          `http://localhost:4000/users/farmer/getZoneProducts/${zone?.zone_id}`
        )
        .then((res) => setData(res.data))
        .catch((err) => console.log(err));
    }
  }, [show]);

  /**
   * Mustra todos los productos.
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/products/getAllProducts`)
      .then((res) => setProduct(res.data.result))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {data && (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          dialogClassName="modal-95vw"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Lista de productos aplicados en la zona {name && name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={"scroll-sector"}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Concentración</th>
                  <th>Fecha</th>
                  {user?.type === 0 && (
                    <>
                      <th colSpan={2}></th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((row, index) => {
                    return (
                      <SingleProductRow
                        key={index}
                        product={row}
                        zone_id={zone.zone_id}
                        setShow={setShow}
                      />
                    );
                  })}
              </tbody>
              {user?.type === 0 && (
                <>
                  <tfoot>
                    <tr>
                      <td>
                        <Form.Select name="product_id" onChange={handleChange}>
                          <option value="">---</option>
                          {product &&
                            product?.map((product) => {
                              return (
                                <option
                                  value={product.product_id}
                                  key={product.product_id}
                                >
                                  {product.name}
                                </option>
                              );
                            })}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          placeholder="Concentratión"
                          type="number"
                          step="0.01"
                          name="concentration"
                          value={newProduct.concentration}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="date"
                          name="application_date"
                          value={newProduct.application_date}
                          onChange={handleChange}
                        />
                      </td>
                      <td className="text-center" colSpan={2}>
                        <Button
                          className="bio-btn-primary"
                          onClick={handleAddProduct}
                        >
                          Añadir producto
                        </Button>
                      </td>
                    </tr>
                  </tfoot>
                </>
              )}
            </Table>
            {message !== "" && (
              <h1 className="alert alert-danger text-center">{message}</h1>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
