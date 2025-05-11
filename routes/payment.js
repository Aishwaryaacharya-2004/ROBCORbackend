// routes/payment.js
const express = require('express');
const router = express.Router();
const User = require('../models/Member'); // Adjust path

router.post('/success', async (req, res) => {
  const { transactionId, email } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          transactionId,
          paymentStatus: 'paid',
          paymentDate: new Date(),
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Payment recorded', user });
  } catch (error) {
    console.error('Payment update error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
