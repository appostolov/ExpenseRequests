var controller = require( "../controllers/expense" );
var utilData = require( "../utils/data" );

module.exports = {

    select: function( req, res, next ){
        controller.select( req, res )
        .then(function( result ){
            utilData.set( res, "success/body/requests", result );
            next();
        })
        .catch(function( err ){
            next( err );
        });
    },

    filter: function( req, res, next ){
        controller.filter( req, res )
        .then(function( result ){
            utilData.set( res, "success/body/requests", result );
            next();
        })
        .catch(function( err ){
            next( err );
        });
    },

    insert: function( req, res, next ){
        controller.insert( req, res )
        .then(function( request ){
            utilData.set( res, "success/body/request", request );
            next();
        })
        .catch(function( err ){
            next( err );
        });
    }
};