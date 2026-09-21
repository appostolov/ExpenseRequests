var express = require('express');
var router = express.Router();
var middleware = require( "../middlewares/expense" );

router.post(
    '/save',
    middleware.save
);

module.exports = router;