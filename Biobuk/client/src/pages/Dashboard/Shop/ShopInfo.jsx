import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { EditShopProduct } from "../../../components/Modal/EditShopProductModal";
import { AddShopProduct } from "./AddShopProduct";
import "./ShopInfo.scss";

const initialValues = {
  name: "",
  price: "",
  product_id: "",
  reference: "",
  shop_product_id: "",
  stock: "",
};

export const ShopInfo = () => {
  const { shop_id } = useParams();
  const [shop, setShop] = useState();
  const [shopProducts, setShopProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [editShopProduct, setEditShopProduct] = useState(initialValues);
  const navigate = useNavigate();

  /**
   * Carga y guarda la información de una tienda especifica
   * y los productos que tiene a la venta
   */

  useEffect(() => {
    axios
      .get(`http://localhost:4000/shops/getOneShop/${shop_id}`)
      .then((res) => {
        setShop(res.data[0]);
      })
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:4000/shops/getShopProducts/${shop_id}`)
      .then((res) => {
        setShopProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, [shop_id]);

  /**
   * Guarda la información de un producto de la tienda y abre un modal para editar
   * @param {*} shopProduct
   */
  const handleEditShopProduct = (shopProduct) => {
    setEditShopProduct(shopProduct);
    setShow(true);
  };

  /**
   * Borra de forma lógica un producto especifico que vende la venda
   * @param {*} id
   */
  const handleDeleteShopProduct = (id) => {
    axios
      .put(`http://localhost:4000/shops/deleteShopProduct/${shop_id}/${id}`)
      .then((res) => {
        setShopProducts(res.data);
      })
      .catch((err) => console.log(err));
  };

 const handleError = (e) => {
   e.target.src = "../images/dueno-negocio-feliz-sosteniendo-estamos-abiertos-signo.jpg";  };

  return (
    <Row>
      <h1 className="text-center h1Naranja">{shop?.name}</h1>
      {shop?.shop_img && (
        <div className="shop-banner mb-5 mx-auto">
          <img
            onError={(e) => handleError(e)}
            src={`/images/tienda/${shop?.shop_img}`}
            alt="cosa"
          />
        </div>
      )}
      <h3 className="text-center">Lista productos a la venta</h3>
      {shopProducts && (
        <>
          <Table
            striped
            bordered
            hover
            variant="success"
            className="table-shop-product mx-auto"
          >
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Producto</th>
                <th>Stock</th>
                <th>Precio</th>
                <th className="text-center">Editar</th>
                <th className="text-center">Borrar</th>
              </tr>
            </thead>
            <tbody>
              {shopProducts.map((shopProduct) => {
                return (
                  <tr key={shopProduct.shop_product_id}>
                    <td>{shopProduct.reference}</td>
                    <td>
                      <span
                      className="navegarNombre"
                        onClick={() =>
                          navigate(`/oneProduct/${shopProduct.product_id}`)
                        }
                      >
                        {shopProduct.name} - {shopProduct.minimum_amount}
                      </span>
                    </td>
                    <td>{shopProduct.stock}</td>
                    <td>{shopProduct.price} €</td>
                    <td className="text-center">
                      <Button
                        className="bio-btn-primary"
                        onClick={() => handleEditShopProduct(shopProduct)}
                      >
                        <span>
                          <img
                            className="shop-product-icon"
                            src="/images/edit.svg"
                            alt=""
                          />
                        </span>
                      </Button>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleDeleteShopProduct(shopProduct.shop_product_id)
                        }
                      >
                        <span>
                          <img
                            className="shop-product-icon"
                            src="/images/delete.svg"
                            alt=""
                          />
                        </span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <EditShopProduct
            show={show}
            setShow={setShow}
            shop_id={shop_id}
            editShopProduct={editShopProduct}
            setShopProducts={setShopProducts}
          />
        </>
      )}
      <AddShopProduct
        shop_id={shop_id}
        setShopProducts={setShopProducts}
        shopProducts={shopProducts}
      />
    </Row>
  );
};
