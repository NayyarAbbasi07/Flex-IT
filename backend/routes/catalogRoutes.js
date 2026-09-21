const { Router } = require('express');
const { getShopCatalog } = require('../controllers');

const router = Router();

router.get('/', getShopCatalog);

module.exports = router;
