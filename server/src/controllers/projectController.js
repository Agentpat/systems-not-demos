const Project = require('../models/Project');
const { findOwnerUser } = require('../utils/owner');

async function getMyProjects(req, res) {
  const projects = await Project.find({ user: req.user.id }).sort({ sortOrder: 1, createdAt: -1 });
  return res.json(projects);
}

async function createProject(req, res) {
  const project = await Project.create({ ...req.body, user: req.user.id });
  return res.status(201).json(project);
}

async function updateProject(req, res) {
  const { id } = req.params;
  const project = await Project.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { new: true });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json(project);
}

async function deleteProject(req, res) {
  const { id } = req.params;
  const project = await Project.findOneAndDelete({ _id: id, user: req.user.id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json({ message: 'Deleted' });
}

async function getPublicProjects(_req, res) {
  const owner = await findOwnerUser();
  if (!owner) return res.status(404).json({ message: 'Owner not configured' });
  const projects = await Project.find({ user: owner._id, visibility: 'public' }).sort({ sortOrder: 1, createdAt: -1 });
  return res.json(projects);
}

module.exports = { getMyProjects, createProject, updateProject, deleteProject, getPublicProjects };
