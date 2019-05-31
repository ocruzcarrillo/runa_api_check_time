var express = require('express');
var router = express.Router();
var CheckTime = require('../model/controllers/CheckTime.js');

/* CHECK TIME REGISTERS */
router.get('/checkTime', function(req, res, next) {
  CheckTime.checkTimeAll(req, res);
});

/* CHECK TIME REGISTER */
router.post('/checkTime/:id', function(req, res, next) {
  CheckTime.checkTime(req, res);
});

/* USER CHECK TIME REGISTERS */
router.get('/checkTime/:id', function(req, res, next) {
  CheckTime.checkTimeUser(req, res);
});

module.exports = router;
