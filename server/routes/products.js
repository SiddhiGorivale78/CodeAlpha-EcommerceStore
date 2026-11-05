const router = require('express').Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// GET /api/products?search=shoe
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) {
      const q = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: q, $options: 'i' };
    }
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
