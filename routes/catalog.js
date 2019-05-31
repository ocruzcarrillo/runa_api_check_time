var express = require('express');
var router = express.Router();
var Catalog = require('../model/controllers/Catalog.js');

/* GET ALL */
router.get('/:catalog', function(req, res, next) {
  Catalog.getAll(req, res);
});

/* GET SINGLE BY ID */
router.get('/:catalog/:id', function(req, res, next) {
  Catalog.getOne(req, res);
});

/* SAVE */
router.post('/:catalog', function(req, res, next) {
  Catalog.create(req, res);
});

/* UPDATE */
router.put('/:catalog/:id', function(req, res, next) {
  Catalog.update(req, res);
});

/* DELETE */
router.delete('/:catalog/:id', function(req, res, next) {
  Catalog.update(req, res);
});

module.exports = router;
