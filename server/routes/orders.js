const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Place order: body = { items: [{ id, qty }], address }
router.post('/', auth, async (req, res, next) => {
  try {
    const { items, address } = req.body;
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Cart is empty' });
    if (!address || address.trim().length < 5) return res.status(400).json({ message: 'Please enter a valid address' });

    const orderItems = [];
    let total = 0;

    for (const it of items) {
      const qty = parseInt(it.qty, 10);
      if (!mongoose.isValidObjectId(it.id) || !(qty > 0)) return res.status(400).json({ message: 'Invalid cart item' });
      const p = await Product.findById(it.id);
      if (!p) return res.status(404).json({ message: 'A product in your cart no longer exists' });
      if (p.stock < qty) return res.status(400).json({ message: `Only ${p.stock} left for ${p.name}` });
      orderItems.push({ product: p._id, name: p.name, price: p.price, qty });
      total += p.price * qty; // price always taken from DB, never from client
    }

    for (const it of orderItems) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });
    }

    const order = await Order.create({ user: req.userId, items: orderItems, total, address: address.trim() });
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

// My orders
router.get('/my', auth, async (req, res, next) => {
  try {
    res.json(await Order.find({ user: req.userId }).sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
