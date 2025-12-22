const Profile = require('../models/Profile');
const { findOwnerUser } = require('../utils/owner');

async function getMyProfile(req, res) {
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  return res.json(profile);
}

async function upsertProfile(req, res) {
  const data = req.body;
  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { ...data, user: req.user.id },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return res.json(profile);
}

async function getPublicProfile(_req, res) {
  const owner = await findOwnerUser();
  if (!owner) return res.status(404).json({ message: 'Owner not configured' });
  const profile = await Profile.findOne({ user: owner._id });
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  return res.json(profile);
}

module.exports = { getMyProfile, upsertProfile, getPublicProfile };
