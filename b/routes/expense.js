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

router.post(
    '/update',
    middleware.update
);

router.post(
    '/submit',
    middleware.submit
);

module.exports = router;