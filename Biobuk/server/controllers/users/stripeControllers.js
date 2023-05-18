const Stripe = require('stripe');
require("dotenv").config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const publicKey = process.env.STRIPE_PUBLIC_KEY;

class stripeController {

  stripePublic = (req, res) => {
    res.json(publicKey);
  }

  stripe = async (req, res) => {
    try {
      const { amount, paymentMethod } = req.body;

      // Crear un pago en Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        payment_method: paymentMethod,
        currency: 'eur',
        confirmation_method: 'manual',
        confirm: true,
      });

      // Enviar la respuesta al cliente
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.log(error);
      res.json({ error: error.raw.message });
    }
  }
}

module.exports = new stripeController();