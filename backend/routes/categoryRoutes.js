const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers');

const router = Router();

// Admin only — category CMS (Customer cannot access)
router.get('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), listCategories);
router.post('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), createCategory);
router.put('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), updateCategory);
router.delete('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), deleteCategory);

module.exports = router;
