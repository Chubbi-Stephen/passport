const https = require('https');
const prisma = require('../prismaClient');

const initializePayment = async (req, res) => {
  try {
    const { amount, plan } = req.body; // Amount in Naira
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const params = JSON.stringify({
      email: user.email,
      amount: amount * 100, // Paystack uses kobo
      metadata: { userId, plan },
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-verify`,
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const paystackReq = https.request(options, (paystackRes) => {
      let data = '';
      paystackRes.on('data', (chunk) => { data += chunk; });
      paystackRes.on('end', async () => {
        const response = JSON.parse(data);
        if (response.status) {
          // Store pending transaction
          await prisma.subscription.create({
            data: {
              userId,
              status: 'pending',
              reference: response.data.reference,
              amount,
              plan,
            },
          });
          res.json(response.data);
        } else {
          res.status(400).json({ message: 'Paystack initialization failed' });
        }
      });
    });

    paystackReq.on('error', (error) => {
      console.error(error);
      res.status(500).json({ message: 'Payment error' });
    });

    paystackReq.write(params);
    paystackReq.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };

    const paystackReq = https.request(options, (paystackRes) => {
      let data = '';
      paystackRes.on('data', (chunk) => { data += chunk; });
      paystackRes.on('end', async () => {
        const response = JSON.parse(data);
        if (response.status && response.data.status === 'success') {
          const { userId, plan } = response.data.metadata;

          // Update user tier
          await prisma.user.update({
            where: { id: userId },
            data: { tier: plan },
          });

          // Update subscription record
          await prisma.subscription.update({
            where: { reference },
            data: { status: 'success' },
          });

          res.json({ message: 'Payment successful', tier: plan });
        } else {
          res.status(400).json({ message: 'Payment verification failed' });
        }
      });
    });

    paystackReq.on('error', (error) => {
      console.error(error);
      res.status(500).json({ message: 'Verification error' });
    });

    paystackReq.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handleWebhook = async (req, res) => {
  // Implement webhook for production to handle async events
  res.sendStatus(200);
};

module.exports = { initializePayment, verifyPayment, handleWebhook };
