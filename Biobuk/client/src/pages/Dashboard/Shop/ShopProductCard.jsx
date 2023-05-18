import axios from "axios";
import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";


const innitialValue = { price: 0, stock: 0 };


export const ShopProductCard = ({ product, shop_id, setShopProducts }) => {
  const [newShopProduct, setNewShopProduct] = useState(innitialValue);


  /**
   * Controla los valores de los campos de edición de un propietario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewShopProduct({ ...newShopProduct, [name]: value });
  };


  /**
   * Añade un producto, con un precio y stock nuevos, a la tienda para su venta
   */
  const handleAddShopProduct = (e) => {
    e.preventDefault();
    setNewShopProduct(innitialValue);

    axios
      .post(
        `http://localhost:4000/shops/addProductToShop/${shop_id}/${product.product_id}`,
        newShopProduct
      )
      .then((res) => {
        setShopProducts(res.data);
      })
      .catch((err) => console.log(err));
  };

  
  return (
    <Card className="card-search-product" style={{ width: "12rem" }}>
      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title>{product?.name} - {product?.minimum_amount}</Card.Title>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              placeholder="Precio"
              name="price"
              value={newShopProduct?.price}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Stock"
              name="stock"
              value={newShopProduct?.stock}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
        <Button
          variant="primary"
          className="btn-fix bio-btn-primary mx-auto"
          onClick={handleAddShopProduct}
        >
          Añadir
        </Button>
      </Card.Body>
    </Card>
  );
};
