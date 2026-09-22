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

router.post(
    '/insert',
    middleware.insert
);

module.exports = router;