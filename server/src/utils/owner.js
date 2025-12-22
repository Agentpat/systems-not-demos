const User = require('../models/User');

async function findOwnerUser() {
  if (process.env.TEMPLATE_OWNER_EMAIL) {
    const ownerByEmail = await User.findOne({ email: process.env.TEMPLATE_OWNER_EMAIL.toLowerCase() });
    if (ownerByEmail) return ownerByEmail;
  }
  return User.findOne({ role: 'owner' });
}

module.exports = { findOwnerUser };
