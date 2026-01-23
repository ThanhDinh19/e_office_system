const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUser.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.get(
  '/users',
  authenticate,
  authorize('ADMIN'),
  adminUserController.getUsers
); 

router.post(
  '/users',
  authenticate,
  authorize('ADMIN'),
  adminUserController.createUser
);

router.put(
  '/users/:id',
  authenticate,
  authorize('ADMIN'),
  adminUserController.updateUser
);

router.get(
  '/users/export-contract/:id',
  authenticate,
  authorize('ADMIN'),
  adminUserController.exportContract
);

router.delete(
    '/users/:id',
    authenticate,
    authorize('ADMIN'),
    adminUserController.deleteUser
)

router.patch(
  '/users/:id/lock',
  authenticate,
  authorize('ADMIN'),
  adminUserController.lockUser
);

module.exports = router;

