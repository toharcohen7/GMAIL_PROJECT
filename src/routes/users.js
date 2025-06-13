const express = require ('express')
const router = express.Router()
const controller = require('../controllers/users')

router.route('/me')
      .get(controller.getCurrentUser);
      
router.route('/')
        .post(controller.createUser)

router.route('/:id')
        .get(controller.getUserById)

module.exports = router