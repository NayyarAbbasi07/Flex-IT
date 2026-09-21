const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const {
  listPublicProducts,
  getFeaturedProducts,
  getLatestProducts,
  getRelatedProducts,
  getProductBySlug,
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  listLowStock,
  bulkUpdateProductStatus,
} = require('../controllers');

const router = Router();

// Public / Customer — browse storefront catalog (no auth)
router.get('/', listPublicProducts);
router.get('/featured', getFeaturedProducts);
router.get('/latest', getLatestProducts);

// Admin only — manage catalog (must be before /:slug)
router.get('/manage', authenticationMiddleware([RoleAuthorizationTypes.Admin]), listProducts);
router.get('/low-stock', authenticationMiddleware([RoleAuthorizationTypes.Admin]), listLowStock);
router.put('/bulk-status', authenticationMiddleware([RoleAuthorizationTypes.Admin]), bulkUpdateProductStatus);
router.post('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), createProduct);
router.get('/id/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), getProduct);
router.put('/id/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), updateProduct);
router.delete('/id/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), deleteProduct);

// Public / Customer — product detail by slug
router.get('/:slug/related', getRelatedProducts);
router.get('/:slug', getProductBySlug);

module.exports = router;
