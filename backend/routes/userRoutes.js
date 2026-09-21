const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const { listUsers, createUser, updateUser, deleteUser } = require('../controllers');

const router = Router();

// Admin only — manage Admin + Customer accounts (Customer cannot access)
router.get('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), listUsers);
router.post('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), createUser);
router.put('/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), updateUser);
router.delete('/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), deleteUser);

module.exports = router;
