const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const {
  listPublicFaqs,
  listFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} = require('../controllers');

const router = Router();

// Public / Customer
router.get('/', listPublicFaqs);

// Admin only
router.get('/manage', authenticationMiddleware([RoleAuthorizationTypes.Admin]), listFaqs);
router.post('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), createFaq);
router.put('/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), updateFaq);
router.delete('/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), deleteFaq);

module.exports = router;
