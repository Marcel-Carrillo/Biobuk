import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { getLocalStorageBiobuk } from "../helpers/localstorage/localStorageBiobuk";

export const BiobukContext = createContext();

export const BiobukProvider = (props) => {
  const [user, setUser] = useState();
  const [isLogged, setIsLogged] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [token, setToken] = useState();

  useEffect(() => {
    // Recoge el token del usuario logeado del LocalStorage y pasa su valor al estado token
    const token = getLocalStorageBiobuk();
    setToken(token);
    // Si hay algo dentro del localStorage y por ende un usuario está logeado desencripta el token para
    // obtener el usuario y su id para hacer una llamada al back y recuperar sus datos de la BD
    if (getLocalStorageBiobuk()) {
      let user = jwt_decode(token).user;
      axios
        .get(`http://localhost:4000/users/getOneUser/${user.id}`)
        .then((res) => {
          // Setea el estado user con esa información
          setUser(res.data.resultUser[0]);
          setIsLogged(true);
        })
        .catch((error) => console.log(error));
    }
    // Si el tipo de usuario es 0 (Agricultor) hace una llamada al back de Stripe y setea el estado
    // publicKey con esa información
    if (user?.type === 0) {
      axios.get("http://localhost:4000/users/stripe/publicKey").then((res) => {
        setPublicKey(res.data);
      });
    }
    // En el array vemos que se vuelve a realizar toda esta operación cuando hay un cambio en el estado
    // isLogged
  }, [isLogged]);

  // Pasamos por props a través del context todos los estados con sus seteos para poder acceder a ellos
  // a través del useContext en cualquier contenedor de la página.

  return (
    <BiobukContext.Provider
      value={{
        user,
        setUser,
        isLogged,
        setIsLogged,
        token,
        setToken,
        publicKey,
      }}
    >
      {props.children}
    </BiobukContext.Provider>
  );
};
