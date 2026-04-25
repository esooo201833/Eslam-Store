const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const getPool = require('../database/db');

// Create Payment Intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        user_id: req.user.id
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Payment processing error' });
  }
};

// Confirm Payment
const confirmPayment = async (req, res) => {
  try {
    const { payment_intent_id } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status === 'succeeded') {
      res.json({ 
        success: true, 
        payment_id: paymentIntent.id,
        amount: paymentIntent.amount / 100
      });
    } else {
      res.json({ 
        success: false, 
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Payment confirmation error' });
  }
};

// Webhook Handler
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: 'Webhook signature verification failed' });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Update order payment status in database
      await getPool().query(
        'UPDATE orders SET payment_status = $1 WHERE payment_id = $2',
        ['paid', paymentIntent.id]
      );
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object);
      await getPool().query(
        'UPDATE orders SET payment_status = $1 WHERE payment_id = $2',
        ['failed', event.data.object.id]
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = { createPaymentIntent, confirmPayment, handleWebhook };
