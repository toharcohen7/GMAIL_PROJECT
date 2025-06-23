const express = require ('express')
const router = express.Router()
const controller = require('../controllers/mails')

router.route('/')
        .get(controller.get50Mails)
        .post(controller.createMail)

router.route('/search/:query')        
        .get(controller.searchQueryInMails)
        
router.route('/:id')
        .get(controller.getMailById)
        .patch(controller.updateMail)
        .delete(controller.deleteMail)

module.exports = router