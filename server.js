const express = require('express');
const app = express();
const { resolve } = require('path');
const cors = require('cors');
// Replace if using a different env file or config
const env = require('dotenv').config({ path: './.env' });
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY_TEST);

// app.use(express.static(process.env.STATIC_DIR));
app.use(express.json());

app.use(cors());

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd'
        });

        // Send publishable key and PaymentIntent details to client
        res.send({
            publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_TEST,
            clientSecret: paymentIntent.client_secret
        });
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message });
    }
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
