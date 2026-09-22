var express = require('express');
var router = express.Router();
var middleware = require( "../middlewares/expense" );

router.post(
    '/select',
    middleware.select
);

router.post(
    '/filter',
    middleware.filter
);

module.exports = router;