const router = require('express').Router();
const projectController = require('../controllers/project.controller');
const authenticate = require('../middlewares/auth.middleware');

router.get('/', authenticate, projectController.getProjects);

router.get('/memberProjects/:projectId', authenticate, projectController.getProjectMembers);

router.post('/', authenticate, projectController.createProject);

router.post(
  '/:projectId/members',
  authenticate,
  projectController.addProjectMembers
);

router.post(
  '/:projecId/task-group',
  authenticate,
  projectController.createTaskGroup
);

router.post(
  '/:taskGroupId/task',
  authenticate,
  projectController.createTask
);

router.delete(
  '/:id',
  authenticate,
  projectController.deleteProject
);

router.put(
  '/:id',
  authenticate,
  projectController.updateProject
);

module.exports = router;