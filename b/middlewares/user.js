var data = require( "../data/export" );
var controller = require( "../controllers/user" );
var utilData = require( "../utils/data" );

module.exports = {

    auth: function( req, res, next ){
        
        var id = req.get( "x-user-id" );

        if( req.method !== "POST"
            || req.originalUrl === "/user/select"
            || data.users.hasOwnProperty( id )
        ) next();
        else next({
            status: 403,
            body: {
                message: "Invalid user"
            }
        });
    },

    select: function( req, res, next ){

        controller.select( req, res )
        .then(function( users ){
            utilData.set( res, "success/body/users", users );
            next();
        })
        .catch(function( err ){
            next( err );
        });
    }
};