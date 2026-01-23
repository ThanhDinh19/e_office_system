const router = require('express').Router();
const positionController = require('../controllers/position.controller');
const authenticate = require('../middlewares/auth.middleware');

router.get('/', authenticate, positionController.getPositions);

module.exports = router;