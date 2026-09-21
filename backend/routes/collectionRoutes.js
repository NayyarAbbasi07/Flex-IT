const { Router } = require('express');
const { listCollections, getCollectionBySlug } = require('../controllers');

const router = Router();

router.get('/', listCollections);
router.get('/:slug', getCollectionBySlug);

module.exports = router;
