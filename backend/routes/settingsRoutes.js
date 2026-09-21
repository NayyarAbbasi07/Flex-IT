const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const { getPublicSettings, getAdminSettings, updateSettings } = require('../controllers');

const router = Router();

// Public / Customer — read store settings
router.get('/', getPublicSettings);

// Admin only — manage store settings
router.get('/manage', authenticationMiddleware([RoleAuthorizationTypes.Admin]), getAdminSettings);
router.put('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), updateSettings);

module.exports = router;
