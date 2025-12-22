const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getMyCaseStudies,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getPublicCaseStudies,
} = require('../controllers/caseStudyController');

const router = express.Router();

router.get('/me', auth(true), getMyCaseStudies);
router.post('/', auth(true), createCaseStudy);
router.put('/:id', auth(true), updateCaseStudy);
router.delete('/:id', auth(true), deleteCaseStudy);
router.get('/public', getPublicCaseStudies);

module.exports = router;
