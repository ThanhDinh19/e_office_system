const router = require('express').Router();
const ITServiceController = require('../controllers/itservice.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');


router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    ITServiceController.addITService
);

router.get(
    '/',
    authenticate,
    ITServiceController.getITService
);

router.put(
    '/:id/edit',
    authenticate,
    authorize('ADMIN'),
    ITServiceController.editITService
);

router.delete(
    '/:id/delete',
    authenticate,
    authorize('ADMIN'),
    ITServiceController.deleteITService
);


module.exports = router;