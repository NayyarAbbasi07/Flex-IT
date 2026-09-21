const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const { getHero, updateHero } = require('../controllers');

const router = Router();

// Public / Customer — read hero
router.get('/', getHero);

// Admin only — edit hero
router.put('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), updateHero);

module.exports = router;
