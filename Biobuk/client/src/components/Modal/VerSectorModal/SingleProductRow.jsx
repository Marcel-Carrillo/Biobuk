import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BiobukContext } from "../../../context/BiobukContext";
import { Button } from "react-bootstrap";

export const SingleProductRow = ({ product, zone_id, setShow }) => {
  const { user } = useContext(BiobukContext);
  const [edit, setEdit] = useState(false);
  const [zoneProduct, setZoneProduct] = useState(product);

  /**
   * Asigna por defecto la fecha actual al rellenar los datos.
   */
  useEffect(() => {
    setZoneProduct({
      ...zoneProduct,
      ["application_date"]: new Date(
        new Date(product.application_date).getTime() + 36100000
      )
        .toISOString()
        .slice(0, 10),
    });
  }, []);

  /**
   * Sincroniza los valores introducidos en los inputs con el innitialValue
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setZoneProduct({ ...zoneProduct, [name]: value });
  };

  /**
   * Cancela los datos introducidos en el formulario.
   */
  const handleCancel = () => {
    setZoneProduct(product);
    setEdit(!edit);
  };

  /**
   * Elimina los valores seleccionados.
   */
  const handleDelete = (e) => {
    e.preventDefault();

    axios
      .post(
        `http://localhost:4000/users/farmer/deleteProductInZone/${zone_id}/${product.product_id}`
      )
      .then((res) => setShow(false))
      .catch((err) => console.log(err));
  };

  /**
   * Redirige la vista a una pagina para editar la concentración de un producto que se aplica a una zona de un invernadero.
   */
  const handleEdit = (e) => {
    e.preventDefault();

    let final = {
      product_id: zoneProduct.product_id,
      concentration: zoneProduct.concentration,
      application_date: new Date(new Date(zoneProduct.application_date))
        .toISOString()
        .slice(0, 10),
    };

    axios
      .put(
        `http://localhost:4000/users/farmer/editProductInZone/${zone_id}/${product.product_id}`,
        final
      )
      .then((res) => setShow(false))
      .catch((err) => console.log(err));
  };

  return (
    <>
      {edit === false ? (
        <tr>
          <td>{product.name}</td>
          <td>{product.concentration}</td>
          <td>
            {zoneProduct.application_date
              .slice(0, 10)
              .split("-")
              .reverse()
              .join("-")}
          </td>
          {user?.type === 0 && (
            <>
              <td className="text-center">
                <Button
                  className="bio-btn-primary"
                  onClick={() => setEdit(!edit)}
                >
                  Editar
                </Button>
              </td>
              <td className="text-center">
                <Button variant="danger" onClick={handleDelete}>
                  Borrar
                </Button>
              </td>
            </>
          )}
        </tr>
      ) : (
        <tr>
          <td>{product.name}</td>
          <td>
            <input
              type="number"
              name="concentration"
              value={zoneProduct.concentration}
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              type="date"
              name="application_date"
              value={zoneProduct.application_date.slice(0, 10)}
              onChange={handleChange}
            />
          </td>
          {user?.type === 0 && (
            <>
              <td className="text-center">
                <Button className="bio-btn-primary" onClick={handleEdit}>
                  Guardar
                </Button>
              </td>
              <td className="text-center">
                <Button variant="danger" onClick={handleCancel}>
                  Cancelar
                </Button>
              </td>
            </>
          )}
        </tr>
      )}
    </>
  );
};
