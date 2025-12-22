const CaseStudy = require('../models/CaseStudy');
const { findOwnerUser } = require('../utils/owner');

async function getMyCaseStudies(req, res) {
  const items = await CaseStudy.find({ user: req.user.id }).sort({ sortOrder: 1, createdAt: -1 });
  return res.json(items);
}

async function createCaseStudy(req, res) {
  const item = await CaseStudy.create({ ...req.body, user: req.user.id });
  return res.status(201).json(item);
}

async function updateCaseStudy(req, res) {
  const { id } = req.params;
  const item = await CaseStudy.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Case study not found' });
  return res.json(item);
}

async function deleteCaseStudy(req, res) {
  const { id } = req.params;
  const item = await CaseStudy.findOneAndDelete({ _id: id, user: req.user.id });
  if (!item) return res.status(404).json({ message: 'Case study not found' });
  return res.json({ message: 'Deleted' });
}

async function getPublicCaseStudies(_req, res) {
  const owner = await findOwnerUser();
  if (!owner) return res.status(404).json({ message: 'Owner not configured' });
  const items = await CaseStudy.find({ user: owner._id }).sort({ sortOrder: 1, createdAt: -1 });
  return res.json(items);
}

module.exports = { getMyCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy, getPublicCaseStudies };
