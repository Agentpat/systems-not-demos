const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const CaseStudy = require('../models/CaseStudy');
const User = require('../models/User');
const { findOwnerUser } = require('../utils/owner');
const { signToken } = require('../utils/tokens');

async function cloneTemplate(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });

  const owner = await findOwnerUser();
  if (!owner) return res.status(400).json({ message: 'Owner not configured yet' });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash: hashed,
    role: 'guest',
    templateSource: owner._id,
  });

  const ownerProfile = await Profile.findOne({ user: owner._id }).lean();
  if (ownerProfile) {
    const { _id, createdAt, updatedAt, ...rest } = ownerProfile;
    await Profile.create({ ...rest, user: newUser._id });
  }

  const ownerProjects = await Project.find({ user: owner._id }).lean();
  if (ownerProjects.length) {
    const cloned = ownerProjects.map(({ _id, createdAt, updatedAt, user, ...rest }) => ({
      ...rest,
      user: newUser._id,
    }));
    await Project.insertMany(cloned);
  }

  const ownerCaseStudies = await CaseStudy.find({ user: owner._id }).lean();
  if (ownerCaseStudies.length) {
    const cloned = ownerCaseStudies.map(({ _id, createdAt, updatedAt, user, ...rest }) => ({
      ...rest,
      user: newUser._id,
    }));
    await CaseStudy.insertMany(cloned);
  }

  const token = signToken(newUser);
  return res.status(201).json({
    user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    token,
    message: 'Template cloned',
  });
}

module.exports = { cloneTemplate };
