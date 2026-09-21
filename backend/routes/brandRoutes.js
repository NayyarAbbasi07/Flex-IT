const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const { listBrands, createBrand, updateBrand, deleteBrand } = require('../controllers');

const router = Router();

// Admin only — brand CMS (Customer cannot access)
router.get('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), listBrands);
router.post('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), createBrand);
router.put('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), updateBrand);
router.delete('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), deleteBrand);

module.exports = router;
