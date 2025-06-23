const express = require ('express')
const router = express.Router()
const controller = require('../controllers/labels')

router.route('/')
        .get(controller.getLabels)
        .post(controller.createLabel)

router.route('/:id')
        .get(controller.getLabelByName)
        .patch(controller.updateLabel)
        .delete(controller.deleteLabel)

module.exports = router