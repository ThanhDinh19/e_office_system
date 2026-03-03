const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const employeeRoutes = require('./employee.route');
const adminRoutes = require('./admin.user.route');
const roleRoutes = require('./role.route');
const departmentRoutes = require('./department.route');
const positionRoutes = require('./position.route');
const projectRoutes = require('./project.route');
const ticketRoutes = require('./ticket.route');
const itserviceRoute = require('./itservice.route');

router.use('/itservices', itserviceRoute);
router.use('/tickets', ticketRoutes);
router.use('/positions', positionRoutes);
router.use('/employees', employeeRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/roles', roleRoutes);
router.use('/departments', departmentRoutes);
router.use('/projects', projectRoutes);

module.exports = router;