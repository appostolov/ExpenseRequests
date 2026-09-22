var express = require('express');
var router = express.Router();
var middleware = require( "../middlewares/expense" );

router.post(
    '/select',
    middleware.select
);

module.exports = router;