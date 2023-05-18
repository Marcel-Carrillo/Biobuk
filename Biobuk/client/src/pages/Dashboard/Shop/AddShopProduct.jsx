import axios from "axios";
import React, { useEffect, useState } from "react";
import { ShopProductCard } from "./ShopProductCard";
import { Button, Form } from "react-bootstrap";
import "./ShopInfo.scss";


export const AddShopProduct = ({ shop_id, setShopProducts, shopProducts }) => {
  const [products, setProducts] = useState([]);
  const [listProducts, setListProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState("");
  const [productIds, setProductsIds] = useState([]);


  /**
   * Carga y guarda la información de todos los productos
   */
  useEffect(() => {
    axios
      .get("http://localhost:4000/products/getAllProducts")
      .then((res) => {
        setProducts(res.data);
        setListProducts(
          res.data.result.map((elem) => {
            return elem;
          })
        );
        let temp = [];
        for (let element of shopProducts) {
          temp.push(element.product_id);
        }
        setProductsIds(temp);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [shopProducts]);


  /**
   * Controla el nombre del buscador de productos
   */
  const handleChange = (e) => {
    e.preventDefault();
    setSearchProducts(e.target.value);
  };


  /**
   * Actualiza la lista de productos visible
   */
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchProducts !== "") {
      setListProducts(
        products.result.filter((elem) =>
          elem.name.toLowerCase().includes(searchProducts.toLowerCase())
        )
      );
    } else {
      setListProducts(products.result);
    }
  };

  
  return (
    <>
      <div className="d-flex justify-content-center gap-3 mb-3">
        <Form.Control
          className="shop-product-search"
          type="search"
          name="name"
          value={searchProducts?.name}
          onChange={handleChange}
        />
        <Button className="bio-btn-primary" onClick={handleSearch}>
          Buscar
        </Button>
      </div>
      <div className="d-flex flex-wrap justify-content-center gap-5">
        {listProducts.length > 0 &&
          listProducts.map((product, index) => {
            if (!productIds.includes(product.product_id)) {
              return (
                <ShopProductCard
                  product={product}
                  shop_id={shop_id}
                  key={index}
                  setShopProducts={setShopProducts}
                />
              );
            }
          })}
      </div>
    </>
  );
};
