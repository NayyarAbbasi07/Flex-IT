const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const { getStats } = require('../controllers');

const router = Router();

// Admin only — dashboard stats (Customer cannot access)
router.get('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), getStats);

module.exports = router;
