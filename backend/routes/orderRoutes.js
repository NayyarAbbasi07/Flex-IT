const { Router } = require('express');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const {
  createOrder,
  listOrders,
  listMyOrders,
  getOrder,
  updateOrder,
} = require('../controllers');

const router = Router();

// Customer — own orders
router.get('/mine', authenticationMiddleware([RoleAuthorizationTypes.Customer]), listMyOrders);

// Admin only
router.get('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), listOrders);
router.post('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), createOrder);
router.get('/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), getOrder);
router.put('/:id', authenticationMiddleware([RoleAuthorizationTypes.Admin]), updateOrder);

module.exports = router;
