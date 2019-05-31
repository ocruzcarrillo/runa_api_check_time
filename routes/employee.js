var express = require('express');
var router = express.Router();
var Employee = require('../model/controllers/Employee.js');

/* GET ALL */
router.get('/', function(req, res, next) {
  Employee.getAll(req, res);
});

/* GET SINGLE BY ID */
router.get('/:id', function(req, res, next) {
  Employee.getOne(req, res);
});

/* SAVE */
router.post('/', function(req, res, next) {
  Employee.create(req, res);
});

/* UPDATE */
router.put('/:id', function(req, res, next) {
  Employee.update(req, res);
});

/* DELETE */
router.delete('/:id', function(req, res, next) {
  Employee.update(req, res);
});

/* LOGIN */
router.post('/login', function(req, res, next) {
  Employee.login(req, res);
});

module.exports = router;
