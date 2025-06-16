const express = require('express');
const router = express.Router();

const matchController = require('../controllers/matchController/creatematch');


router.post('/create-match', matchController.createMatch);


module.exports = router;