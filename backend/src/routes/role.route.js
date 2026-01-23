const router = require('express').Router();
const roleController = require('../controllers/role.controller');
const authenticate = require('../middlewares/auth.middleware');

router.get('/', authenticate, roleController.getRoles);

module.exports = router;