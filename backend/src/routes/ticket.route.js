const router = require('express').Router();
const ticketController = require('../controllers/ticket.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const upload = require('../middlewares/uploadTicketAttachment.middleware');

router.post(
    '/',
    authenticate,
    authorize('ADMIN', 'HR', 'STAFF', 'MANAGER', 'IT_SUPPORT'),
    upload.array('attachments', 10),
    ticketController.createTicket
);

router.get(
    '/',
    authenticate,
    ticketController.getTicket
);

router.get(
    '/new-count',
    authenticate,
    authorize('IT_SUPPORT'),
    ticketController.getNewCount
)

module.exports = router;