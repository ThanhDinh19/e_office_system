const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const employeeRoutes = require('./employee.route');
const adminRoutes = require('./admin.user.route');
const roleRoutes = require('./role.route');
const departmentRoutes = require('./department.route');
const positionRoutes = require('./position.route');

router.use('/positions', positionRoutes);
router.use('/employees', employeeRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/roles', roleRoutes);
router.use('/departments', departmentRoutes);

module.exports = router;