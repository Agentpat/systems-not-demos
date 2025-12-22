const bcrypt = require('bcrypt');
const User = require('../models/User');
const { signToken } = require('../utils/tokens');

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const hashed = await bcrypt.hash(password, 10);
  const hasOwner = await User.exists({ role: 'owner' });
  const role = hasOwner ? 'guest' : 'owner';

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash: hashed,
    role,
  });

  const token = signToken(user);
  return res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user);
  return res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
}

module.exports = { register, login };
