import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Row, Table, Button, Form, Col } from "react-bootstrap";
import { BiobukContext } from "../../../context/BiobukContext";
import { useNavigate } from "react-router-dom";
import "./shoppingCart.scss";
import StripeContainer from "../../../StripeContainer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const innitialValue = {
  address: "",
  city: "",
  province: "",
  country: "",
};


export const ShoppingCart = () => {
  const { user, publicKey } = useContext(BiobukContext);
  const [cartProduct, setCartProducts] = useState([]);
  const [shippingAddresses, getShippingAddresses] = useState([]);
  const [finalPrice, setFinalPrice] = useState();
  const [refresh, setRefresh] = useState(true);
  const [address, setAddress] = useState("");
  const [addressInput, setAddressInput] = useState(innitialValue);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [succeeded, setSucceeded] = useState(false);
  const [warning, setWarning] = useState();
  const [error, setError] = useState(null);


  const STRIPE_PUBLIC_KEY = publicKey;


  /**
   * Carga y guarda la información del carrito del agricultor,
   * la información de las direcciones de envio
   */
  useEffect(() => {
    if (refresh) {
      axios
        .get(
          `http://localhost:4000/users/farmer/getShoppingCart/${user.user_id}`
        )
        .then((res) => {
          setCartProducts(res.data);

          setRefresh(false);

          let current = 0;
          res.data.map((element) => {
            current += parseFloat(element.price * element.quantity);
          });
          setFinalPrice(current.toFixed(2));
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(
          `http://localhost:4000/users/farmer/getShippingAddresses/${user.user_id}`
        )
        .then((res) => {
          getShippingAddresses(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [refresh]);


  /**
   * Controla la suma o resta, en una unidad, de los productos del carritos
   * @param {*} number
   * @param {*} id
   * @param {*} stock
   */
  const handleQuantity = (number, id, stock) => {
    if (number <= 0 || number > stock) {
    } else {
      let object = { quantity: number };

      axios
        .put(
          `http://localhost:4000/users/farmer/newQuantity/${user.user_id}/${id}`,
          object
        )
        .then(() => {
          setRefresh(true);
          setFinalPrice(0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };


  /**
   * Borra del carrito de compra un producto
   * @param {*} id
   */
  const handleDelete = (id) => {
    axios
      .delete(
        `http://localhost:4000/users/farmer/deleteCartProduct/${user.user_id}/${id}`
      )
      .then(() => {
        setRefresh(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  /**
   * Guarda la selección de la dirección de envio
   * @param {*} element
   */
  const handleCheck = (element) => {
    setAddress(element);
  };


  /**
   * Controla los valores de edición de los campos
   * @param {*} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressInput({ ...addressInput, [name]: value });
  };


  /**
   * Crea una nueva dirección de envio para el agricultor
   * y se añade a la lista actual
   */
  const handleNewAddress = (e) => {
    e.preventDefault();
    if (
      addressInput.address !== "" &&
      addressInput.city !== "" &&
      addressInput.province !== "" &&
      addressInput.country !== ""
    ) {
      axios
        .post(
          `http://localhost:4000/users/farmer/addShippingAddress/${user.user_id}`,
          addressInput
        )
        .then((res) => {
          setRefresh(true);
          setAddressInput(innitialValue);
          setWarning("");
          setMessage("");
          setShow(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setWarning("Rellena todos los campos");
    }
  };


  /**
   * Realiza la compra actual.
   * Añade todos los productos del carrito a un nuevo pedido
   */
  const handlePurchase = (e) => {
    if (
      address === undefined ||
      address === "" ||
      address === null ||
      address === {}
    ) {
      setError("Debes crear y seleccionar una dirección de envío");
    } else {
      axios
        .post(
          `http://localhost:4000/users/farmer/newOrder/${user.user_id}/${address.shipping_address_id}`,
          cartProduct
        )
        .then((res) => {
          setSucceeded(true);
          setTimeout(() => {
            navigate(`/confirmPurchase/${res.data}`);
          }, 5000);
        })
        .catch((err) => {
          console.log(err);
          setError("Debes crear y seleccionar una dirección de envío");
        });
    }
  };


  /**
   * Borra una dirección de envío del usuario
   * @param {*} id
   */
  const handleDeleteAddress = (id) => {
    axios
      .put(`http://localhost:4000/users/farmer/deleteShippingAddress/${id}`)
      .then(setRefresh(true))
      .catch((error) => console.log(error));
  };

  
  return (
    <Row className="shoppingCart">
      {cartProduct?.length !== 0 ? (
        <>
          <Table>
            <thead>
              <tr>
                <th>Tienda</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartProduct &&
                cartProduct.map((element) => {
                  return (
                    <tr>
                      <td>{element.shop_name}</td>

                      <td>
                        <span
                          onClick={() =>
                            navigate(`/oneProduct/${element.product_id}`)
                          }
                        >
                          {element.name}
                        </span>
                      </td>
                      <td>
                        <Button
                          className="bio-btn-primary mx-2"
                          onClick={() =>
                            handleQuantity(
                              element.quantity - 1,
                              element.shop_product_id,
                              element.stock
                            )
                          }
                        >
                          -
                        </Button>
                        {element.quantity}
                        <Button
                          className="bio-btn-primary mx-2"
                          onClick={() =>
                            handleQuantity(
                              element.quantity + 1,
                              element.shop_product_id,
                              element.stock
                            )
                          }
                        >
                          +
                        </Button>
                      </td>
                      <td>{element.price} €</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(element.shop_product_id)}
                        >
                          Borrar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr>
                <th>Precio total</th>
                <td colSpan={2}></td>
                <th>{finalPrice} €</th>
                <td></td>
              </tr>
            </tfoot>
          </Table>
          {message && <h4>{message}</h4>}
          <h1>Direcciones de envío</h1>
          {shippingAddresses &&
            shippingAddresses.map((element, index) => {
              return (
                <Row>
                  <Col className="checkAddress">
                    <Form.Check
                      name="address"
                      value={address.address}
                      onChange={() => handleCheck(element)}
                      type="radio"
                      label={`${element.address} - ${element.city}- ${element.province} - ${element.country}`}
                    />
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDeleteAddress(element.shipping_address_id)
                      }
                    >
                      <span>
                        <img
                          className="papelera"
                          src="/images/delete.svg"
                          alt=""
                        />
                      </span>
                    </Button>
                  </Col>
                </Row>
              );
            })}
          <Col xs={12} className="mb-3">
            <Button className="bio-btn-primary" onClick={() => setShow(!show)}>
              {show ? "Cerrar" : "Nueva dirección"}
            </Button>
          </Col>
          {show && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Dirección*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Dirección"
                  name="address"
                  value={addressInput.address}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ciudad*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ciudad"
                  name="city"
                  value={addressInput.city}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Provincia*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Provincia"
                  name="province"
                  value={addressInput.province}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>País*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="País"
                  name="country"
                  value={addressInput.country}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button className="bio-btn-primary" onClick={handleNewAddress}>
                Crear
              </Button>
              {warning && (
                <h1 className="alert alert-danger text-center mt-3">
                  {warning}
                </h1>
              )}
            </Form>
          )}
          <Elements stripe={loadStripe(STRIPE_PUBLIC_KEY)}>
            <StripeContainer
              handlePurchase={handlePurchase}
              user={user}
              setMessage={setMessage}
              address={address}
              finalPrice={finalPrice}
              succeeded={succeeded}
              setSucceeded={setSucceeded}
              error={error}
              setError={setError}
            />
          </Elements>
        </>
      ) : (
        <>
          <Col xs={12}>
            <h1>
              Aún no tienes ningún producto en el carrito. ¡Tal vez sea el
              momento de añadir algo!
            </h1>
            <Button
              className="bio-btn-primary"
              onClick={() => navigate("/products")}
            >
              Ver Productos
            </Button>
          </Col>
        </>
      )}
    </Row>
  );
};
