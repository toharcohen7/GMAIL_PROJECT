const express = require('express');
const router = express.Router();
const controllers = require('../controllers/tokens');

router.route('/')
  .post(controllers.signIn);

module.exports = router