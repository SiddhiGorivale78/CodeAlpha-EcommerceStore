const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e || '');

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || name.trim().length < 2) return res.status(400).json({ message: 'Name is required (min 2 chars)' });
    if (!emailOk(email)) return res.status(400).json({ message: 'Valid email is required' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email, password: hashed });
    res.status(201).json({ token: makeToken(user._id), user: { name: user.name, email: user.email } });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!emailOk(email) || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ token: makeToken(user._id), user: { name: user.name, email: user.email } });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
