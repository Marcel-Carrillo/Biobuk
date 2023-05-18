import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CreateProduct } from "../../../components/Modal/CreateProduct";
import { Col, Row, Carousel, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { EditOneProduct } from "../../../components/Modal/EditOneProduct";
import "./productList.scss";
import { BiobukContext } from "../../../context/BiobukContext";


const initialValue = {
  name: "",
  reference: "",
  crop_type: "",
  composition: "",
  description: "",
  how_to_use: "",
  minimum_amount: "",
  duration: "",
  user_id: "",
};


export const ProductsList = () => {
  const { user } = useContext(BiobukContext);
  const [products, setProducts] = useState();
  const [allProducts, setallProducts] = useState();
  const [productsImg, setProductsImg] = useState();
  const [bool, setBool] = useState(true);
  const [productEdit, setProductEdit] = useState(initialValue);
  const [imgEdit, setImgEdit] = useState();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [productsLength, setproductsLength] = useState();
  const [iteration, setIteration] = useState(0);
  const [productsCount, setProductsCount] = useState();
  const navigate = useNavigate();


  /**
   * Carga la información de todos los productos de la base de datos
   */
  useEffect(() => {
    if (bool) {
      axios
        .get(`http://localhost:4000/products/getAllProducts`)
        .then((res) => {
          setProductsImg(res.data.resultImg);
          setProductsCount(res.data.result.length);
          if (res.data.result.length <= 12) {
            setProducts(res.data.result);
          } else {
            let arrayLength = Math.ceil(res.data.result.length / 12);
            setproductsLength(arrayLength);
            let productsObject = {};
            for (let i = 0; i < arrayLength; i++) {
              productsObject["list" + i] = res.data.result.slice(
                i * 12,
                (i + 1) * 12
              );
            }
            setallProducts(productsObject);
            setProducts(productsObject.list0);
          }
          setBool(false);
        })
        .catch((err) => console.log(err));
    }
  }, [show, bool]);


  /**
   * Guarda en constantes la información e imagenes de un producto concreto
   * y abre un modal para editar su información
   */
  const modify = (product) => {
    setShow(true);
    setProductEdit(product);
    let imgProv = productsImg.filter((img) => {
      return img.product_id === product.product_id;
    });
    setImgEdit(imgProv);
  };


  /**
   * Borra de forma lógica un producto
   * @param {*} product
   */
  const deletePro = (product) => {
    axios
      .put(`http://localhost:4000/products/deleteProduct/${product.product_id}`)
      .then((res) => {
        setBool(true);
      })
      .catch((err) => console.log(err));
  };


  /**
   * Controla la paginacion del numero de productos por pantalla
   * @param {*} boton
   */
  const handleArray = (boton) => {
    if (boton === "next") {
      if (iteration + 1 < productsLength) {
        let index = Object.keys(allProducts)[iteration + 1];
        setProducts(allProducts[index]);
        setIteration((iteration) => iteration + 1);
      }
    }
    if (boton === "previous") {
      if (iteration > 0) {
        let index = Object.keys(allProducts)[iteration - 1];
        setProducts(allProducts[index]);
        setIteration((iteration) => iteration - 1);
      }
    }
  };


  return (
    <Row className="productList">
      <Col>
        <h1>Productos</h1>
        {products?.length !== 0 ? (
          <>
            {productsCount > 12 && (
              <>
                {products[0].product_id !==
                  allProducts[Object.keys(allProducts)[0]][0].product_id && (
                  <>
                    <button
                      className="shift previous"
                      onClick={() => handleArray("previous")}
                    ></button>
                  </>
                )}
                {allProducts[
                  Object.keys(allProducts)[Object.keys(allProducts).length - 1]
                ][
                  allProducts[
                    Object.keys(allProducts)[
                      Object.keys(allProducts).length - 1
                    ]
                  ].length - 1
                ].product_id !== products[products.length - 1].product_id && (
                  <button
                    className="shift next"
                    onClick={() => handleArray("next")}
                  ></button>
                )}
              </>
            )}
            {user?.type !== 0 && (
              <Button
                className="bio-btn-primary mb-3"
                onClick={() => setShow2(true)}
              >
                Crear Producto
              </Button>
            )}
            <Row>
              {products?.map((product, index) => {
                return (
                  <Col
                    xs={12}
                    md={6}
                    lg={4}
                    xl={3}
                    className="producto mb-3"
                    key={index}
                  >
                    {products.length === "1" ? "" : ""}
                    <Card className="product-card">
                      <h2>
                        <span
                          onClick={() => {
                            navigate(`/oneProduct/${product.product_id}`);
                          }}
                        >
                          {product.name}
                        </span>
                      </h2>
                      <h2
                        onClick={() => {
                          navigate(`/oneProduct/${product.product_id}`);
                        }}
                      >
                        {product.reference}
                      </h2>
                      <Carousel
                        controls={false}
                        interval={5000}
                        indicators={false}
                        onClick={() =>
                          navigate(`/oneProduct/${product.product_id}`)
                        }
                      >
                        {productsImg?.map((img, index) => {
                          if (img.product_id === product.product_id) {
                            return (
                              <Carousel.Item key={index}>
                                <img
                                  className="d-block w-100 imagenCarrusel"
                                  src={`/images/productos/${img.product_img_name}`}
                                  alt="First slide"
                                />
                              </Carousel.Item>
                            );
                          }
                        })}
                      </Carousel>
                      {user?.type !== 0 && (
                        <Row className="d-flex justify-content-center align-items-end p-3 gap-3">
                          <Col className="d-flex justify-content-end">
                            <Button
                              className="bio-btn-primary"
                              onClick={() => modify(product)}
                            >
                              <span>
                                <img src="/images/edit.svg" alt="" />
                              </span>
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              variant="danger"
                              onClick={() => deletePro(product)}
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
                      )}
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        ) : (
          <>
            <h2>Pronto llegarán los productos...</h2>
            {user?.type !== 0 && (
              <Button
                className="bio-btn-primary mb-3"
                onClick={() => setShow2(true)}
              >
                Crear Producto
              </Button>
            )}
          </>
        )}
        <EditOneProduct
          setBool={setBool}
          show={show}
          setShow={setShow}
          productEdit={productEdit}
          setProductEdit={setProductEdit}
          products={products}
          setProducts={setProducts}
          imgEdit={imgEdit}
          setImgEdit={setImgEdit}
        />
        <CreateProduct
          setBool={setBool}
          show2={show2}
          initialValue={initialValue}
          setShow2={setShow2}
          setProducts={setProducts}
        />
      </Col>
    </Row>
  );
};
