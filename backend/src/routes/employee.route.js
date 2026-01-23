const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { upload } = require('../middlewares/uploadAvatar');

// GET /api/employees
router.get('/', employeeController.getAllEmployees);

// GET /api/employees/:id
router.get('/:id', employeeController.getEmployeeById);

router.get('/social-links/:id', employeeController.getSocialLinks);

// POST /api/employees
// chỉ HR và Admin mới đc thêm nhân viên
router.post(
    '/',
    authenticate,
    authorize('ADMIN', 'HR'),
    employeeController.createEmployee
);

router.post(
  '/:id/avatar',
  authenticate,
  upload.single('avatar'),
  employeeController.uploadAvatar
);

router.put(
    '/:id/job-info',
    authenticate,
    authorize('ADMIN', 'HR'),
    employeeController.updateJobInfo
);

router.put(
    '/:id/account',
    authenticate,
    authorize('ADMIN', 'HR'),
    employeeController.updateAccount
);

router.put(
    '/:id',
    authenticate,
    employeeController.updateEmployee
)

router.put(
    '/:/id/social-links',
    authenticate,
    authorize('ADMIN', 'HR'),
    employeeController.updateSocialLinks
)


// chỉ được xem dashboard cá nhân
// router.get(
//   '/me',
//   authenticate,
//   authorize('STAFF'),
//   controller.getMyInfo
// );

module.exports = router;
