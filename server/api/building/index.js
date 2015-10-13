'use strict';

var express = require('express');
var controller = require('./building.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest: './public/uploads/'});

var router = express.Router();

router.use(upload.single('file'));

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.post('/upload', auth.isAuthenticated(), controller.upload);
router.post('/file/:id', auth.isAuthenticated(), controller.getFloorplan);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
