const { Router } = require('express');
const {
  authenticationMiddleware,
  optionalAuthenticationMiddleware,
} = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const { createRateLimiter } = require('../common/rateLimiter');
const {
  createInquiry,
  listInquiries,
  listMyInquiries,
  getInquiry,
  updateInquiry,
} = require('../controllers');

const router = Router();
const inquiryLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 40 });

// Public (optional Customer link) — submit WhatsApp/web inquiry
router.post('/', inquiryLimiter, optionalAuthenticationMiddleware, createInquiry);

// Customer — own inquiries
router.get('/mine', authenticationMiddleware([RoleAuthorizationTypes.Customer]), listMyInquiries);

// Admin only
router.get('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), listInquiries);
router.get('/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), getInquiry);
router.put('/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), updateInquiry);

module.exports = router;
