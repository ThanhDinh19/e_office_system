const router = require('express').Router();
const departmentController = require('../controllers/department.controller');
const authenticate = require('../middlewares/auth.middleware');

router.get('/', authenticate, departmentController.getDepartments);

module.exports = router;