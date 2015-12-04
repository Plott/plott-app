'use strict';

var express = require('express');
var controller = require('./tile.controller');

var router = express.Router();

router.get('/:building/:floor/:z/:x/:y', controller.index);

module.exports = router;
