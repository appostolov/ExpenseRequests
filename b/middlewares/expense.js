var controller = require( "../controllers/expense" );

module.exports = {

    save: function( req, res, next ){
        controller.save( req, res )
        .then(function( result ){
            next();
        })
        .catch(function( err ){
            next( err );
        });
    }
};