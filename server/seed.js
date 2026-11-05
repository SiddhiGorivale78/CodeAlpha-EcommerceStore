require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const names = [
  ['Wireless Headphones', 2499, 'Electronics'], ['Smart Watch', 3999, 'Electronics'],
  ['Running Shoes', 1999, 'Fashion'], ['Backpack', 1299, 'Fashion'],
  ['Water Bottle', 499, 'Home'], ['Desk Lamp', 899, 'Home'],
  ['Mechanical Keyboard', 3299, 'Electronics'], ['Gaming Mouse', 1499, 'Electronics'],
  ['Cotton T-Shirt', 599, 'Fashion'], ['Coffee Mug', 299, 'Home'],
];

const imageMap = {
    "Wireless Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    "Smart Watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    "Running Shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    "Backpack": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    "Water Bottle": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
    "Desk Lamp": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    "Mechanical Keyboard": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
    "Gaming Mouse": "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    "Cotton T-Shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    "Coffee Mug": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500"
};
const products = names.map(([name, price, category], i) => ({
  name,
  price,
  category,
  stock: 20,
  description: `High quality ${name.toLowerCase()} at an affordable price. Perfect for daily use.`,
  image: imageMap[name],
}));

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codealpha_store');
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
