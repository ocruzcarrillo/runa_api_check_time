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
  Employee.delete(req, res);
});

/* LOGIN */
router.post('/login', function(req, res, next) {
  Employee.login(req, res);
});

/* GET ALL INFO */
router.get('/info/', function(req, res, next) {
  Employee.getAllInfo(req, res);
});

/* GET INFO BY ID */
router.get('/info/:id', function(req, res, next) {
  Employee.getOneInfo(req, res);
});

/* SAVE INFO */
router.post('/info/', function(req, res, next) {
  Employee.createInfo(req, res);
});

/* UPDATE INFO */
router.put('/info/:id', function(req, res, next) {
  Employee.updateInfo(req, res);
});

/* DELETE INFO */
router.delete('/info/:id', function(req, res, next) {
  Employee.deleteInfo(req, res);
});

module.exports = router;
