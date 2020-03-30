const express = require('express');
const app = express();
const { resolve } = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
// Replace if using a different env file or config
const env = require('dotenv').config({ path: './.env' });
// const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY_TEST);
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

const port = process.env.PORT || 4242;
// app.use(express.static(process.env.STATIC_DIR));
app.use(express.json());
app.use(cors());
app.use(express.static('views'));

app.get('/', (req, res) => {
    res.render('/views/index');
});

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, profile } = req.body;
        const idempotencyKey = uuidv4();

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create(
            {
                amount: amount,
                currency: 'usd',
                metadata: {
                    email: profile.email,
                    username: profile.username,
                    userRegion: profile.userRegion,
                    description: 'Subscribed to TFT Helper.'
                }
            },
            {
                idempotency_key: idempotencyKey
            }
        );
        // Send publishable key and PaymentIntent details to client
        res.send({
            publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_TEST,
            clientSecret: paymentIntent.client_secret
        });
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message });
    }
});

app.listen(port, () => console.log(`Node server listening on port ${port}!`));
