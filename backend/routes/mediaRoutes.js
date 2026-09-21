const { Router } = require('express');
const multer = require('multer');
const config = require('../config');
const { authenticationMiddleware } = require('../common/authenticationMiddleware');
const { RoleAuthorizationTypes } = require('../common/enumFunction');
const { listMedia, uploadMedia, deleteMedia } = require('../controllers');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploads.maxFileSize },
});
const router = Router();

// Admin only — media library (Customer cannot access)
router.get('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), listMedia);
router.post('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), upload.single('file'), uploadMedia);
router.delete('/', authenticationMiddleware([RoleAuthorizationTypes.Admin]), deleteMedia);

module.exports = router;
