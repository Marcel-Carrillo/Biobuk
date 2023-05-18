import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import { Button } from "react-bootstrap";
import "./allFarmers.scss";


export const AllFarmers = () => {
  const [allFarmer, setAllFarmer] = useState();
  const navigate = useNavigate();
  const [filter, setFilter] = useState(null);


  // Este useEffect se trae a todos los agricultors de la base de datos y los guarda en el estado allFarmer
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/admin/getAllFarmers`)
      .then((res) => {
        setAllFarmer(res.data);
      })
      .catch((err) => console.log(err));
  }, []);


  // Esta funcion hace que se navegue a la vista de un agricultor pulsando en el boton ver agricultor
  function handleClick(farmer_id) {
    navigate(`/farmerProfile/${farmer_id}`);
  }


  //Esta funcion habilita o desabilita un agricultor en la base de datos
  const handleDisable = (id, deleted) => {
    let address = `http://localhost:4000/users/admin/disableUser/${id}`;
    deleted === 1 &&
      (address = `http://localhost:4000/users/admin/enableUser/${id}`);

    axios
      .put(address)
      .then((res) => {
        setAllFarmer(res.data);
      })
      .catch((err) => console.log(err));
  };


  //Esta funcion establece la foto por defecto si no se establece ninguna previamente
  const handleError = (e) => {
    e.target.src = "/images/user_default.png";
  };


  return (
    <div className="allFarmers">
      <Row>
        <Col xs={12}>
          <h1 className="h1Naranja">Todos los Agricultores</h1>
        </Col>
        <Col xs={12} md={6} className="botonesCol">
          <Button className="bio-btn-primary" onClick={() => setFilter(0)}>
            Solo habilitados
          </Button>
          <Button className="bio-btn-primary" onClick={() => setFilter(null)}>
            Todos
          </Button>
          <Button className="bio-btn-primary" onClick={() => setFilter(1)}>
            Solo deshabilitados
          </Button>
        </Col>
        <Col xs={12} className="allFarmer text-center">
          {allFarmer &&
            allFarmer.map((elem, index) => {
              if (filter !== null) {
                if (elem.deleted === filter) {
                  return (
                    <div xs={12} md={2} className="tarjeta" key={index}>
                      <div className="foto">
                        <img
                          src={`/images/users/${elem.user_img}`}
                          alt=""
                          onError={handleError}
                        />
                      </div>
                      <div className="text">
                        <h3>{elem.name}</h3>
                        <h3>{elem.lastname}</h3>
                        <h3>{elem.phone}</h3>
                      </div>
                      <div className="botones">
                        {/* DESHABILITADOS/HABILITADOS */}
                        {elem.deleted === 0 && (
                          <Button
                            className="bio-btn-primary"
                            onClick={() => handleClick(elem.user_id)}
                          >
                            Ver Agricultor
                          </Button>
                        )}
                        <Button
                          variant={elem?.deleted === 0 ? "danger" : "success"}
                          onClick={() =>
                            handleDisable(elem.user_id, elem.deleted)
                          }
                        >
                          {elem?.deleted === 0 ? "Deshabilitar" : "Habilitar"}
                        </Button>
                      </div>
                    </div>
                  );
                }
              } else {
                //TODOS LOS AGRICULTORES
                return (
                  <div xs={12} md={2} className="tarjeta">
                    <div className="foto">
                      <img
                        src={`/images/users/${elem.user_img}`}
                        alt=""
                        onError={handleError}
                      />
                    </div>
                    <div className="text">
                      <h3>{elem.name}</h3>
                      <h3>{elem.lastname}</h3>
                      <h3>{elem.phone}</h3>
                    </div>
                    <div className="botones">
                      {elem.deleted === 0 && (
                        <Button
                          className="bio-btn-primary"
                          onClick={() => handleClick(elem.user_id)}
                        >
                          Ver Agricultor
                        </Button>
                      )}
                      <Button
                        variant={elem?.deleted === 0 ? "danger" : "success"}
                        onClick={() =>
                          handleDisable(elem.user_id, elem.deleted)
                        }
                      >
                        {elem?.deleted === 0 ? "Deshabilitar" : "Habilitar"}
                      </Button>
                    </div>
                  </div>
                );
              }
            })}
        </Col>
      </Row>
    </div>
  );
};
