import React, { useState } from "react";
//Se llaman a los componentes de  Stripe
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./stripeContainer.scss"
import { Col } from "react-bootstrap"


const StripeContainer = ({ handlePurchase, finalPrice, succeeded, address, error, setError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false)


  //Esta funcion verifica que todos los datos necesarios para realizar un pago estan correctos y llama a la API de stripe para crear un PaymentMethod con los datos de la tarjeta que se ha introducido y envia los datos al controlador del back para que se verifiquen y se complete la compra
  const handleSubmit = async (event) => {
    //Se lanza el mensaje de procesamiento
    setError("")
    setProcessing(true)
    event.preventDefault();
    //Se elige método de pago
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    });

    //Si todo va bien, entra en el controlador y hace el pago
    if (address !== "") {
      if (!error) {
        try {
          const response = await axios.post("http://localhost:4000/users/stripe", {
            amount: Math.round(finalPrice * 100),
            paymentMethod: paymentMethod.id,
          }
          )
          setProcessing(false)
          setError("")
          handlePurchase();
          //si no, setea el mensaje de error
        } catch (error) {
          setProcessing(false)
          console.log(error);
          setError(error.message);
        }
      } else {
        setProcessing(false)
        setError(error.message);
      }
    }
    //Si no hay dirección, nos avisa.
    else {
      setError("Debes crear y seleccionar una dirección de envío")
      setProcessing(false)
    }
  };


  return (
    <Col id="stripeCss" xs={12} md={6}>
      <form onSubmit={handleSubmit}>
        <Col className="datosTarjeta">
          <h2><i>Tarjeta de Pago</i></h2>
          <h3>Se realizará un cobro de: {finalPrice} €</h3>
          <CardElement />
        </Col>
        <Col className="botonPagar">
          <button className="bio-btn-primary" type="submit" disabled={!stripe}>
            Comprar
          </button>
        </Col>
      </form>
      {error && <p className="confirmacion">{error}</p>}
      {processing && <p className="confirmacion">Procesando...</p>}
      {succeeded && <p className="confirmacion">¡Pago completado con éxito! En breves momentos te redigiremos al resumen de compra.</p>}
    </Col>
  );
};


export default StripeContainer;
