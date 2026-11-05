const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
