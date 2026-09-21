const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const { createRateLimiter } = require('../common/rateLimiter');
const {
  listPublicTestimonials,
  listTestimonials,
  createTestimonial,
  submitPublicTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers');

const router = Router();
const submitLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });

// Public / Customer
router.get('/', listPublicTestimonials);
router.post('/submit', submitLimiter, submitPublicTestimonial);

// Admin only
router.get('/manage', authenticationMiddleware([RoleAuthorizationTypes.Admin]), listTestimonials);
router.post('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), createTestimonial);
router.put('/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), updateTestimonial);
router.delete('/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), deleteTestimonial);

module.exports = router;
