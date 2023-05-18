import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Carousel, Col, Row, Form, Button, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiobukContext } from "../../../context/BiobukContext";
import "./oneProduct.scss";
export const OneProduct = () => {
  const { user } = useContext(BiobukContext);
  const { product_id } = useParams();
  const [product, setProduct] = useState();
  const [images, setImages] = useState();
  const [commentaries, setCommentaries] = useState();
  const [farmers, setFarmers] = useState();
  const [farmerList, setFarmerList] = useState();
  const [farmerSearch, setFarmerSearch] = useState("");
  const [rating, setRating] = useState(1);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [shopPrices, setShopsPrices] = useState("");
  const [quantity, setQuantity] = useState({ quantity: 0 });
  const [message, setMessage] = useState("");
  const [cartList, setCartList] = useState([]);
  const navigate = useNavigate();

  /**
   * Carga el carrito de compra del agricultor
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/farmer/getShoppingCart/${user.user_id}`)
      .then((res) => {
        let provList = [];
        res.data.map((element) => {
          provList.push(element.shop_product_id);
        });
        setCartList(provList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /**
   * Carga y guarda la información de un producto y sus imagenes
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/products/getOneProduct/${product_id}`)
      .then((res) => {
        setProduct(res.data.result);
        setImages(res.data.resultImg);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [product_id]);

  /**
   * Carga y guarda los agricultores que han usado un producto y genera una lista de los mismos
   */
  useEffect(() => {
    axios
      .get(
        `http://localhost:4000/users/admin/getAllFarmersProduct/${product_id}`
      )
      .then((res) => {
        setFarmers(res.data.result);
        setFarmerList(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [product_id]);

  /**
   * Carga y guarda los comentarios de un producto especifico
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/products/comments/${product_id}`)
      .then((res) => {
        setCommentaries(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [product_id]);

  /**
   * Carga y guarda la información de las tiendas que comercializan con un producto especifico
   */
  useEffect(() => {
    axios
      .get(`http://localhost:4000/products/getShopsPrices/${product_id}`)
      .then((res) => {
        setShopsPrices(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [message]);

  /**
   * Controla el nombre del buscador de la lista de agricultores
   */
  const handleChange = (e) => {
    e.preventDefault();
    setFarmerSearch(e.target.value);
  };

  /**
   * Actualiza la lista de agricultores visible
   */
  const handleClick = (e) => {
    e.preventDefault();

    if (farmerSearch !== "") {
      setFarmerList(
        farmers.filter((elem) =>
          elem.name.toLowerCase().includes(farmerSearch.toLowerCase())
        )
      );
    } else if (farmerSearch === "") {
      setFarmerList(farmers);
    }
  };

  /**
   * Realiza la publicación de un comentario
   */
  const publishComment = () => {
    const commentary_text = comment;

    axios
      .post(
        `http://localhost:4000/users/farmer/postComment/${user.user_id}/${product_id}`,
        { rating, commentary_text }
      )
      .then((res) => {
        setCommentaries(res.data);
        setRating(1);
        setHover(1);
        setComment("");
      })
      .catch((error) => console.log(error));
  };

  /**
   * Borrado de comentarios por parte del administrador
   * @param {*} commentary_id
   */
  const deleteComment = (commentary_id) => {
    axios
      .post(
        `http://localhost:4000/users/admin/deleteComment/${commentary_id}/${product_id}`
      )
      .then((res) => {
        setCommentaries(res.data);
      });
  };

  /**
   * Controla la cantidad de productos para añadir al carrito de compra del agricultor
   * @param {*} stock
   */
  const handleQuantity = (e, stock) => {
    let { name, value } = e.target;
    if (value > stock) {
      e.target.value = stock;
    } else if (value < 0) {
      e.target.value = 0;
    }
    setQuantity({ ...quantity, [name]: value });
  };

  /**
   * Añadir un producto al carrito de compra del agricultor
   * @param {*} shop_product_id
   */
  const handleCart = (e, shop_product_id) => {
    e.preventDefault();
    if (quantity.quantity > 0) {
      e.target.disabled = true;
      axios
        .post(
          `http://localhost:4000/users/farmer/addProductToCart/${user.user_id}/${shop_product_id}`,
          quantity
        )
        .then((res) => {
          setMessage("¡El producto ha sido añadido al carrito!");
          setTimeout(() => {
            setMessage("");
          }, 5000);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://localhost:4000/users/farmer/getShoppingCart/${user.user_id}`
        )
        .then((res) => {
          let provList = [];
          res.data.map((element) => {
            provList.push(element);
          });
          setCartList(provList);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setMessage("Introduce una cantidad");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  return (
    <Row className="oneProduct">
      {product && (
        <>
          <h1 className="text-center">{product[0].name}</h1>
          <Col
            xs={12}
            lg={6}
            className={
              "d-flex justify-content-center align-items-center mb-5 p-3"
            }
          >
            {images.length === 0 ? (
              <>
                <img
                  className="img-onePro"
                  src={`/images/product_default.jpg`}
                  alt={product[0].name}
                />
              </>
            ) : images.length === 1 ? (
              <>
                <img
                  className="img-onePro"
                  src={`/images/productos/${images[0].product_img_name}`}
                  alt={product[0].name}
                />
              </>
            ) : (
              images.length > 1 && (
                <Carousel className="carousel-onePro" variant="dark">
                  {images.map((img) => {
                    if (img.product_id === product[0].product_id) {
                      return (
                        <Carousel.Item
                          className="imgCarr"
                          key={product_id * Math.random()}
                        >
                          <img
                            src={`/images/productos/${img.product_img_name}`}
                            alt="First slide"
                          />
                        </Carousel.Item>
                      );
                    }
                  })}
                </Carousel>
              )
            )}
          </Col>
          <Col
            xs={12}
            lg={6}
            className="d-flex flex-column justify-content-center mb-3 p-3"
          >
            <ul className="product-list-size">
              <li>
                <strong>Referencia:</strong> {product[0].reference}
              </li>
              <li>
                <strong>Tipo de cultivos:</strong> {product[0].crop_type}
              </li>
              <li className="justify-text">
                <strong>Composición:</strong> {product[0].composition}
              </li>
              <li className="justify-text">
                <strong>Descripción:</strong> {product[0].description}
              </li>
              <li className="justify-text">
                <strong>Modo de empleo:</strong> {product[0].how_to_use}
              </li>
              <li>
                <strong>Cantidad de minima de compra:</strong>{" "}
                {product[0].minimum_amount}
              </li>
              <li>
                <strong>Duración:</strong> {product[0].duration}
              </li>
            </ul>
          </Col>
        </>
      )}
      {user?.type === 2 && (
        <>
          <Col
            xs={12}
            className="d-flex justify-content-center mb-3 gap-4 search-div"
          >
            <Form.Control
              type="search"
              name="name"
              value={farmerSearch.name}
              onChange={handleChange}
              className="w-75"
            />
            <Button className="bio-btn-primary" onClick={handleClick}>
              Buscar
            </Button>
          </Col>
          <h3 className="text-center">
            Lista de agricultores que han usado este producto
          </h3>
          <Table striped hover responsive className="table-product mb-5">
            <thead>
              <tr>
                <th>#</th>
                <th>Agricultor</th>
              </tr>
            </thead>
            <tbody>
              {farmerList &&
                farmerList.map((farmer, index) => {
                  return (
                    <tr
                      className="pulsarNombre"
                      key={index}
                      onClick={() =>
                        navigate(`/farmerProfile/${farmer.user_id}`)
                      }
                    >
                      <td>{index + 1}</td>
                      <td>
                        {farmer.name} {farmer.lastname}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </>
      )}
      {user?.type === 0 && shopPrices.length > 0 && (
        <>
          <Table className="oneProductTable mx-auto">
            <thead>
              <tr>
                <th>Tienda</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Unidades:</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shopPrices &&
                shopPrices.map((element, index) => {
                  return (
                    <tr key={index}>
                      <td>{element.name}</td>
                      <td>{element.price}</td>
                      <td>{element.stock}</td>
                      <th>
                        {element?.stock > 0 ? (
                          <>
                            <Form.Control
                              type="number"
                              name="quantity"
                              onChange={(e) => handleQuantity(e, element.stock)}
                              disabled={cartList.includes(
                                element.shop_product_id
                              )}
                            ></Form.Control>
                          </>
                        ) : (
                          <>No queda stock de este producto.</>
                        )}
                      </th>

                      <th>
                        {element?.stock > 0 && (
                          <Button
                            onClick={(e) =>
                              handleCart(e, element.shop_product_id)
                            }
                            disabled={cartList.includes(
                              element.shop_product_id
                            )}
                            className="bio-btn-primary"
                          >
                            Añadir al carrito
                          </Button>
                        )}
                      </th>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          {message && <h4>{message}</h4>}
        </>
      )}
      {user?.type === 0 && (
        <>
          <div className="comment mb-5">
            <h3 className="text-center">Valorar Producto</h3>
            <Form.Control
              className="mb-3 textarea-product"
              as="textarea"
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="d-flex justify-content-center gap-5">
              <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <button
                      type="button"
                      key={index}
                      className={`rating ${
                        index <= (hover || rating) ? "on" : "off"
                      }`}
                      onClick={() => setRating(index)}
                      onMouseEnter={() => setHover(index)}
                      onMouseLeave={() => setHover(rating)}
                    >
                      <span className="star">&#9733;</span>
                    </button>
                  );
                })}
              </div>
              <Button className="bio-btn-primary" onClick={publishComment}>
                Publicar Comentario
              </Button>
            </div>
          </div>
        </>
      )}
      <Row className="commentary">
        <h3 className="text-center">Comentarios</h3>
        {commentaries &&
          commentaries.map((element, index) => {
            return (
              <Col xs={12} md={6} className="d-flex p-3 gap-2" key={index}>
                {user?.type === 2 && (
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      variant="danger"
                      className="btn-fix"
                      onClick={() => deleteComment(element.commentary_id)}
                    >
                      <span>
                        <img src="/images/delete.svg" alt="" />
                      </span>
                    </Button>
                  </div>
                )}
                <div>
                  <div>
                    {[...Array(element.rating)].map((star) => {
                      return (
                        <span key={Math.random() * 1000} className="star on">
                          &#9733;
                        </span>
                      );
                    })}
                  </div>
                  <p key={index}>
                    {element.name} {element.lastname} -{" "}
                    {element.commentary_text}
                  </p>
                </div>
              </Col>
            );
          })}
      </Row>
    </Row>
  );
};
