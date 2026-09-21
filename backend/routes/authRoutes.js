const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const { createRateLimiter } = require('../common/rateLimiter');
const { login, logout, me, register, changePassword } = require('../controllers');

const router = Router();
const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30 });

// Public — Customer self-register + login/logout for Admin or Customer
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);

// Admin or Customer — current session / password
router.get('/me', authenticationMiddleware([RoleAuthorizationTypes.Admin, RoleAuthorizationTypes.Customer]), me);
router.post('/change-password', authenticationMiddleware([RoleAuthorizationTypes.Admin, RoleAuthorizationTypes.Customer]), changePassword);

module.exports = router;
