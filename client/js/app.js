const API = '/api';
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
const saveCart = (c) => { localStorage.setItem('cart', JSON.stringify(c)); renderNav(); };
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(API + path, { ...opts, headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

function addToCart(p, qty = 1) {
  const cart = getCart();
  const item = cart.find((x) => x.id === p._id);
  if (item) item.qty += qty;
  else cart.push({ id: p._id, name: p.name, price: p.price, image: p.image, qty });
  saveCart(cart);
  toast('Added to cart ✅');
}

function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => (t.style.display = 'none'), 1800);
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  location.href = 'index.html';
}

function renderNav() {
  const user = getUser();
  const count = getCart().reduce((a, i) => a + i.qty, 0);
  $('#nav').innerHTML = `
    <a class="brand" href="index.html">🛒 ShopEasy</a>
    <div class="links">
      <a href="index.html">Products</a>
      <a href="cart.html">Cart (${count})</a>
      ${user
        ? `<a href="orders.html">My Orders</a><span>Hi, ${esc(user.name)}</span><button onclick="logout()">Logout</button>`
        : `<a href="login.html">Login</a>`}
    </div>`;
}

document.addEventListener('DOMContentLoaded', renderNav);
