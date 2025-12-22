const express = require('express');
const { auth } = require('../middleware/auth');
const { getMyProjects, createProject, updateProject, deleteProject, getPublicProjects } = require('../controllers/projectController');

const router = express.Router();

router.get('/me', auth(true), getMyProjects);
router.post('/', auth(true), createProject);
router.put('/:id', auth(true), updateProject);
router.delete('/:id', auth(true), deleteProject);
router.get('/public', getPublicProjects);

module.exports = router;
